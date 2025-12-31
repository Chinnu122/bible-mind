package com.biblemind.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Optimize WebView performance
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            WebSettings settings = webView.getSettings();
            
            // Enable hardware acceleration
            webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
            
            // Enable caching for faster loads
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            
            // Enable smooth scrolling
            webView.setScrollBarStyle(WebView.SCROLLBARS_INSIDE_OVERLAY);
            webView.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
            
            // Performance optimizations
            settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
            settings.setMediaPlaybackRequiresUserGesture(false);
        }
    }
}
