import React from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <WebView
        source={{ uri: 'https://www.baidu.com' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
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
