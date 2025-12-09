import Foundation
import UIKit

// 此文件由 scripts/apply-config.js 自动生成，请勿手动修改！
class AppConfig {
    static var appName: String = "我的WebView"
    static var loadUrl: String = "https://www.baidu.com"
    static var loadingDuration: TimeInterval = 1.0
    static var loadingBackgroundColor: String = "#4A90E2"
    static var enableJavaScript: Bool = true
    static var enableCache: Bool = true
    
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
