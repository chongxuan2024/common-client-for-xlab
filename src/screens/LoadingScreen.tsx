import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import AppConfig from '../config/runtime.config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Loading'>;

const { width, height } = Dimensions.get('window');

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // 根据配置设置跳转延迟
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, AppConfig.loadingDuration);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: AppConfig.loadingBackgroundColor }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={AppConfig.loadingBackgroundColor} 
      />
      <Image
        source={require('../../assets/loading.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.6,
    height: height * 0.3,
  },
});

export default LoadingScreen;
