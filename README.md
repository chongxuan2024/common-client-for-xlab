# My WebView App

一个基于React Native的**通用WebView框架**，支持通过配置文件快速创建和管理多个不同的WebView应用。

## 🌟 核心特性

- ✨ **配置驱动**: 通过配置文件快速创建不同的应用，无需修改代码
- 📁 **多应用管理**: 在一个项目中管理多个应用配置
- 🚀 **快速切换**: 只需修改一个文件即可切换不同应用
- 🌐 **全屏WebView**: 加载任何网页内容
- 📱 **双平台支持**: 同时支持Android和iOS
- 🤖 **自动化CI/CD**: GitHub Actions自动打包和发布
- 📦 **灵活构建**: 支持打包APK、AAB和IPA

## 🚀 快速开始

### 方式1：使用现有配置（最快）

```bash
# 1. 安装依赖
npm install

# 2. 查看当前配置
cat assets/build.app  # 默认是 app1
cat assets/app1/app.cfg

# 3. 应用配置
npm run build:config

# 4. 运行
npm run android  # 或 npm run ios
```

### 方式2：创建新应用

```bash
# 1. 创建应用目录
mkdir -p assets/my-app

# 2. 创建配置文件
cat > assets/my-app/app.cfg << 'EOF'
appName=我的应用
appDisplayName=MyApp
appId=com.mycompany.myapp
appVersion=1.0.0
buildNumber=1
buildAndroid=true
buildIOS=true
loadUrl=https://www.example.com
loadingDuration=1000
loadingBackgroundColor=#4A90E2
EOF

# 3. 添加资源文件（loading图片等）
cp your-image.png assets/my-app/loading.png

# 4. 指定要构建的应用
echo "my-app" > assets/build.app

# 5. 应用配置并运行
npm run build:config
npm run android
```

### 环境要求

- Node.js >= 20
- npm 或 yarn
- Java JDK 17（Android开发）
- Xcode（iOS开发，仅Mac）
- CocoaPods（iOS开发）

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

## 📁 项目结构

```
MyWebViewApp/
├── assets/                      # 🔥 应用配置和资源目录
│   ├── build.app               # 🔥 当前构建的应用名称
│   ├── app1/                   # 应用1配置
│   │   ├── app.cfg            # 🔥 应用1配置文件
│   │   ├── loading.png        # Loading图片
│   │   ├── icon.png           # 应用图标
│   │   └── README.md
│   ├── app2/                   # 应用2配置
│   │   ├── app.cfg
│   │   └── ...
│   └── ...                     # 更多应用配置
├── scripts/                     # 🔥 配置处理脚本
│   ├── read-config.js          # 读取配置
│   └── apply-config.js         # 应用配置到项目
├── src/
│   ├── config/                 # 🔥 运行时配置
│   │   └── runtime.config.ts  # 自动生成的配置
│   ├── screens/
│   │   ├── LoadingScreen.tsx  # Loading页面
│   │   └── HomeScreen.tsx     # WebView主页
│   └── navigation/
│       ├── AppNavigator.tsx   # 导航配置
│       └── types.ts           # 类型定义
├── android/                    # Android原生代码
├── ios/                       # iOS原生代码
├── .github/workflows/
│   └── build-release.yml      # CI/CD配置
├── 配置文件说明.md             # 🔥 配置详细说明
├── 多应用配置使用指南.md       # 🔥 使用指南
└── package.json
```

**注**: 🔥 标记的是配置系统的核心文件

## ⚙️ 配置系统

### 修改应用配置

**推荐方式**（无需修改代码）：

编辑 `assets/app1/app.cfg`：

```properties
# 修改URL
loadUrl=https://www.your-website.com

# 修改应用名称
appName=新应用名称

# 修改loading时长
loadingDuration=2000

# 修改主题色
loadingBackgroundColor=#FF6B6B
```

然后应用配置：

```bash
npm run build:config
npm run android
```

### 切换不同应用

```bash
# 切换到app2
echo "app2" > assets/build.app
npm run build:config
npm run android

# 切换回app1
echo "app1" > assets/build.app
npm run build:config
npm run android
```

### 查看当前配置

```bash
# 查看要构建的应用
cat assets/build.app

# 查看详细配置
npm run config:check
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

## 🎯 配置文件说明

### 核心配置项

| 配置项 | 说明 | 示例 |
|-------|------|------|
| `appName` | 应用中文名称 | `我的WebView` |
| `appDisplayName` | 应用英文名称 | `MyWebView` |
| `appId` | 应用包名/Bundle ID | `com.mycompany.app` |
| `appVersion` | 版本号 | `1.0.0` |
| `loadUrl` | 加载的URL | `https://www.baidu.com` |
| `loadingDuration` | Loading停留时长(ms) | `1000` |
| `loadingBackgroundColor` | Loading背景色 | `#4A90E2` |

完整配置项说明请查看：[配置文件说明.md](./配置文件说明.md)

### 实用脚本

```bash
# 查看当前配置
npm run config:check

# 应用配置到项目
npm run build:config

# 运行前自动应用配置
npm run android  # 已集成 build:config
npm run ios      # 已集成 build:config
```

## 📚 完整文档

- **[配置文件说明.md](./配置文件说明.md)** - 所有配置项的详细说明
- **[多应用配置使用指南.md](./多应用配置使用指南.md)** - 实用教程和最佳实践
- **[快速开始.md](./快速开始.md)** - 5分钟快速入门
- **[android打包说明.md](./android打包说明.md)** - Android打包详细教程
- **[ios打包说明.md](./ios打包说明.md)** - iOS打包详细教程

## 🎨 使用场景

### 场景1：为不同客户定制应用

```bash
# 客户A
assets/client-a/app.cfg  # loadUrl=https://client-a.com

# 客户B  
assets/client-b/app.cfg  # loadUrl=https://client-b.com

# 快速切换
echo "client-a" > assets/build.app && npm run android
echo "client-b" > assets/build.app && npm run android
```

### 场景2：测试/生产环境

```bash
# 开发环境
assets/app-dev/app.cfg   # loadUrl=https://dev.myapp.com

# 生产环境
assets/app-prod/app.cfg  # loadUrl=https://www.myapp.com
```

### 场景3：不同品牌的应用

```bash
# 品牌A（红色主题）
assets/brand-a/app.cfg   # loadingBackgroundColor=#FF0000

# 品牌B（蓝色主题）
assets/brand-b/app.cfg   # loadingBackgroundColor=#0000FF
```

## 技术栈

- **React Native**: 0.82.1
- **React**: 19.1.1
- **React Navigation**: 用于页面导航
- **React Native WebView**: 用于显示网页内容
- **TypeScript**: 类型安全
- **配置系统**: 基于Node.js的配置管理

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 支持

如有问题，请查看：
- [React Native官方文档](https://reactnative.dev/)
- [Android打包说明](./android打包说明.md)
- [iOS打包说明](./ios打包说明.md)
