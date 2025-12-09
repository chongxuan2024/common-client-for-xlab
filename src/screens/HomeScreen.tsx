import React from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import AppConfig from '../config/runtime.config';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <WebView
        source={{ uri: AppConfig.loadUrl }}
        style={styles.webview}
        javaScriptEnabled={AppConfig.enableJavaScript}
        domStorageEnabled={AppConfig.enableDOMStorage}
        startInLoadingState={true}
        scalesPageToFit={true}
        cacheEnabled={AppConfig.enableCache}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
});

export default HomeScreen;
