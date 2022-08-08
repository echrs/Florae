import { FontAwesome } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { Image } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  const cacheImages = (images: any) => {
    return images.map((image: any) => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  };

  const cacheFonts = (fonts: any) => {
    return fonts.map((font: any) => Font.loadAsync(font));
  };

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        const imageAssets = cacheImages([require('../assets/images/1-op.jpg')]);
        const fontAssets = cacheFonts([
          FontAwesome.font,
          { 'inter-bold': require('../assets/fonts/Inter-Bold.ttf') },
          { 'inter-light': require('../assets/fonts/Inter-Light.ttf') },
          { 'inter-regular': require('../assets/fonts/Inter-Regular.ttf') },
          { 'inter-semibold': require('../assets/fonts/Inter-SemiBold.ttf') },
        ]);
        await Promise.all([...imageAssets, ...fontAssets]);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
