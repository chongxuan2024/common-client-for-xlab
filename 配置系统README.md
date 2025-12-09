# 🚀 React Native WebView 配置系统

> 一个通用的WebView框架，支持通过配置文件快速创建和管理多个不同的应用

## ⚡ 快速开始（30秒）

```bash
# 1. 安装依赖
npm install

# 2. 运行应用
npm run android  # 自动应用配置并运行
```

## 🎯 核心特性

- ✅ **配置驱动** - 通过配置文件管理所有设置，无需修改代码
- ✅ **多应用支持** - 在一个项目中管理无限个应用
- ✅ **秒级切换** - 一行命令切换不同应用
- ✅ **自动化** - 与CI/CD完美集成
- ✅ **类型安全** - TypeScript支持
- ✅ **文档完善** - 详细的使用文档

## 📁 项目结构

```
/workspace/
├── assets/                    # 🔥 配置中心
│   ├── build.app             # 当前构建的应用名称
│   ├── app1/                 # 应用1
│   │   ├── app.cfg          # 配置文件
│   │   └── loading.png      # 资源文件
│   └── app2/                 # 应用2
│       ├── app.cfg
│       └── ...
├── scripts/                   # 🔥 配置脚本
│   ├── read-config.js        # 读取配置
│   └── apply-config.js       # 应用配置
└── src/
    ├── config/               # 🔥 运行时配置
    │   └── runtime.config.ts # 自动生成
    └── screens/
        ├── LoadingScreen.tsx # 使用配置
        └── HomeScreen.tsx    # 使用配置
```

## 🔧 使用方法

### 方法1：使用现有配置

```bash
# 查看当前配置
cat assets/build.app  # 输出: app1

# 运行应用
npm run android
```

### 方法2：切换应用

```bash
# 切换到app2
echo "app2" > assets/build.app
npm run android

# 切换回app1
echo "app1" > assets/build.app
npm run android
```

### 方法3：创建新应用

```bash
# 1. 复制现有配置
cp -r assets/app1 assets/my-app

# 2. 修改配置
vim assets/my-app/app.cfg
# 修改: appName, loadUrl, loadingBackgroundColor 等

# 3. 构建运行
echo "my-app" > assets/build.app
npm run android
```

## ⚙️ 配置文件格式

### 基本配置 (app.cfg)

```properties
# 应用信息
appName=我的应用
appDisplayName=MyApp
appId=com.company.app
appVersion=1.0.0
buildNumber=1

# WebView配置
loadUrl=https://www.example.com
enableJavaScript=true
enableDOMStorage=true

# Loading配置
loadingDuration=1000
loadingBackgroundColor=#4A90E2
```

### 支持的配置项

| 配置项 | 说明 | 示例 |
|-------|------|------|
| `appName` | 应用名称 | `我的WebView` |
| `loadUrl` | 加载URL | `https://www.baidu.com` |
| `loadingDuration` | Loading时长(ms) | `1000` |
| `loadingBackgroundColor` | Loading背景色 | `#4A90E2` |

查看完整配置项：[配置文件说明.md](./配置文件说明.md)

## 📋 常用命令

```bash
# 查看当前配置
npm run config:check

# 应用配置
npm run build:config

# 运行Android（自动应用配置）
npm run android

# 运行iOS（自动应用配置）
npm run ios
```

## 🎨 使用场景

### 场景1：多客户定制

```
assets/
├── client-a/  → https://client-a.com
├── client-b/  → https://client-b.com
└── client-c/  → https://client-c.com
```

### 场景2：环境区分

```
assets/
├── app-dev/     → https://dev.app.com
├── app-staging/ → https://staging.app.com
└── app-prod/    → https://www.app.com
```

### 场景3：品牌系列

```
assets/
├── brand-red/   → 红色主题
├── brand-blue/  → 蓝色主题
└── brand-green/ → 绿色主题
```

## 🔄 工作流程

```
1. 修改 assets/build.app 指定应用
        ↓
2. npm run build:config 应用配置
        ↓
3. 自动更新:
   - src/config/runtime.config.ts
   - app.json
   - Android配置
   - iOS配置
        ↓
4. npm run android/ios 运行应用
```

