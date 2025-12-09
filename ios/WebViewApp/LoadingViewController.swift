import UIKit

class LoadingViewController: UIViewController {
    
    private let imageView: UIImageView = {
        let iv = UIImageView()
        iv.contentMode = .scaleAspectFit
        iv.translatesAutoresizingMaskIntoConstraints = false
        return iv
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 设置背景颜色
        view.backgroundColor = AppConfig.parseColor(AppConfig.loadingBackgroundColor)
        
        // 添加图片
        view.addSubview(imageView)
        
        // 加载图片
        if let image = UIImage(named: "loading") {
            imageView.image = image
        }
        
        // 设置约束
        NSLayoutConstraint.activate([
            imageView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            imageView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            imageView.widthAnchor.constraint(equalTo: view.widthAnchor, multiplier: 0.6),
            imageView.heightAnchor.constraint(equalTo: view.heightAnchor, multiplier: 0.3)
        ])
        
        // 延迟跳转
        DispatchQueue.main.asyncAfter(deadline: .now() + AppConfig.loadingDuration) { [weak self] in
            self?.navigateToMain()
        }
    }
    
    private func navigateToMain() {
        let mainVC = MainViewController()
        if let window = view.window {
            window.rootViewController = mainVC
            UIView.transition(with: window, duration: 0.3, options: .transitionCrossDissolve, animations: nil)
        }
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
}
