/**
 * 应用配置到项目
 * Apply configuration to project
 */

const fs = require('fs');
const path = require('path');
const { getCurrentConfig, getConfigValue } = require('./read-config');

/**
 * 生成运行时配置文件
 */
function generateRuntimeConfig(config) {
  const runtimeConfigPath = path.join(__dirname, '../src/config/runtime.config.ts');
  
  // 确保目录存在
  const configDir = path.dirname(runtimeConfigPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  const content = `/**
 * 运行时配置文件
 * 此文件由 scripts/apply-config.js 自动生成
 * 请勿手动修改！
 */

export const AppConfig = {
  // 应用基本信息
  appName: '${config.appName || 'MyWebView'}',
  appDisplayName: '${config.appDisplayName || config.appName || 'MyWebView'}',
  appVersion: '${config.appVersion || '1.0.0'}',
  buildNumber: ${getConfigValue(config, 'buildNumber', 1)},
  
  // WebView配置
  loadUrl: '${config.loadUrl || 'https://www.baidu.com'}',
  enableJavaScript: ${getConfigValue(config, 'enableJavaScript', true)},
  enableDOMStorage: ${getConfigValue(config, 'enableDOMStorage', true)},
  enableCache: ${getConfigValue(config, 'enableCache', true)},
  
  // Loading页面配置
  loadingDuration: ${getConfigValue(config, 'loadingDuration', 1000)},
  loadingBackgroundColor: '${config.loadingBackgroundColor || '#4A90E2'}',
  
  // 调试模式
  isDebug: ${getConfigValue(config, 'isDebug', false)},
};

export default AppConfig;
`;
  
  fs.writeFileSync(runtimeConfigPath, content, 'utf-8');
  console.log('✅ 生成运行时配置文件: src/config/runtime.config.ts');
}

/**
 * 更新 app.json
 */
function updateAppJson(config) {
  const appJsonPath = path.join(__dirname, '../app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
  
  appJson.name = config.appDisplayName || config.appName || appJson.name;
  appJson.displayName = config.appDisplayName || config.appName || appJson.displayName;
  
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2), 'utf-8');
  console.log('✅ 更新 app.json');
}

/**
 * 更新 Android 配置
 */
function updateAndroidConfig(config) {
  const buildAndroid = getConfigValue(config, 'buildAndroid', true);
  
  if (!buildAndroid) {
    console.log('⏭️  跳过 Android 配置 (buildAndroid=false)');
    return;
  }
  
  // 更新 build.gradle
  const buildGradlePath = path.join(__dirname, '../android/app/build.gradle');
  let buildGradle = fs.readFileSync(buildGradlePath, 'utf-8');
  
  // 更新 applicationId
  if (config.appId) {
    buildGradle = buildGradle.replace(
      /applicationId\s+"[^"]+"/,
      `applicationId "${config.appId}"`
    );
  }
  
  // 更新 versionCode
  if (config.buildNumber) {
    buildGradle = buildGradle.replace(
      /versionCode\s+\d+/,
      `versionCode ${config.buildNumber}`
    );
  }
  
  // 更新 versionName
  if (config.appVersion) {
    buildGradle = buildGradle.replace(
      /versionName\s+"[^"]+"/,
      `versionName "${config.appVersion}"`
    );
  }
  
  fs.writeFileSync(buildGradlePath, buildGradle, 'utf-8');
  console.log('✅ 更新 Android build.gradle');
  
  // 更新 strings.xml
  const stringsXmlPath = path.join(__dirname, '../android/app/src/main/res/values/strings.xml');
  const appName = config.appDisplayName || config.appName || 'MyWebView';
  const stringsXml = `<resources>
    <string name="app_name">${appName}</string>
</resources>
`;
  
  fs.writeFileSync(stringsXmlPath, stringsXml, 'utf-8');
  console.log('✅ 更新 Android strings.xml');
}

/**
 * 更新 iOS 配置
 */
function updateIOSConfig(config) {
  const buildIOS = getConfigValue(config, 'buildIOS', true);
  
  if (!buildIOS) {
    console.log('⏭️  跳过 iOS 配置 (buildIOS=false)');
    return;
  }
  
  // 更新 Info.plist
  const infoPlistPath = path.join(__dirname, '../ios/MyWebViewApp/Info.plist');
  
  if (!fs.existsSync(infoPlistPath)) {
    console.log('⚠️  未找到 Info.plist，跳过 iOS 配置');
    return;
  }
  
  let infoPlist = fs.readFileSync(infoPlistPath, 'utf-8');
  
  // 更新 CFBundleDisplayName
  if (config.appDisplayName || config.appName) {
    const displayName = config.appDisplayName || config.appName;
    infoPlist = infoPlist.replace(
      /<key>CFBundleDisplayName<\/key>\s*<string>[^<]*<\/string>/,
      `<key>CFBundleDisplayName</key>\n\t<string>${displayName}</string>`
    );
  }
  
  // 更新 CFBundleShortVersionString
  if (config.appVersion) {
    infoPlist = infoPlist.replace(
      /<key>CFBundleShortVersionString<\/key>\s*<string>[^<]*<\/string>/,
      `<key>CFBundleShortVersionString</key>\n\t<string>${config.appVersion}</string>`
    );
  }
  
  fs.writeFileSync(infoPlistPath, infoPlist, 'utf-8');
  console.log('✅ 更新 iOS Info.plist');
}

/**
 * 复制资源文件
 */
function copyAssets(config) {
  const sourceDir = path.join(__dirname, `../assets/${config.appFolderName}`);
  
  // 复制 loading 图片
  const loadingImageSrc = path.join(sourceDir, config.loadingImage || 'loading.png');
  const loadingImageDest = path.join(__dirname, '../assets/loading.png');
  
  if (fs.existsSync(loadingImageSrc)) {
    fs.copyFileSync(loadingImageSrc, loadingImageDest);
    console.log('✅ 复制 loading 图片');
  }
  
  // TODO: 复制应用图标到 Android 和 iOS 对应目录
  // 这部分可以根据需要扩展，处理不同尺寸的图标
}

/**
 * 主函数
 */
function main() {
  try {
    console.log('🚀 开始应用配置...\n');
    
    // 读取配置
    const config = getCurrentConfig();
    console.log('');
    
    // 生成运行时配置
    generateRuntimeConfig(config);
    
    // 更新项目配置
    updateAppJson(config);
    updateAndroidConfig(config);
    updateIOSConfig(config);
    
    // 复制资源
    copyAssets(config);
    
    console.log('\n✅ 配置应用完成！');
    console.log(`📱 应用名称: ${config.appName}`);
    console.log(`🌐 加载URL: ${config.loadUrl}`);
    console.log(`📦 版本: ${config.appVersion} (${config.buildNumber})`);
    
  } catch (error) {
    console.error('\n❌ 应用配置失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  generateRuntimeConfig,
  updateAppJson,
  updateAndroidConfig,
  updateIOSConfig,
  copyAssets,
};
