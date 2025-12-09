import UIKit
import WebKit

class MainViewController: UIViewController {
    
    private var webView: WKWebView!
    
    override func loadView() {
        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.preferences.javaScriptEnabled = AppConfig.enableJavaScript
        
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = self
        view = webView
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 加载URL
        if let url = URL(string: AppConfig.loadUrl) {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .default
    }
}

extension MainViewController: WKNavigationDelegate {
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        // 开始加载
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // 加载完成
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        // 加载失败
        print("WebView loading failed: \(error.localizedDescription)")
    }
}
