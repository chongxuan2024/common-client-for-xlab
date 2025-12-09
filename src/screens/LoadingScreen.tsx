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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Loading'>;

const { width, height } = Dimensions.get('window');

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // 1秒后跳转到主页
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
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
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.6,
    height: height * 0.3,
  },
});

export default LoadingScreen;
