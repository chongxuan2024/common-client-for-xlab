# Android 打包说明

本文档详细介绍如何为React Native应用生成Android签名证书，以及如何配置GitHub Actions自动打包。

## 1. 生成签名密钥（Keystore）

Android要求所有APK在安装和更新时必须使用相同的证书签名。首先需要生成一个签名密钥。

### 1.1 使用keytool生成密钥

在项目的`android/app`目录下运行以下命令：

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**命令说明：**
- `-storetype PKCS12`: 密钥库类型
- `-keystore my-upload-key.keystore`: 生成的密钥库文件名
- `-alias my-key-alias`: 密钥别名（请记住这个别名）
- `-keyalg RSA -keysize 2048`: 使用RSA算法，密钥长度2048位
- `-validity 10000`: 有效期10000天（约27年）

### 1.2 填写密钥信息

执行命令后，系统会提示您输入以下信息：

1. **密钥库口令（Keystore Password）**：设置密钥库的密码，请妥善保管
2. **密钥口令（Key Password）**：设置密钥的密码，可以与密钥库口令相同
3. **姓名**：您的姓名或组织名称
4. **组织单位**：您的部门名称
5. **组织**：您的公司或组织名称
6. **城市**：您所在的城市
7. **省份**：您所在的省份
8. **国家代码**：两位国家代码（如：CN表示中国）

**示例输入：**
```
输入密钥库口令: MyStrongPassword123
再次输入新口令: MyStrongPassword123
您的名字与姓氏是什么?
  [Unknown]:  Zhang San
您的组织单位名称是什么?
  [Unknown]:  Development
您的组织名称是什么?
  [Unknown]:  MyCompany
您所在的城市或区域名称是什么?
  [Unknown]:  Beijing
您所在的省/市/自治区名称是什么?
  [Unknown]:  Beijing
该单位的双字母国家/地区代码是什么?
  [Unknown]:  CN
```

## 2. 配置Gradle构建文件

密钥生成后，需要配置项目以使用该密钥进行签名。

### 2.1 设置gradle.properties（本地开发）

在`android/gradle.properties`文件中添加（**注意：此文件不应提交到版本控制**）：

```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=你的密钥库口令
MYAPP_UPLOAD_KEY_PASSWORD=你的密钥口令
```

### 2.2 更新.gitignore

确保敏感文件不会被提交到代码库：

```
# 添加到 android/.gitignore
gradle.properties
*.keystore
*.jks
```

## 3. 本地构建Release版本

配置完成后，可以在本地构建release版本：

### 3.1 构建APK

```bash
cd android
./gradlew assembleRelease
```

生成的APK位置：`android/app/build/outputs/apk/release/app-release.apk`

### 3.2 构建AAB（Google Play上架使用）

```bash
cd android
./gradlew bundleRelease
```

生成的AAB位置：`android/app/build/outputs/bundle/release/app-release.aab`

**APK vs AAB：**
- **APK**：可以直接安装在Android设备上，适合直接分发
- **AAB**：Google Play要求的格式，文件更小，Google Play会根据设备配置生成优化的APK

## 4. 配置GitHub Actions自动打包

为了在GitHub上自动构建应用，需要配置GitHub Secrets。

### 4.1 准备密钥库的Base64编码

将密钥库文件转换为Base64编码：

**Linux/Mac：**
```bash
base64 -i android/app/my-upload-key.keystore | pbcopy  # Mac (复制到剪贴板)
base64 android/app/my-upload-key.keystore              # Linux
```

**Windows (PowerShell)：**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("android\app\my-upload-key.keystore")) | Set-Clipboard
```

### 4.2 在GitHub配置Secrets

进入GitHub仓库页面：

1. 点击 **Settings（设置）**
2. 点击左侧的 **Secrets and variables** > **Actions**
3. 点击 **New repository secret**
4. 添加以下secrets：

| Secret名称 | 说明 | 示例值 |
|-----------|------|--------|
| `ANDROID_KEYSTORE_BASE64` | 密钥库文件的Base64编码 | （上一步生成的长字符串） |
| `ANDROID_KEY_ALIAS` | 密钥别名 | `my-key-alias` |
| `ANDROID_STORE_PASSWORD` | 密钥库口令 | `MyStrongPassword123` |
| `ANDROID_KEY_PASSWORD` | 密钥口令 | `MyStrongPassword123` |

## 5. Google Play上架流程

### 5.1 创建Google Play开发者账号

1. 访问 [Google Play Console](https://play.google.com/console)
2. 支付一次性注册费（25美元）
3. 填写开发者信息

### 5.2 创建应用

1. 登录Google Play Console
2. 点击"创建应用"
3. 填写应用名称、默认语言、应用类型（应用或游戏）
4. 选择是否免费应用

### 5.3 准备应用商店列表

需要准备以下内容：

1. **应用名称**：最多50个字符
2. **简短描述**：最多80个字符
3. **完整描述**：最多4000个字符
4. **应用图标**：512x512 PNG，最大1MB
5. **功能图片**：1024x500 JPG或PNG
6. **屏幕截图**：至少2张，最多8张
   - 手机：至少320px，最多3840px
   - 推荐尺寸：1080x1920 或 1080x2340

### 5.4 上传AAB文件

1. 在左侧菜单选择"发布" > "生产"
2. 点击"创建新版本"
3. 上传AAB文件（`app-release.aab`）
4. 填写版本说明
5. 查看并发布

### 5.5 应用审核

- Google通常需要几小时到几天时间审核
- 确保应用符合[Google Play政策](https://play.google.com/about/developer-content-policy/)
- 审核通过后，应用将在Google Play上架

## 6. 直接分发APK（不通过应用商店）

如果不想通过Google Play，也可以直接分发APK：

1. 将`app-release.apk`发送给用户
2. 用户需要在设备设置中启用"允许安装未知来源的应用"
3. 用户下载并安装APK

## 7. 常见问题

### 7.1 找不到keytool命令

keytool是JDK的一部分，确保已安装Java JDK并配置环境变量。

**检查Java安装：**
```bash
java -version
```

### 7.2 签名配置错误

如果构建时出现签名错误，检查：
- `gradle.properties`中的配置是否正确
- 密钥库文件路径是否正确
- 密码是否正确

### 7.3 AAB上传失败

确保：
- AAB文件完整未损坏
- 版本号（versionCode）比之前上传的版本更大
- 已正确签名

### 7.4 修改应用ID

应用ID在`android/app/build.gradle`中定义：

```gradle
defaultConfig {
    applicationId "com.mywebviewapp"  // 修改为您的应用ID
    // ...
}
```

**注意：** 应用ID必须唯一，一旦上架就不能更改。

## 8. 安全建议

1. **永远不要将密钥库文件提交到版本控制系统**
2. **密钥库密码应使用强密码**
3. **定期备份密钥库文件（丢失将无法更新应用）**
4. **使用GitHub Secrets存储敏感信息**
5. **限制密钥库文件的访问权限**

## 9. 版本管理

每次发布新版本时，需要更新版本号：

编辑`android/app/build.gradle`：

```gradle
defaultConfig {
    versionCode 2        // 整数，每次发布递增
    versionName "1.1.0"  // 显示给用户的版本号
}
```

- **versionCode**：整数，用于应用内部版本管理，每次发布必须递增
- **versionName**：字符串，显示给用户，建议使用语义化版本号（如：1.0.0）
