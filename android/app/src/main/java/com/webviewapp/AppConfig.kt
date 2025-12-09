package com.webviewapp

// 此文件由 scripts/apply-config.js 自动生成，请勿手动修改！
object AppConfig {
    var appName: String = "我的WebView"
    var loadUrl: String = "https://www.baidu.com"
    var loadingDuration: Long = 1000
    var loadingBackgroundColor: String = "#4A90E2"
    var enableJavaScript: Boolean = true
    var enableDOMStorage: Boolean = true
    var enableCache: Boolean = true
    
    fun parseColor(colorString: String): Int {
        return try {
            android.graphics.Color.parseColor(colorString)
        } catch (e: Exception) {
            android.graphics.Color.parseColor("#4A90E2")
        }
    }
}
