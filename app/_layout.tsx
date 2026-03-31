import { SplashScreen, Stack } from "expo-router";
import '@/global.css';
import React, { useEffect } from 'react'
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsloades] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf')
  })

  useEffect(()=>{
    if (fontsloades){
      SplashScreen.hideAsync()
    }
  }, [fontsloades])

  if(!fontsloades) return null;

  return <Stack screenOptions={{headerShown:false}}/>;
}
