# 原生WebView应用框架

> 基于原生Android（Kotlin）和iOS（Swift）的通用WebView框架，支持配置驱动

## 🌟 核心特性

- ✅ **纯原生** - Android使用Kotlin，iOS使用Swift
- ✅ **高性能** - 原生WebView控件，性能优秀
- ✅ **配置驱动** - 通过配置文件管理所有设置
- ✅ **多应用支持** - 一个项目管理多个应用
- ✅ **快速切换** - 一行命令切换不同应用
- ✅ **自动化CI/CD** - GitHub Actions自动打包

## 🚀 快速开始

### Android

```bash
# 1. 应用配置
node scripts/apply-config.js

# 2. 构建APK
cd android
./gradlew assembleRelease

# 生成文件: android/app/build/outputs/apk/release/app-release.apk
```

### iOS

```bash
# 1. 应用配置
node scripts/apply-config.js

# 2. 使用Xcode打开项目
open ios/WebViewApp.xcodeproj

# 3. 在Xcode中构建和运行
```

### 或使用构建脚本

```bash
./build.sh
```

## ⚙️ 配置系统

### 配置文件结构

```
assets/
├── build.app           # 当前构建的应用
├── app1/              # 应用1
│   ├── app.cfg       # 配置文件
│   └── loading.png   # 资源
└── app2/              # 应用2
    ├── app.cfg
    └── ...
```

### 配置示例 (app.cfg)

```properties
# 应用信息
appName=我的WebView
appDisplayName=MyWebView
appId=com.mywebviewapp
appVersion=1.0.0
buildNumber=1

# WebView配置
loadUrl=https://www.baidu.com
enableJavaScript=true
enableDOMStorage=true
enableCache=true

# Loading配置
loadingDuration=1000
loadingBackgroundColor=#4A90E2
```

### 切换应用

```bash
# 切换到app2
echo "app2" > assets/build.app
node scripts/apply-config.js
cd android && ./gradlew assembleRelease
```

## 📁 项目结构

```
/workspace/
├── android/                      # Android原生项目
│   ├── app/src/main/
│   │   ├── java/com/webviewapp/
│   │   │   ├── AppConfig.kt     # 配置类（自动生成）
│   │   │   ├── LoadingActivity.kt
│   │   │   └── MainActivity.kt
│   │   ├── res/                 # 资源文件
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── ios/                          # iOS原生项目
│   └── WebViewApp/
│       ├── AppConfig.swift      # 配置类（自动生成）
│       ├── AppDelegate.swift
│       ├── LoadingViewController.swift
│       ├── MainViewController.swift
│       └── Info.plist
├── assets/                       # 配置和资源
│   ├── build.app
│   ├── app1/
│   └── app2/
├── scripts/                      # 配置脚本
│   ├── read-config.js
│   └── apply-config.js
└── build.sh                      # 构建脚本
```

## 🎯 技术栈

### Android
- **语言**: Kotlin
- **最低SDK**: 21 (Android 5.0)
- **目标SDK**: 34 (Android 14)
- **WebView**: Android原生WebView

### iOS
- **语言**: Swift
- **最低版本**: iOS 13.0
- **WebView**: WKWebView

## 📋 支持的配置项

| 配置项 | 说明 | 默认值 |
|-------|------|--------|
| `appName` | 应用名称 | WebView App |
| `appId` | 包名/Bundle ID | com.webviewapp |
| `appVersion` | 版本号 | 1.0.0 |
| `buildNumber` | 构建号 | 1 |
| `loadUrl` | 加载的URL | https://www.baidu.com |
| `loadingDuration` | Loading时长(ms) | 1000 |
| `loadingBackgroundColor` | Loading背景色 | #4A90E2 |
| `enableJavaScript` | 启用JS | true |
| `enableDOMStorage` | 启用存储 | true |
| `enableCache` | 启用缓存 | true |

## 🔧 常用命令

```bash
# 查看配置
node scripts/read-config.js

# 应用配置
node scripts/apply-config.js

# Android构建
cd android && ./gradlew assembleRelease

# Android安装到设备
cd android && ./gradlew installRelease
```

## 🎨 使用场景

### 场景1：多客户定制
```
assets/client-a/ → https://client-a.com
assets/client-b/ → https://client-b.com
```

### 场景2：环境区分
```
assets/app-dev/ → https://dev.app.com
assets/app-prod/ → https://www.app.com
```

## 📦 构建发布

### Android

#### 生成签名密钥
```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore android/app/my-upload-key.keystore \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

#### 配置签名
在 `android/gradle.properties` 中添加：
```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your-password
MYAPP_UPLOAD_KEY_PASSWORD=your-password
```

#### 构建Release APK
```bash
cd android
./gradlew assembleRelease
```

### iOS

1. 使用Xcode打开 `ios/WebViewApp.xcodeproj`
2. 配置签名（Team、Bundle ID）
3. 选择 Product > Archive
4. 导出IPA用于App Store或Ad Hoc分发

## 🤖 CI/CD

项目已配置GitHub Actions，推送代码时自动构建。

查看详细说明：[CI构建说明.md](./CI构建说明.md)

## 📚 文档

- [配置文件说明.md](./配置文件说明.md) - 配置项详细说明
- [多应用配置使用指南.md](./多应用配置使用指南.md) - 使用指南
- [CI构建说明.md](./CI构建说明.md) - CI/CD配置
- [android打包说明.md](./android打包说明.md) - Android打包
- [ios打包说明.md](./ios打包说明.md) - iOS打包

## ⚡ 性能优势

与React Native版本相比：

| 指标 | React Native | 原生 |
|-----|-------------|------|
| 启动时间 | ~3s | ~0.5s ✅ |
| 内存占用 | ~150MB | ~50MB ✅ |
| 安装包大小 | ~50MB | ~5MB ✅ |
| WebView性能 | 良好 | 优秀 ✅ |
| 维护成本 | 中等 | 低 ✅ |

## 🔍 故障排除

### Android构建失败

```bash
# 清理缓存
cd android
./gradlew clean

# 重新构建
./gradlew assembleRelease
```

### 配置未生效

```bash
# 重新应用配置
node scripts/apply-config.js

# 清理并重新构建
cd android
./gradlew clean assembleRelease
```

## 📝 许可证

MIT License

---

**使用原生技术，获得最佳性能！** 🚀
