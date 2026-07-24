import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { AccountCreatedScreen } from "../screens/auth/AccountCreatedScreen";
import { ForgotPasswordOTPScreen } from "../screens/auth/ForgotPasswordOTPScreen";
import { ForgotPasswordScreen } from "../screens/auth/ForgotPasswordScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { ResetPasswordScreen } from "../screens/auth/ResetPasswordScreen";
import {
  LicenseBackCaptureScreen,
  LicenseFrontCaptureScreen,
} from "../screens/auth/LicenseCaptureScreens";
import { LicenseIntroScreen } from "../screens/auth/LicenseIntroScreen";
import { LicenseVerifyingScreen } from "../screens/auth/LicenseVerifyingScreen";
import { OTPVerificationScreen } from "../screens/auth/OTPVerificationScreen";
import { SignUpScreen } from "../screens/auth/SignUpScreen";
import { SSNScreen } from "../screens/auth/SSNScreen";
import { VerificationMethodScreen } from "../screens/auth/VerificationMethodScreen";
import { OnboardingScreen } from "../screens/onboarding/OnboardingScreen";
import { AuthStackParamList } from "./types";

import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerTintColor: colors.textMuted,
    }}
  >
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true, title: "" }} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: true, title: "" }} />
    <Stack.Screen name="ForgotPasswordOTP" component={ForgotPasswordOTPScreen} options={{ headerShown: true, title: "" }} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: true, title: "" }} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: true, title: "" }} />
    <Stack.Screen
      name="VerificationMethod"
      component={VerificationMethodScreen}
      options={{ headerShown: true, title: "" }}
    />
    <Stack.Screen
      name="OTPVerification"
      component={OTPVerificationScreen}
      options={{ headerShown: true, title: "" }}
    />
    <Stack.Screen name="LicenseIntro" component={LicenseIntroScreen} options={{ headerShown: true, title: "" }} />
    <Stack.Screen name="LicenseFrontCapture" component={LicenseFrontCaptureScreen} />
    <Stack.Screen name="LicenseBackCapture" component={LicenseBackCaptureScreen} />
    <Stack.Screen name="LicenseVerifying" component={LicenseVerifyingScreen} />
    <Stack.Screen name="SSN" component={SSNScreen} options={{ headerShown: true, title: "" }} />
    <Stack.Screen
      name="AccountCreated"
      component={AccountCreatedScreen}
      options={{ gestureEnabled: false }}
    />
  </Stack.Navigator>
);
