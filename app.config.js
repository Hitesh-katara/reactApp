import 'dotenv/config';

export default {
  expo: {
    name: 'react_app',
    slug: 'react_app',
    version: '1.0.0',
    extra: {
      CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      POSTHOG_API_KEY: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
      POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
    },
    // Optional: specify platforms and sdkVersion if needed
    // sdkVersion: '54.0.0',
  },
};