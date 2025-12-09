# App1 配置目录

这个目录包含 App1 的所有配置和资源文件。

## 文件说明

### app.cfg
应用配置文件，包含所有可配置的参数。

### 资源文件
- **icon.png**: 应用图标（建议1024x1024）
- **loading.png**: Loading页面显示的图片（建议800x600）
- **splash.png**: 启动屏幕图片（可选）

## 修改配置

1. 编辑 `app.cfg` 修改应用信息
2. 替换图片资源
3. 在根目录的 `assets/build.app` 中指定要构建的app名称
4. 运行 `npm run build:config` 应用配置
5. 运行 `npm run android` 或 `npm run ios` 测试

## 配置项说明

查看项目根目录的 `配置文件说明.md` 了解所有配置项的详细说明。
