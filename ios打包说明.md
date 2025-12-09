# iOS 打包说明

本文档详细介绍如何为React Native应用生成iOS签名证书，以及如何配置GitHub Actions自动打包和上架App Store。

## 1. 前置要求

### 1.1 必需条件

1. **Mac电脑**：iOS应用打包必须在macOS上进行
2. **Apple Developer账号**：
   - 个人账号：99美元/年
   - 企业账号：299美元/年
   - 注册地址：https://developer.apple.com/programs/

3. **Xcode**：从Mac App Store免费下载最新版本
4. **CocoaPods**：iOS依赖管理工具

### 1.2 安装CocoaPods

```bash
sudo gem install cocoapods
```

或使用Homebrew：

```bash
brew install cocoapods
```

## 2. 获取iOS证书和Provisioning Profile

### 2.1 登录Apple Developer

1. 访问 [Apple Developer](https://developer.apple.com/account/)
2. 使用您的Apple ID登录

### 2.2 创建App ID

1. 进入 **Certificates, Identifiers & Profiles**
2. 点击左侧的 **Identifiers**
3. 点击 **+** 按钮创建新的Identifier
4. 选择 **App IDs**，点击Continue
5. 选择 **App**，点击Continue
6. 填写信息：
   - **Description（描述）**：应用描述（如：My WebView App）
   - **Bundle ID**：应用唯一标识符（如：com.yourcompany.mywebviewapp）
     - 选择 **Explicit**
     - 格式：反向域名（如：com.apple.testapp）
7. 选择需要的Capabilities（功能）
8. 点击Continue，然后点击Register

**重要：** Bundle ID必须与Xcode项目中的Bundle Identifier一致。

### 2.3 创建证书（Certificate）

iOS有两种主要证书类型：

#### A. 开发证书（Development Certificate）

用于开发和测试：

1. 进入 **Certificates, Identifiers & Profiles** > **Certificates**
2. 点击 **+** 按钮
3. 选择 **iOS App Development**
4. 点击Continue

#### B. 发布证书（Distribution Certificate）

用于App Store发布：

1. 进入 **Certificates, Identifiers & Profiles** > **Certificates**
2. 点击 **+** 按钮
3. 选择 **Apple Distribution**
4. 点击Continue

#### 生成CSR文件（Certificate Signing Request）

在Mac上：

1. 打开 **钥匙串访问（Keychain Access）**
   - 应用程序 > 实用工具 > 钥匙串访问
2. 菜单栏选择：**钥匙串访问** > **证书助理** > **从证书颁发机构请求证书**
3. 填写信息：
   - **用户电子邮件地址**：您的Apple ID邮箱
   - **常用名称**：您的姓名或公司名称
   - **请求是**：选择"存储到磁盘"
4. 点击"继续"，保存CSR文件（如：CertificateSigningRequest.certSigningRequest）

#### 上传CSR并下载证书

1. 返回浏览器，点击"Choose File"上传刚才生成的CSR文件
2. 点击Continue
3. 下载生成的证书（.cer文件）
4. 双击证书文件，将其添加到钥匙串

### 2.4 创建Provisioning Profile

Provisioning Profile将证书、App ID和设备关联起来。

#### A. 开发用Provisioning Profile

1. 进入 **Profiles**
2. 点击 **+** 按钮
3. 选择 **iOS App Development**
4. 选择之前创建的App ID
5. 选择开发证书
6. 选择测试设备（需要提前添加设备UDID）
7. 输入Profile名称
8. 下载Provisioning Profile（.mobileprovision文件）

#### B. 发布用Provisioning Profile

1. 进入 **Profiles**
2. 点击 **+** 按钮
3. 选择 **App Store**（用于App Store发布）
4. 选择之前创建的App ID
5. 选择发布证书
6. 输入Profile名称
7. 下载Provisioning Profile（.mobileprovision文件）

### 2.5 导出证书为P12文件

P12文件包含私钥和证书，用于CI/CD：

1. 打开 **钥匙串访问**
2. 在左侧选择 **登录** > **我的证书**
3. 找到您的开发或发布证书
4. 展开证书，会看到下面的私钥
5. 同时选中证书和私钥
6. 右键点击，选择 **导出2项**
7. 选择文件格式为 **个人信息交换（.p12）**
8. 设置密码（请记住此密码）
9. 保存P12文件

## 3. 配置Xcode项目

### 3.1 打开Xcode项目

```bash
cd ios
open MyWebViewApp.xcworkspace
```

**注意：** 打开`.xcworkspace`文件，不是`.xcodeproj`文件。

### 3.2 配置签名

1. 在Xcode左侧项目导航器中选择项目
2. 选择目标（Target）：MyWebViewApp
3. 点击 **Signing & Capabilities** 标签
4. 配置如下：

**Debug配置：**
- **Automatically manage signing**：可以勾选（用于开发）
- **Team**：选择您的开发团队
- **Bundle Identifier**：确保与App ID一致

**Release配置：**
- 取消勾选 **Automatically manage signing**
- **Provisioning Profile**：选择发布用的Provisioning Profile
- **Signing Certificate**：选择发布证书

### 3.3 配置版本信息

1. 在 **General** 标签中：
   - **Display Name**：应用显示名称
   - **Version**：版本号（如：1.0.0）
   - **Build**：构建号（整数，如：1）

## 4. 本地构建IPA

### 4.1 安装依赖

```bash
cd ios
pod install
```

### 4.2 清理构建

```bash
cd ios
xcodebuild clean -workspace MyWebViewApp.xcworkspace -scheme MyWebViewApp
```

### 4.3 创建Archive

```bash
xcodebuild -workspace MyWebViewApp.xcworkspace \
  -scheme MyWebViewApp \
  -configuration Release \
  -archivePath ./build/MyWebViewApp.xcarchive \
  archive
```

### 4.4 导出IPA

创建`ExportOptions.plist`文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>
```

**method选项说明：**
- `app-store`：上传到App Store
- `ad-hoc`：Ad Hoc分发（最多100台设备）
- `enterprise`：企业内部分发
- `development`：开发测试

导出IPA：

```bash
xcodebuild -exportArchive \
  -archivePath ./build/MyWebViewApp.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath ./build
```

生成的IPA位于：`ios/build/MyWebViewApp.ipa`

## 5. 配置GitHub Actions

### 5.1 获取必要信息

您需要收集以下信息：

1. **Team ID**：
   - 登录 [Apple Developer](https://developer.apple.com/account/)
   - 查看 **Membership** 页面，记录Team ID（10位字符）

2. **证书（P12）的Base64编码**：
   ```bash
   base64 -i certificate.p12 | pbcopy  # Mac
   ```

3. **Provisioning Profile的Base64编码**：
   ```bash
   base64 -i profile.mobileprovision | pbcopy  # Mac
   ```

4. **其他信息**：
   - P12文件密码
   - 证书名称（Code Sign Identity）
   - Provisioning Profile名称

### 5.2 配置GitHub Secrets

在GitHub仓库中添加以下Secrets：

| Secret名称 | 说明 | 如何获取 |
|-----------|------|---------|
| `IOS_CERTIFICATE_BASE64` | P12证书的Base64编码 | `base64 -i certificate.p12` |
| `IOS_CERTIFICATE_PASSWORD` | P12文件的密码 | 创建P12时设置的密码 |
| `IOS_PROVISIONING_PROFILE_BASE64` | Provisioning Profile的Base64编码 | `base64 -i profile.mobileprovision` |
| `IOS_PROVISIONING_PROFILE_NAME` | Provisioning Profile名称 | 在Apple Developer网站查看 |
| `IOS_CODE_SIGN_IDENTITY` | 证书名称 | 如：`Apple Distribution: Your Name (TEAM_ID)` |
| `IOS_TEAM_ID` | Team ID | 10位字符，在Apple Developer Membership页面查看 |
| `IOS_KEYCHAIN_PASSWORD` | 临时Keychain密码 | 任意强密码，用于CI构建 |

### 5.3 查找Code Sign Identity

在Mac终端运行：

```bash
security find-identity -v -p codesigning
```

输出类似：
```
1) ABC123DEF456 "Apple Development: Your Name (TEAM_ID)"
2) XYZ789GHI012 "Apple Distribution: Your Name (TEAM_ID)"
```

使用引号中的完整字符串作为`IOS_CODE_SIGN_IDENTITY`。

## 6. App Store Connect配置

### 6.1 创建App Store应用

1. 登录 [App Store Connect](https://appstoreconnect.apple.com/)
2. 点击 **我的App**
3. 点击 **+** > **新建App**
4. 填写信息：
   - **平台**：iOS
   - **名称**：应用名称（在App Store显示）
   - **主要语言**：选择主要语言
   - **Bundle ID**：选择之前创建的App ID
   - **SKU**：产品唯一标识符（可以使用Bundle ID）
   - **用户访问权限**：完全访问权限

### 6.2 填写应用信息

需要准备以下内容：

#### 应用信息
- **名称**：应用在App Store的显示名称（最多30字符）
- **副标题**：简短描述（最多30字符，可选）
- **隐私政策URL**：隐私政策页面链接（必需）
- **类别**：主要类别和次要类别

#### 定价和销售范围
- **价格**：选择价格等级（0为免费）
- **销售范围**：选择销售的国家/地区

#### 应用预览和截图

需要为不同设备尺寸准备截图：

1. **6.5英寸显示屏**（必需）：1242x2688 或 1284x2778
2. **5.5英寸显示屏**：1242x2208
3. **iPad Pro (12.9英寸)**（如果支持iPad）：2048x2732

**要求：**
- 格式：JPG或PNG
- 色彩空间：RGB
- 最少2张，最多10张

#### 应用描述
- **描述**：应用功能描述（最多4000字符）
- **关键词**：用于搜索的关键词（最多100字符，用逗号分隔）
- **技术支持URL**：技术支持页面
- **营销URL**：营销页面（可选）

#### 应用图标
- **尺寸**：1024x1024像素
- **格式**：JPG或PNG（不能包含透明通道）
- **不能包含**：圆角、阴影或其他效果

### 6.3 构建版本信息

- **版权**：版权信息（如：2024 Your Company）
- **年龄分级**：根据内容选择适当的年龄分级
- **App审核信息**：
  - **联系信息**：电话、邮箱
  - **备注**：给审核人员的说明
  - **演示账号**：如果应用需要登录，提供测试账号

## 7. 上传IPA到App Store

### 7.1 使用Xcode上传

1. 在Xcode中，选择 **Product** > **Archive**
2. 构建完成后，会打开Organizer窗口
3. 选择刚创建的Archive
4. 点击 **Distribute App**
5. 选择 **App Store Connect**
6. 点击 **Upload**
7. 选择签名选项，点击Next
8. 点击Upload

### 7.2 使用命令行上传

需要Application Specific Password：

1. 登录 [appleid.apple.com](https://appleid.apple.com/)
2. 在"安全"部分生成App专用密码
3. 记录此密码

上传IPA：

```bash
xcrun altool --upload-app \
  --type ios \
  --file MyWebViewApp.ipa \
  --username "your-apple-id@email.com" \
  --password "app-specific-password"
