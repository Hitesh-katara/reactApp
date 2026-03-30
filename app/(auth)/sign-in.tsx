
import { Text, View } from 'react-native'
import {Link} from 'expo-router'
import React from 'react'


const SignIn = () =>{
    return (
        <View>
            <Text >SignIn</Text>
            <Link href="/(auth)/sign-up">Create Account</Link>
            <Link href="/(tabs)/settings">Settings</Link>
            
        </View>
    )
}
export default SignIn