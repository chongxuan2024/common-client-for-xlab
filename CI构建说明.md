# CI 构建说明

## 概述

本项目的 GitHub Actions workflow 支持根据配置文件自动控制构建行为：
- 通过 `buildAndroid` 和 `buildIOS` 控制是否构建对应平台
- 通过 `isDebug` 标志自动选择 Debug 或 Release 构建模式

## 构建模式

### Debug 模式 (`isDebug=true`)

当配置文件中设置 `isDebug=true` 时：

#### Android
- **不需要配置签名证书和密钥库**
- 使用 `./gradlew assembleDebug` 构建
- 生成 `app-debug.apk`
- 上传为 `android-apk-debug` artifact

#### iOS  
- **不需要配置 Provisioning Profile 和证书**
- 构建为模拟器版本（`-sdk iphonesimulator`）
- 禁用代码签名（`CODE_SIGNING_REQUIRED=NO`）
- 生成 `MyWebViewApp-Debug.zip`（包含 .app 文件）
- 上传为 `ios-app-debug` artifact

### Release 模式 (`isDebug=false` 或未设置)

当配置文件中设置 `isDebug=false` 或未设置时：

#### Android
- **需要配置签名证书和密钥库**
- 需要以下 GitHub Secrets：
  - `ANDROID_KEYSTORE_BASE64`：Base64 编码的密钥库文件
  - `ANDROID_KEY_ALIAS`：密钥别名
  - `ANDROID_STORE_PASSWORD`：密钥库密码
  - `ANDROID_KEY_PASSWORD`：密钥密码
- 使用 `./gradlew assembleRelease` 和 `bundleRelease` 构建
- 生成 `app-release.apk` 和 `app-release.aab`
- 上传为 `android-apk` 和 `android-aab` artifacts

#### iOS
- **需要配置 Provisioning Profile 和证书**
- 需要以下 GitHub Secrets：
  - `IOS_PROVISIONING_PROFILE_BASE64`：Base64 编码的 provisioning profile
  - `IOS_CERTIFICATE_BASE64`：Base64 编码的证书文件（.p12）
  - `IOS_CERTIFICATE_PASSWORD`：证书密码
  - `IOS_KEYCHAIN_PASSWORD`：临时 keychain 密码
  - `IOS_CODE_SIGN_IDENTITY`：代码签名身份
  - `IOS_PROVISIONING_PROFILE_NAME`：Provisioning profile 名称
  - `IOS_TEAM_ID`：开发团队 ID
- 构建并导出 IPA 文件
- 生成 `MyWebViewApp.ipa`
- 上传为 `ios-ipa` artifact

## 配置方式

在 `assets/{app_name}/app.cfg` 文件中设置：

```ini
# 控制是否构建对应平台
buildAndroid=true   # true=构建Android, false=跳过Android构建
buildIOS=false      # true=构建iOS, false=跳过iOS构建

# 控制构建模式
isDebug=true        # true=Debug模式（不需要证书），false=Release模式（需要证书）
```

### 配置示例

**示例 1：只构建 Android Debug 版本**
```ini
buildAndroid=true
buildIOS=false
isDebug=true
```

**示例 2：同时构建 Android 和 iOS Release 版本**
```ini
buildAndroid=true
buildIOS=true
isDebug=false
```

**示例 3：只构建 iOS Debug 版本**
```ini
buildAndroid=false
buildIOS=true
isDebug=true
```

## 工作流程

1. **检查配置** (`check-config` job)：
   - 从 `assets/build.app` 读取应用配置目录
   - 读取该目录下的 `app.cfg` 文件
   - 提取 `buildAndroid`、`buildIOS` 和 `isDebug` 配置
   - 将配置作为输出供后续 jobs 使用

2. **构建 Android** (`build-android` job)：
   - **仅在 `buildAndroid=true` 时执行**
   - 根据 `isDebug` 值决定是否配置签名证书
   - 执行对应的构建命令（Debug 或 Release）
   - 上传构建产物到 GitHub Artifacts

3. **构建 iOS** (`build-ios` job)：
   - **仅在 `buildIOS=true` 时执行**
   - 根据 `isDebug` 值决定是否配置证书和 Provisioning Profile
   - 执行对应的构建命令（Debug 或 Release）
   - 上传构建产物到 GitHub Artifacts

4. **创建发布** (`create-release` job，仅标签触发)：
   - 根据配置下载对应的构建产物
   - 创建 GitHub Release 并附加所有构建的产物

## 使用场景

### Debug 模式适用于：
- 开发和测试阶段
- 不需要发布到应用商店
- 快速验证构建流程
- 没有配置证书和签名的情况

### Release 模式适用于：
- 正式发布版本
- 需要上传到 Google Play Store 或 App Store
- 需要签名的正式构建

## 注意事项

1. **平台控制**：
   - 设置 `buildAndroid=false` 时，Android 构建 job 会被完全跳过，节省 CI 时间
   - 设置 `buildIOS=false` 时，iOS 构建 job 会被完全跳过，节省 CI 时间
   - 可以只构建一个平台，也可以同时构建两个平台

2. **Debug 模式限制**：
   - Debug 模式下构建的 iOS 应用只能在模拟器上运行，无法在真机上安装
   - Debug 模式下的 Android APK 使用 debug 签名，不适合发布到应用商店

3. **Release 模式要求**：
   - Release 模式需要正确配置所有必要的 GitHub Secrets
   - Android Release 需要配置密钥库相关的 secrets
   - iOS Release 需要配置证书和 Provisioning Profile 相关的 secrets

4. **配置文件路径**：
   - 配置文件必须位于：`assets/{build.app 中指定的名称}/app.cfg`
   - 确保配置文件格式正确，每行一个配置项

## 触发条件

workflow 在以下情况触发：
- 推送到 `main` 或 `master` 分支
- 推送以 `v` 开头的标签（如 `v1.0.0`）

只有标签推送会创建 GitHub Release。

