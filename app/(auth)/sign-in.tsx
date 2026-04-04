import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter, type Href } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { usePostHog } from 'posthog-react-native';


const SafeAreaView = styled(RNSafeAreaView);

export default function SignIn() {
    const { signIn, isLoaded } = useSignIn();
    const router = useRouter();
    const posthog = usePostHog();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
    const passwordValid = password.length > 0;
    const formValid = emailAddress.length > 0 && password.length > 0 && emailValid;

    if (!isLoaded) return null;

    const handleSubmit = async () => {
        if (!formValid || !signIn) return;

        try {
            const result = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (result.status === 'complete') {
                posthog.identify(emailAddress, {
                    $set: { email: emailAddress },
                    $set_once: { first_sign_in_date: new Date().toISOString() },
                });

                posthog.capture('user_signed_in', { email: emailAddress });

                router.replace('/(tabs)' as Href);
            }

        } catch (err: any) {
            console.log(err);
            const message = err?.errors?.[0]?.message || 'Sign-in failed';
            setError(message);

            posthog.capture('user_sign_in_failed', {
                error_message: message,
            });
        }
    };

    const handleVerify = async () => {
        if (!signIn) return;

        try {
            const result = await signIn.attemptSecondFactor({
                strategy: 'email_code',
                code,
            });

            if (result.status === 'complete') {
                posthog.identify(emailAddress, {
                    $set: { email: emailAddress },
                    $set_once: { first_sign_in_date: new Date().toISOString() },
                });

                posthog.capture('user_signed_in', { email: emailAddress });

                router.replace('/(tabs)' as Href);
            }

        } catch (err: any) {
            console.log(err);
            setError(err?.errors?.[0]?.message || 'Invalid code');
        }
    };

    // 🔐 MFA / verification screen
    if (signIn?.status === 'needs_second_factor') {
        return (
            <SafeAreaView className="auth-safe-area">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'android' ? 'padding' : 'height'}
                    className="auth-screen"
                >
                    <ScrollView className="auth-scroll">
                        <View className="auth-content">

                            <Text className="auth-title">Verify your identity</Text>

                            <TextInput
                                className="auth-input"
                                value={code}
                                placeholder="Enter code"
                                onChangeText={setCode}
                                keyboardType="number-pad"
                            />

                            {error && <Text className="auth-error">{error}</Text>}

                            <Pressable onPress={handleVerify} className="auth-button">
                                <Text className="auth-button-text">Verify</Text>
                            </Pressable>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

   
    return (
        <SafeAreaView className="auth-safe-area">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'android' ? 'padding' : 'height'}
                className="auth-screen"
            >
                <ScrollView className="auth-scroll">
                    <View className="auth-content">

                        <Text className="auth-title">Welcome back</Text>

                        <TextInput
                            className={`auth-input ${emailTouched && !emailValid && 'auth-input-error'}`}
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="name@example.com"
                            onChangeText={setEmailAddress}
                            onBlur={() => setEmailTouched(true)}
                        />

                        {emailTouched && !emailValid && (
                            <Text className="auth-error">Invalid email</Text>
                        )}

                        <TextInput
                            className={`auth-input ${passwordTouched && !passwordValid && 'auth-input-error'}`}
                            value={password}
                            placeholder="Password"
                            secureTextEntry
                            onChangeText={setPassword}
                            onBlur={() => setPasswordTouched(true)}
                        />

                        {passwordTouched && !passwordValid && (
                            <Text className="auth-error">Password required</Text>
                        )}

                        {error && <Text className="auth-error">{error}</Text>}

                        <Pressable
                            className={`auth-button ${!formValid && 'auth-button-disabled'}`}
                            onPress={handleSubmit}
                            disabled={!formValid}
                        >
                            <Text className="auth-button-text">Sign In</Text>
                        </Pressable>

                        <View className="auth-link-row">
                            <Text>Don&apos;t have an account?</Text>

                            <Link href="/(auth)/sign-up" asChild>
                                <Pressable>
                                    <Text className="auth-link">Create Account</Text>
                                </Pressable>
                            </Link>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}