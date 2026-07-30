import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity } from "react-native";
import { HeaderBackIconItem } from "../components/ProfileIcons";
import { AccountCreatedScreen } from "../screens/auth/AccountCreatedScreen";
import { ForgotPasswordOTPScreen } from "../screens/auth/ForgotPasswordOTPScreen";
import { ForgotPasswordScreen } from "../screens/auth/ForgotPasswordScreen";
import {
  LicenseBackCaptureScreen,
  LicenseFrontCaptureScreen,
} from "../screens/auth/LicenseCaptureScreens";
import { LicenseIntroScreen } from "../screens/auth/LicenseIntroScreen";
import { LicenseVerifyingScreen } from "../screens/auth/LicenseVerifyingScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { OTPVerificationScreen } from "../screens/auth/OTPVerificationScreen";
import { ResetPasswordScreen } from "../screens/auth/ResetPasswordScreen";
import { SignUpScreen } from "../screens/auth/SignUpScreen";
import { SSNScreen } from "../screens/auth/SSNScreen";
import { VerificationMethodScreen } from "../screens/auth/VerificationMethodScreen";
import { OnboardingScreen } from "../screens/onboarding/OnboardingScreen";
import { colors, spacing } from "../theme/colors";
import { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const CustomHeaderBackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      activeOpacity={0.7}
      style={{
        paddingLeft: spacing.sm,
        paddingRight: spacing.sm,
      }}
    >
      <HeaderBackIconItem size={20} color="#868C98" />
    </TouchableOpacity>
  );
};

export const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerTintColor: colors.textMuted,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerLeft: () => <CustomHeaderBackButton />,
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
