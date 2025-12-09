#!/bin/bash

# 构建原生Android和iOS应用

echo "🚀 开始构建原生应用..."
echo ""

# 应用配置
echo "📋 应用配置..."
node scripts/apply-config.js
echo ""

# 构建Android
echo "🤖 构建Android..."
cd android
chmod +x gradlew
./gradlew assembleRelease
echo "✅ Android APK: android/app/build/outputs/apk/release/app-release.apk"
cd ..
echo ""

echo "🎉 构建完成！"
