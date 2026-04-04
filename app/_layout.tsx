import { SplashScreen, Stack, usePathname, useGlobalSearchParams } from 'expo-router';
import '@/global.css';
import React, { useEffect, useRef } from 'react';
import { useFonts } from 'expo-font';
import { ClerkProvider } from '@clerk/clerk-expo';
import { PostHogProvider, PostHog, usePostHog } from 'posthog-react-native';
import Constants from 'expo-constants';

SplashScreen.preventAutoHideAsync();

// Safely read environment variables from expoConfig.extra
const publishableKey = Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY;
const posthogApiKey = Constants.expoConfig?.extra?.POSTHOG_API_KEY;
const posthogHost = Constants.expoConfig?.extra?.POSTHOG_HOST;

// Guard against missing Clerk key
if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to app.config.js/.env (CLERK_PUBLISHABLE_KEY)');
}

// Initialize PostHog only if keys exist
const posthogClient = posthogApiKey && posthogHost
  ? new PostHog(posthogApiKey, { host: posthogHost })
  : undefined;

function NavigationTracker() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog) return;

    if (previousPathname.current !== pathname) {
      const sanitizedParams = Object.keys(params).reduce((acc, key) => {
        if (['id', 'tab', 'view'].includes(key)) acc[key] = params[key];
        return acc;
      }, {} as Record<string, string | string[]>);

      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...sanitizedParams,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params, posthog]);

  return null;
}

function RootLayoutContent() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <NavigationTracker />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  // If PostHog client is missing, log warning but still render app without analytics
  if (!posthogClient) {
    console.warn('PostHog keys are missing; analytics will be disabled.');
  }

  return (
    <PostHogProvider
      client={posthogClient} // safe: can be undefined
      autocapture={{
        captureScreens: false,
        captureTouches: true,
        propsToCapture: ['testID'],
      }}
    >
      <ClerkProvider publishableKey={publishableKey}>
        <RootLayoutContent />
      </ClerkProvider>
    </PostHogProvider>
  );
}