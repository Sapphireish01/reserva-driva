import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";
import { OnboardingScreen } from "../screens/onboarding/OnboardingScreen";
import { SignUpScreen } from "../screens/auth/SignUpScreen";
import { VerificationMethodScreen } from "../screens/auth/VerificationMethodScreen";
import { OTPVerificationScreen } from "../screens/auth/OTPVerificationScreen";
import { LicenseIntroScreen } from "../screens/auth/LicenseIntroScreen";
import {
  LicenseFrontCaptureScreen,
  LicenseBackCaptureScreen,
} from "../screens/auth/LicenseCaptureScreens";
import { LicenseVerifyingScreen } from "../screens/auth/LicenseVerifyingScreen";
import { SSNScreen } from "../screens/auth/SSNScreen";
import { AccountCreatedScreen } from "../screens/auth/AccountCreatedScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
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
