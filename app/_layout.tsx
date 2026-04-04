import { SplashScreen, Stack, usePathname } from "expo-router";
import '@/global.css';
import React, { useEffect } from 'react';
import { useFonts } from "expo-font";
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { PostHogProvider, usePostHog } from 'posthog-react-native';
import Constants from 'expo-constants';

const publishableKey = Constants.manifest?.extra?.CLERK_PUBLISHABLE_KEY;

SplashScreen.preventAutoHideAsync();

// ✅ safer env handling (no crash at import time)
//const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function NavigationTracker() {
  const pathname = usePathname();
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog && pathname) {
      posthog.screen(pathname);
    }
  }, [pathname, posthog]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  console.log('fontsLoaded:', fontsLoaded);
console.log('publishableKey:', publishableKey);

  // ✅ prevent render before fonts + key ready
  if (!fontsLoaded || !publishableKey) return null;


  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY!}
      options={{ host: process.env.EXPO_PUBLIC_POSTHOG_HOST }}
    >
      <NavigationTracker />

      <ClerkProvider
        publishableKey={publishableKey}
        tokenCache={tokenCache}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </ClerkProvider>

    </PostHogProvider>
  );
}