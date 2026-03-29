import '@/global.css';
import { Link } from "expo-router";
import React from 'react';
import { Text,} from "react-native";
import {styled} from 'nativewind';
import { SafeAreaView as RnSafeAreaView, } from 'react-native-safe-area-context';
const SafeAreaView = styled(RnSafeAreaView);
  
export default function App() {
  return (
    <SafeAreaView className="flex-1  bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/Onboarding" className="mt-4 rounded bg-primary text-white p-4">Go To Onboarding</Link>
      <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary text-white p-4">Go To Sign In</Link>
      <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary text-white p-4">Go To Sign Up</Link>
      <Link href="/sbscription/spotify" className="mt-4 rounded bg-primary text-white p-4">Spotify Sbscription</Link>
      <Link
           href={{
                  pathname :"/subscriptons/[id]",
                  params : {id :'cloude'}
           }}
           >
            Cloude Max Subscription
           </Link>
    </SafeAreaView>
  );
}