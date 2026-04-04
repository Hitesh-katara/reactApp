import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter, type Href } from 'expo-router';
import { useSignUp, useAuth } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { usePostHog } from 'posthog-react-native';

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUp() {
    const { signUp, isLoaded } = useSignUp();
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const posthog = usePostHog();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
    const passwordValid = password.length === 0 || password.length >= 8;
    const formValid = emailAddress.length > 0 && password.length >= 8 && emailValid;

    if (!isLoaded) return null;

    const handleSubmit = async () => {
        if (!formValid || !signUp) return;

        try {
            await signUp.create({
                emailAddress,
                password,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            });

        } catch (err: any) {
            const message = err?.errors?.[0]?.message || 'Signup failed';
            setError(message);

            posthog.capture('user_sign_up_failed', {
                error_message: message,
            });
        }
    };

    const handleVerify = async () => {
        if (!signUp) return;

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (result.status === 'complete') {
                posthog.identify(emailAddress);
                posthog.capture('user_signed_up');

                router.replace('/(tabs)' as Href);
            }

        } catch (err: any) {
            setError(err?.errors?.[0]?.message || 'Invalid code');
        }
    };

    if (isSignedIn) return null;

    // ✅ Verification screen
    if ((signUp?.status as string) === 'needs_verification') {
        return (
            <SafeAreaView className="auth-safe-area">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="auth-screen">
                    <ScrollView className="auth-scroll">
                        <View className="auth-content">

                            <Text className="auth-title">Verify your email</Text>

                            <TextInput
                                className="auth-input"
                                value={code}
                                placeholder="Enter 6-digit code"
                                onChangeText={setCode}
                                keyboardType="number-pad"
                            />

                            {error && <Text className="auth-error">{error}</Text>}

                            <Pressable className="auth-button" onPress={handleVerify}>
                                <Text className="auth-button-text">Verify Email</Text>
                            </Pressable>

                            <Pressable
                                className="auth-secondary-button"
                                onPress={() =>
                                    signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
                                }
                            >
                                <Text className="auth-secondary-button-text">Resend Code</Text>
                            </Pressable>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    // ✅ Main form
    return (
        <SafeAreaView className="auth-safe-area">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="auth-screen">
                <ScrollView className="auth-scroll">
                    <View className="auth-content">

                        <Text className="auth-title">Create your account</Text>

                        <TextInput
                            className={`auth-input ${emailTouched && !emailValid && 'auth-input-error'}`}
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
                            <Text className="auth-error">Min 8 characters</Text>
                        )}

                        {error && <Text className="auth-error">{error}</Text>}

                        <Pressable
                            className={`auth-button ${!formValid && 'auth-button-disabled'}`}
                            onPress={handleSubmit}
                            disabled={!formValid}
                        >
                            <Text className="auth-button-text">Create Account</Text>
                        </Pressable>

                        <View className="auth-link-row">
                            <Text>Already have an account?</Text>

                            <Link href="/(auth)/sign-in" asChild>
                                <Pressable>
                                    <Text className="auth-link">Sign In</Text>
                                </Pressable>
                            </Link>
                        </View>

                        <View nativeID="clerk-captcha" />

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}