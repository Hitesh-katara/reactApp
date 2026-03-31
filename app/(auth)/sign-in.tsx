import {Link} from 'expo-router'
import React from 'react'
import { Text } from 'react-native'
import { styled } from 'nativewind'
import { SafeAreaView as RnSafeAreaView } from 'react-native-safe-area-context'

const SafeAreaView = styled(RnSafeAreaView)

const SignIn = () =>{
    return (
        <SafeAreaView className="mt-3 ml-3">
            <Text >SignIn</Text>
            <Link href="/(auth)/sign-up">Create Account</Link>
            <Link href="/(tabs)/settings" className="mt-4 rounded bg-primary text-white p-4">Settings</Link>
            
        </SafeAreaView>
    )
}
export default SignIn