import '@/global.css';
import { Link } from "expo-router";
import { styled } from 'nativewind';
import React from 'react';
import { Text, } from "react-native";
import { SafeAreaView as RnSafeAreaView, } from 'react-native-safe-area-context';
const SafeAreaView = styled(RnSafeAreaView);
  
export default function App() {
  return (
    <SafeAreaView className="flex-1  bg-background p-5">
<<<<<<< HEAD
      <Text className="text-5xl font-sans-extrabold">Home</Text>
      <Link href="/Onboarding" className="mt-4 font-sans-bold rounded bg-primary text-white p-4">Go To Onboarding</Link>
      <Link href="/(auth)/sign-in" className="mt-4 font-sans-bold rounded bg-primary text-white p-4">Go To Sign In</Link>
      <Link href="/(auth)/sign-up" className="mt-4 font-sans-bold rounded bg-primary text-white p-4">Go To Sign Up</Link>
      
=======
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/Onboarding" className="mt-4 rounded bg-primary text-white p-4">Go To Onboarding</Link>
      <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary text-white p-4">Go To Sign In</Link>
      <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary text-white p-4">Go To Sign Up</Link>
      <Link href="/subscription/spotify" className="mt-4 rounded bg-primary text-white p-4">Spotify Subscription</Link>
      <Link
           href={{
                  pathname :"/subscriptons/[id]",
                  params : {id :'cloude'}
           }}
           >
            Cloude Max Subscription
           </Link>
>>>>>>> db99e123c48048b9379c00e1309246b8a05888fb
    </SafeAreaView>
  );
}