# ⚡ 快速入门指南

本项目是一个**通用WebView框架**，可以通过配置文件快速创建不同的应用。

## 🚀 30秒快速开始

```bash
# 1. 安装依赖
npm install

# 2. 应用配置
npm run build:config

# 3. 运行
npm run android  # 或 npm run ios
```

就这么简单！🎉

## 📱 切换不同应用

```bash
# 查看当前应用
cat assets/build.app  # 输出: app1

# 切换到app2
echo "app2" > assets/build.app
npm run android

# 切换回app1
echo "app1" > assets/build.app
npm run android
```

## 🎨 创建新应用

### 方法1：复制现有配置（推荐）

```bash
# 复制app1配置
cp -r assets/app1 assets/my-app

# 修改配置
vim assets/my-app/app.cfg

# 修改以下内容：
# - appName=我的新应用
# - loadUrl=https://www.your-site.com
# - loadingBackgroundColor=#FF6B6B

# 构建新应用
echo "my-app" > assets/build.app
npm run android
```

### 方法2：从头创建

```bash
# 1. 创建目录
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
enableJavaScript=true
enableDOMStorage=true
enableCache=true
EOF

# 3. 添加loading图片
cp your-image.png assets/my-app/loading.png

# 4. 构建
echo "my-app" > assets/build.app
npm run android
```

## ⚙️ 常用配置修改

### 修改网址

编辑 `assets/app1/app.cfg`：

```properties
loadUrl=https://www.your-website.com
```

### 修改应用名

```properties
appName=新名称
appDisplayName=NewName
```

### 修改Loading时长

```properties
loadingDuration=2000  # 2秒
```

### 修改主题色

```properties
loadingBackgroundColor=#FF6B6B  # 红色
# 或
loadingBackgroundColor=#00FF00  # 绿色
# 或
loadingBackgroundColor=#4A90E2  # 蓝色
```

修改后运行：

```bash
npm run build:config
npm run android
```

## 📋 可用命令

```bash
# 查看当前配置
npm run config:check

# 应用配置到项目
npm run build:config

# 运行Android（自动应用配置）
npm run android

# 运行iOS（自动应用配置）
npm run ios

# 代码检查
npm run lint

# 运行测试
npm test
```

## 📁 项目结构

```
/workspace/
├── assets/
│   ├── build.app           # 🔥 当前构建的应用
│   ├── app1/              # 应用1配置
│   │   ├── app.cfg       # 🔥 配置文件
│   │   └── loading.png
│   └── app2/              # 应用2配置
│       ├── app.cfg
│       └── loading.png
├── scripts/
│   ├── read-config.js     # 读取配置
│   └── apply-config.js    # 应用配置
└── src/
    ├── config/
    │   └── runtime.config.ts  # 自动生成
    ├── screens/
    │   ├── LoadingScreen.tsx
    │   └── HomeScreen.tsx
    └── navigation/
```

## 🎯 核心概念

1. **build.app**: 指定要构建哪个应用
2. **app.cfg**: 应用的所有配置
3. **runtime.config.ts**: 自动生成的运行时配置

## 📖 配置文件示例

### 最小配置

```properties
appName=我的应用
appDisplayName=MyApp
appId=com.company.app
appVersion=1.0.0
buildNumber=1
loadUrl=https://www.example.com
```

### 完整配置

```properties
# 应用信息
appName=我的应用
appDisplayName=MyApp
appId=com.company.app
appVersion=1.0.0
buildNumber=1

# 构建选项
buildAndroid=true
buildIOS=true
isDebug=false

# WebView
loadUrl=https://www.example.com
enableJavaScript=true
enableDOMStorage=true
enableCache=true

# Loading
loadingDuration=1000
loadingBackgroundColor=#4A90E2

# Android
androidMinSdkVersion=21
androidTargetSdkVersion=34

# iOS
iosDeploymentTarget=13.0
```

## 🔧 故障排除

### 配置未生效？

```bash
# 1. 重新应用配置
npm run build:config

# 2. 清理缓存
npm start -- --reset-cache

# 3. 重新构建
cd android && ./gradlew clean && cd ..
npm run android
```

### 找不到配置文件？

```bash
# 检查build.app
cat assets/build.app

# 检查配置文件是否存在
ls -la assets/$(cat assets/build.app)/app.cfg
```

### Android构建失败？

```bash
# 清理Gradle缓存
cd android
./gradlew clean
cd ..

# 重新构建
npm run android
```

### iOS构建失败？

```bash
# 重新安装CocoaPods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# 重新构建
npm run ios
```

## 📱 实际应用场景

### 场景1：多客户项目

```
assets/
├── client-a/    → https://client-a.com
├── client-b/    → https://client-b.com
└── client-c/    → https://client-c.com

切换：echo "client-a" > assets/build.app && npm run android
```

### 场景2：测试/生产环境

```
assets/
├── app-dev/     → https://dev.app.com
├── app-staging/ → https://staging.app.com
└── app-prod/    → https://www.app.com

切换：echo "app-prod" > assets/build.app && npm run android
```

### 场景3：品牌系列

```
assets/
├── brand-red/   → 红色主题
├── brand-blue/  → 蓝色主题
└── brand-green/ → 绿色主题

切换：echo "brand-red" > assets/build.app && npm run android
```

## 📚 详细文档

需要更多信息？查看：

- **[配置文件说明.md](./配置文件说明.md)** - 所有配置项详细说明
- **[多应用配置使用指南.md](./多应用配置使用指南.md)** - 完整教程和最佳实践
- **[README.md](./README.md)** - 完整项目文档
- **[android打包说明.md](./android打包说明.md)** - Android打包
- **[ios打包说明.md](./ios打包说明.md)** - iOS打包

## 💡 小技巧

### 快速查看配置

```bash
# 查看当前应用
cat assets/build.app

# 查看配置内容
cat assets/$(cat assets/build.app)/app.cfg

# 查看生成的配置
cat src/config/runtime.config.ts

# 使用脚本
npm run config:check
```

### 对比不同配置

```bash
diff assets/app1/app.cfg assets/app2/app.cfg
```

### 批量构建（创建脚本）

```bash
#!/bin/bash
for app in app1 app2
do
  echo "$app" > assets/build.app
  npm run build:config
  cd android && ./gradlew assembleRelease && cd ..
  mv android/app/build/outputs/apk/release/app-release.apk "releases/$app.apk"
done
```

## 🎉 开始使用

现在您已经了解了基础知识，开始创建您的第一个应用吧！

```bash
# 1. 创建新应用配置
cp -r assets/app1 assets/my-first-app

# 2. 修改配置
vim assets/my-first-app/app.cfg

# 3. 构建运行
echo "my-first-app" > assets/build.app
npm run android
```

祝您使用愉快！🚀

---

有问题？查看完整文档或创建Issue。
