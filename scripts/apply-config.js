/**
 * 应用配置到原生Android和iOS项目
 * Apply configuration to native Android and iOS projects
 */

const fs = require('fs');
const path = require('path');
const { getCurrentConfig, getConfigValue } = require('./read-config');

/**
 * 生成Android配置文件
 */
function generateAndroidConfig(config) {
  const androidConfigPath = path.join(__dirname, '../android/app/src/main/java/com/webviewapp/AppConfig.kt');
  
  const content = `package com.webviewapp

// 此文件由 scripts/apply-config.js 自动生成，请勿手动修改！
object AppConfig {
    var appName: String = "${config.appName || 'WebView App'}"
    var loadUrl: String = "${config.loadUrl || 'https://www.baidu.com'}"
    var loadingDuration: Long = ${getConfigValue(config, 'loadingDuration', 1000)}
    var loadingBackgroundColor: String = "${config.loadingBackgroundColor || '#4A90E2'}"
    var enableJavaScript: Boolean = ${getConfigValue(config, 'enableJavaScript', true)}
    var enableDOMStorage: Boolean = ${getConfigValue(config, 'enableDOMStorage', true)}
    var enableCache: Boolean = ${getConfigValue(config, 'enableCache', true)}
    
    fun parseColor(colorString: String): Int {
        return try {
            android.graphics.Color.parseColor(colorString)
        } catch (e: Exception) {
            android.graphics.Color.parseColor("#4A90E2")
        }
    }
}
`;
  
  fs.writeFileSync(androidConfigPath, content, 'utf-8');
  console.log('✅ 生成Android配置文件');
}

/**
 * 生成iOS配置文件
 */
function generateIOSConfig(config) {
  const iosConfigPath = path.join(__dirname, '../ios/WebViewApp/AppConfig.swift');
  
  const loadingDurationSeconds = (getConfigValue(config, 'loadingDuration', 1000) / 1000).toFixed(1);
  
  const content = `import Foundation
import UIKit

// 此文件由 scripts/apply-config.js 自动生成，请勿手动修改！
class AppConfig {
    static var appName: String = "${config.appName || 'WebView App'}"
    static var loadUrl: String = "${config.loadUrl || 'https://www.baidu.com'}"
    static var loadingDuration: TimeInterval = ${loadingDurationSeconds}
    static var loadingBackgroundColor: String = "${config.loadingBackgroundColor || '#4A90E2'}"
    static var enableJavaScript: Bool = ${getConfigValue(config, 'enableJavaScript', true) ? 'true' : 'false'}
    static var enableCache: Bool = ${getConfigValue(config, 'enableCache', true) ? 'true' : 'false'}
    
    static func parseColor(_ hexString: String) -> UIColor {
        var hex = hexString.trimmingCharacters(in: .whitespacesAndNewlines)
        hex = hex.replacingOccurrences(of: "#", with: "")
        
        var rgb: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&rgb)
        
        let red = CGFloat((rgb & 0xFF0000) >> 16) / 255.0
        let green = CGFloat((rgb & 0x00FF00) >> 8) / 255.0
        let blue = CGFloat(rgb & 0x0000FF) / 255.0
        
        return UIColor(red: red, green: green, blue: blue, alpha: 1.0)
    }
}
`;
  
  fs.writeFileSync(iosConfigPath, content, 'utf-8');
  console.log('✅ 生成iOS配置文件');
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
  const appName = config.appDisplayName || config.appName || 'WebView App';
  const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${appName}</string>
    <string name="loading">Loading...</string>
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
  const infoPlistPath = path.join(__dirname, '../ios/WebViewApp/Info.plist');
  
  if (!fs.existsSync(infoPlistPath)) {
    console.log('⚠️  未找到 Info.plist');
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
  
  // 更新 CFBundleVersion
  if (config.buildNumber) {
    infoPlist = infoPlist.replace(
      /<key>CFBundleVersion<\/key>\s*<string>[^<]*<\/string>/,
      `<key>CFBundleVersion</key>\n\t<string>${config.buildNumber}</string>`
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
  
  // 复制 loading 图片到 Android
  const loadingImageSrc = path.join(sourceDir, config.loadingImage || 'loading.png');
  const androidLoadingDest = path.join(__dirname, '../android/app/src/main/res/drawable/loading.png');
  
  if (fs.existsSync(loadingImageSrc)) {
    fs.copyFileSync(loadingImageSrc, androidLoadingDest);
    console.log('✅ 复制 loading 图片到 Android');
  }
  
  // 复制 loading 图片到 iOS (需要添加到Assets.xcassets)
  // 这里简化处理，实际应该创建imageset
  const iosAssetsDest = path.join(__dirname, '../ios/WebViewApp/Assets.xcassets/loading.imageset');
  if (!fs.existsSync(iosAssetsDest)) {
    fs.mkdirSync(iosAssetsDest, { recursive: true });
  }
  
  if (fs.existsSync(loadingImageSrc)) {
    fs.copyFileSync(loadingImageSrc, path.join(iosAssetsDest, 'loading.png'));
    
    // 创建Contents.json
    const contentsJson = {
      "images": [
        {
          "filename": "loading.png",
          "idiom": "universal",
          "scale": "1x"
        }
      ],
      "info": {
        "author": "xcode",
        "version": 1
      }
    };
    fs.writeFileSync(
      path.join(iosAssetsDest, 'Contents.json'),
      JSON.stringify(contentsJson, null, 2)
    );
    console.log('✅ 复制 loading 图片到 iOS');
  }
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
    
    // 生成原生配置文件
    generateAndroidConfig(config);
    generateIOSConfig(config);
    
    // 更新项目配置
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
  generateAndroidConfig,
  generateIOSConfig,
  updateAndroidConfig,
  updateIOSConfig,
  copyAssets,
};
