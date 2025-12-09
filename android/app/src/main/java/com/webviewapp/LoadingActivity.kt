package com.webviewapp

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

class LoadingActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_loading)
        
        // 设置背景颜色
        window.decorView.setBackgroundColor(AppConfig.parseColor(AppConfig.loadingBackgroundColor))
        
        // 加载图片
        val imageView = findViewById<ImageView>(R.id.loading_image)
        val drawableId = resources.getIdentifier("loading", "drawable", packageName)
        if (drawableId != 0) {
            imageView.setImageDrawable(ContextCompat.getDrawable(this, drawableId))
        }
        
        // 延迟跳转到主页
        Handler(Looper.getMainLooper()).postDelayed({
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }, AppConfig.loadingDuration)
    }
}