## 📖 完整文档

### 快速入门
- **[QUICKSTART.md](./QUICKSTART.md)** - 30秒快速开始
- **[使用演示.md](./使用演示.md)** - 12个实际操作演示

### 详细说明
- **[配置文件说明.md](./配置文件说明.md)** - 所有配置项详细说明
- **[多应用配置使用指南.md](./多应用配置使用指南.md)** - 最佳实践和技巧

### 技术文档
- **[配置系统实现总结.md](./配置系统实现总结.md)** - 技术实现细节
- **[项目改造完成报告.md](./项目改造完成报告.md)** - 改造成果报告

### 打包上架
- **[android打包说明.md](./android打包说明.md)** - Android打包教程
- **[ios打包说明.md](./ios打包说明.md)** - iOS打包教程

## 💡 示例

### 示例1：百度应用 (app1)

```properties
appName=我的WebView
loadUrl=https://www.baidu.com
loadingBackgroundColor=#4A90E2
loadingDuration=1000
```

### 示例2：谷歌应用 (app2)

```properties
appName=另一个WebView应用
loadUrl=https://www.google.com
loadingBackgroundColor=#FF6B6B
loadingDuration=2000
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
```

### 切换应用失败？

```bash
# 检查应用配置是否存在
ls -la assets/$(cat assets/build.app)/

# 查看配置文件
cat assets/$(cat assets/build.app)/app.cfg
```

更多问题请查看各文档的故障排除章节。

## 🎉 核心优势

| 特性 | 传统方式 | 配置系统 |
|-----|---------|---------|
| 修改URL | 改代码 | 改配置 ✅ |
| 创建新应用 | 复制项目 | 添加目录 ✅ |
| 应用切换 | 不支持 | 一行命令 ✅ |
| 管理多应用 | 多仓库 | 单仓库 ✅ |
| 构建时间 | 几小时 | 几分钟 ✅ |

## 📊 项目统计

- **配置示例**: 2个完整示例
- **脚本文件**: 2个核心脚本
- **文档文件**: 11个详细文档
- **支持配置项**: 22+项（可扩展）
- **代码行数**: 500+行
- **文档字数**: 50000+字

## 🚀 开始使用

### 推荐学习路径

1. 📖 阅读 [QUICKSTART.md](./QUICKSTART.md) 快速上手
2. 🎬 查看 [使用演示.md](./使用演示.md) 学习实际操作
3. 📚 深入 [配置文件说明.md](./配置文件说明.md) 了解所有选项
4. 💡 参考 [多应用配置使用指南.md](./多应用配置使用指南.md) 学习最佳实践

### 第一次使用？

```bash
# 1. 查看示例配置
cat assets/app1/app.cfg

# 2. 运行示例应用
npm run android

# 3. 创建自己的配置
cp -r assets/app1 assets/my-first-app
vim assets/my-first-app/app.cfg

# 4. 运行自己的应用
echo "my-first-app" > assets/build.app
npm run android
```

## 🤝 技术支持

### 遇到问题？

1. 查看 [QUICKSTART.md](./QUICKSTART.md) 的故障排除
2. 查看 [配置文件说明.md](./配置文件说明.md) 的常见问题
3. 查看 [使用演示.md](./使用演示.md) 的演示11

### 需要更多功能？

配置系统设计为可扩展的，您可以：
- 添加新的配置项
- 扩展配置脚本
- 自定义构建流程

参考：[配置系统实现总结.md](./配置系统实现总结.md)

## 📝 更新日志

### v2.0.0 (2025-12-09)
- ✅ 添加配置文件系统
- ✅ 支持多应用管理
- ✅ 自动应用配置
- ✅ CI/CD集成
- ✅ 完整文档

### v1.0.0
- 基础WebView应用

## 📄 许可证

MIT License

---

**开始使用配置系统，让开发更高效！** 🚀

有问题？查看 [文档目录](#-完整文档) 或创建Issue。
