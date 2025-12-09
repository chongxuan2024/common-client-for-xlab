# My WebView App

一个基于React Native的WebView应用，支持Android和iOS平台。

## 功能特性

- ✨ 启动时显示Loading页面（1秒过渡动画）
- 🌐 使用全屏WebView加载网页内容
- 📱 支持Android和iOS双平台
- 🤖 自动化CI/CD构建和发布
- 📦 支持打包APK、AAB和IPA

## 快速开始

### 环境要求

- Node.js >= 20
- npm 或 yarn
- Java JDK 17（Android开发）
- Xcode（iOS开发，仅Mac）
- CocoaPods（iOS开发）

### 安装依赖

```bash
# 安装Node依赖
npm install

# iOS依赖（仅Mac）
cd ios
pod install
cd ..
```

### 运行应用

#### Android

```bash
# 启动Metro bundler
npm start

# 在另一个终端运行Android
npm run android
```

或使用Android Studio打开`android`目录运行。

#### iOS（仅Mac）

```bash
# 启动Metro bundler
npm start

# 在另一个终端运行iOS
npm run ios
```

或使用Xcode打开`ios/MyWebViewApp.xcworkspace`运行。

## 项目结构

```
MyWebViewApp/
├── src/
│   ├── screens/
│   │   ├── LoadingScreen.tsx    # Loading页面
│   │   └── HomeScreen.tsx       # WebView主页
│   ├── navigation/
│   │   ├── AppNavigator.tsx     # 导航配置
│   │   └── types.ts             # 类型定义
├── assets/
│   └── loading.png              # Loading图片资源
├── android/                      # Android原生代码
├── ios/                         # iOS原生代码
├── .github/
│   └── workflows/
│       └── build-release.yml    # CI/CD配置
├── App.tsx                      # 应用入口
└── package.json
```

## 配置WebView URL

要修改WebView加载的URL，编辑 `src/screens/HomeScreen.tsx`：

```typescript
<WebView
  source={{ uri: 'https://www.baidu.com' }}  // 修改为您的URL
  // ...
/>
```

## 构建发布版本

### Android

#### 构建APK

```bash
cd android
./gradlew assembleRelease
```

生成文件：`android/app/build/outputs/apk/release/app-release.apk`

#### 构建AAB（Google Play）

```bash
cd android
./gradlew bundleRelease
```

生成文件：`android/app/build/outputs/bundle/release/app-release.aab`

### iOS

```bash
cd ios

# 创建Archive
xcodebuild -workspace MyWebViewApp.xcworkspace \
  -scheme MyWebViewApp \
  -configuration Release \
  -archivePath ./build/MyWebViewApp.xcarchive \
  archive

# 导出IPA（需要配置ExportOptions.plist）
xcodebuild -exportArchive \
  -archivePath ./build/MyWebViewApp.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath ./build
```

## 自动化构建（CI/CD）

本项目配置了GitHub Actions，可以在代码提交时自动构建Android和iOS应用。

### 配置步骤

1. **准备证书和密钥**
   - 参考 [android打包说明.md](./android打包说明.md)
   - 参考 [ios打包说明.md](./ios打包说明.md)

2. **配置GitHub Secrets**

在GitHub仓库的Settings > Secrets and variables > Actions中添加：

**Android Secrets:**
- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEY_ALIAS`
- `ANDROID_STORE_PASSWORD`
- `ANDROID_KEY_PASSWORD`

**iOS Secrets:**
- `IOS_CERTIFICATE_BASE64`
- `IOS_CERTIFICATE_PASSWORD`
- `IOS_PROVISIONING_PROFILE_BASE64`
- `IOS_PROVISIONING_PROFILE_NAME`
- `IOS_CODE_SIGN_IDENTITY`
- `IOS_TEAM_ID`
- `IOS_KEYCHAIN_PASSWORD`

3. **触发构建**

推送代码到main或master分支会触发构建：

```bash
git add .
git commit -m "Update app"
git push origin main
```

创建版本标签会创建GitHub Release：

```bash
git tag v1.0.0
git push origin v1.0.0
```

## 应用商店上架

### Google Play（Android）

详细步骤请参考：[android打包说明.md](./android打包说明.md)

关键步骤：
1. 创建Google Play开发者账号（$25一次性费用）
2. 创建应用并填写商店信息
3. 上传AAB文件
4. 提交审核

### App Store（iOS）

详细步骤请参考：[ios打包说明.md](./ios打包说明.md)

关键步骤：
1. 注册Apple Developer账号（$99/年）
2. 配置App Store Connect
3. 上传IPA文件
4. 提交审核

## 修改应用信息

### 应用名称

- **Android**: 修改 `android/app/src/main/res/values/strings.xml`
- **iOS**: 在Xcode中修改Display Name

### 应用图标

- **Android**: 替换 `android/app/src/main/res/mipmap-*/ic_launcher.png`
- **iOS**: 在Xcode中替换Assets.xcassets中的AppIcon

### Bundle ID / Package Name

- **Android**: 修改 `android/app/build.gradle` 中的 `applicationId`
- **iOS**: 在Xcode中修改Bundle Identifier

### 版本号

- **Android**: 修改 `android/app/build.gradle` 中的 `versionCode` 和 `versionName`
- **iOS**: 在Xcode或Info.plist中修改Version和Build

## 常见问题

### 1. Metro bundler启动失败

```bash
# 清理缓存
npm start -- --reset-cache
```

### 2. Android构建失败

```bash
# 清理构建
cd android
./gradlew clean
cd ..
```

### 3. iOS构建失败

```bash
# 清理CocoaPods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### 4. WebView无法加载HTTP网站

- **Android**: 已配置`usesCleartextTraffic`
- **iOS**: 已配置`NSAllowsArbitraryLoads`（注意：App Store可能要求使用HTTPS）

## 技术栈

- **React Native**: 0.82.1
- **React**: 19.1.1
- **React Navigation**: 用于页面导航
- **React Native WebView**: 用于显示网页内容
- **TypeScript**: 类型安全

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 支持

如有问题，请查看：
- [React Native官方文档](https://reactnative.dev/)
- [Android打包说明](./android打包说明.md)
- [iOS打包说明](./ios打包说明.md)