```

或使用Transporter应用：
1. 从Mac App Store下载Transporter
2. 打开应用，登录Apple ID
3. 拖拽IPA文件到窗口
4. 点击"交付"

### 7.3 构建处理

上传后，Apple会处理您的构建，通常需要10-30分钟。处理完成后：

1. 登录App Store Connect
2. 进入您的应用
3. 点击 **TestFlight** 标签
4. 会看到新上传的构建

## 8. 提交审核

### 8.1 准备审核

1. 在App Store Connect中，进入应用页面
2. 点击左侧的 **App Store** 标签
3. 点击 **+ 版本或平台**（如果是首次提交）
4. 选择构建版本
5. 填写"此版本的新增内容"
6. 检查所有必填信息是否完整

### 8.2 提交审核

1. 确保所有必填项都已完成
2. 点击 **提交以供审核**
3. 回答问卷（关于加密、广告等）
4. 点击 **提交**

### 8.3 审核流程

- **等待审核**：通常24-48小时
- **正在审核中**：审核团队正在审核
- **被拒绝**：需要修改后重新提交
- **可供销售**：审核通过，应用上架

## 9. TestFlight测试

在正式发布前，可以使用TestFlight进行测试：

### 9.1 内部测试

1. 在App Store Connect中，进入应用的TestFlight标签
2. 点击构建版本
3. 在"内部测试"部分添加测试人员
4. 测试人员会收到邮件邀请

### 9.2 外部测试

1. 创建测试组
2. 添加外部测试人员（最多10,000人）
3. 外部测试需要Beta App审核（通常较快）
4. 测试人员下载TestFlight应用，使用邀请链接安装

## 10. 常见问题

### 10.1 签名失败

**错误：** "Signing for requires a development team"

**解决：**
- 在Xcode中设置Team
- 确保Provisioning Profile已安装

### 10.2 找不到Provisioning Profile

**解决：**
1. 双击.mobileprovision文件安装
2. 或手动复制到：`~/Library/MobileDevice/Provisioning Profiles/`

### 10.3 证书过期

**解决：**
- 证书有效期1年
- 在Apple Developer网站撤销旧证书
- 创建新证书
- 更新Provisioning Profile

### 10.4 Archive失败

**解决：**
- 清理构建：Product > Clean Build Folder
- 删除DerivedData：`rm -rf ~/Library/Developer/Xcode/DerivedData`
- 重新安装CocoaPods：`cd ios && pod install`

### 10.5 Upload失败

**错误：** "Invalid Bundle Structure"

**解决：**
- 检查info.plist配置
- 确保版本号正确
- 检查图标和启动图

## 11. 版本管理

每次发布新版本：

### 11.1 更新版本号

在Xcode中：
- **Version**：显示给用户的版本号（如：1.0.0 -> 1.1.0）
- **Build**：内部版本号（必须递增，如：1 -> 2）

或在`ios/MyWebViewApp/Info.plist`中：

```xml
<key>CFBundleShortVersionString</key>
<string>1.1.0</string>
<key>CFBundleVersion</key>
<string>2</string>
```

### 11.2 语义化版本

建议使用语义化版本号：`主版本号.次版本号.修订号`

- **主版本号**：重大更新，可能不兼容旧版本
- **次版本号**：新功能，向后兼容
- **修订号**：Bug修复

## 12. 安全建议

1. **证书和Profile文件安全**：
   - 不要将.p12、.cer、.mobileprovision文件提交到版本控制
   - 使用强密码保护P12文件
   - 定期更新证书

2. **GitHub Secrets**：
   - 所有敏感信息必须存储在GitHub Secrets中
   - 不要在代码或日志中暴露密钥

3. **Team权限管理**：
   - 仅授予必要人员证书和Profile访问权限
   - 使用不同的证书用于开发和发布

## 13. 自动化发布到App Store

如果希望GitHub Actions自动上传到App Store，需要：

1. **生成API Key**：
   - 登录App Store Connect
   - 进入 **用户和访问** > **密钥**
   - 创建新的API密钥（权限：App Manager或Admin）
   - 下载.p8文件（只能下载一次）

2. **配置GitHub Secrets**：
   - `APP_STORE_CONNECT_API_KEY_ID`：密钥ID
   - `APP_STORE_CONNECT_API_ISSUER_ID`：发行者ID
   - `APP_STORE_CONNECT_API_KEY_CONTENT`：.p8文件内容的Base64编码

3. **在GitHub Actions中添加上传步骤**：

```yaml
- name: Upload to App Store
  run: |
    xcrun altool --upload-app \
      --type ios \
      --file ios/build/MyWebViewApp.ipa \
      --apiKey ${{ secrets.APP_STORE_CONNECT_API_KEY_ID }} \
      --apiIssuer ${{ secrets.APP_STORE_CONNECT_API_ISSUER_ID }}
```

这样就可以实现从代码提交到App Store的全自动发布流程！
