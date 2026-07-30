import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppleIconItem,
  FingerprintIconItem,
  GoogleIconItem,
} from "../../components/ProfileIcons";
import { AppButton, AppTextInput } from "../../components/ui";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = email.trim().length > 0 && password.length >= 6;

  const handleBack = React.useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleLogin = React.useCallback(() => {
    if (!isFormValid) return;
    navigation.reset({
      index: 0,
      routes: [{ name: "AccountCreated" }],
    });
  }, [isFormValid, navigation]);

  const handleForgotPassword = React.useCallback(() => {
    navigation.navigate("ForgotPassword");
  }, [navigation]);

  const handleNavigateSignUp = React.useCallback(() => {
    navigation.navigate("SignUp");
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Title & Subtitle */}
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Ride Together. Save More</Text>

        {/* Email Field */}
        <AppTextInput
          label="Email Address"
          placeholder="e.g JDoe@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus={true}
          inputCardStyle={styles.inputCardOverride}
        />

        {/* Password Field */}
        <View style={styles.passwordRow}>
          <AppTextInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            isPassword
            containerStyle={{ flex: 1, marginBottom: 0 }}
            inputCardStyle={styles.inputCardOverride}
          />
          <TouchableOpacity style={styles.biometricBtn} activeOpacity={0.7}>
            <FingerprintIconItem size={24} />
          </TouchableOpacity>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={handleForgotPassword}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <AppButton
          title="Log in"
          onPress={handleLogin}
          disabled={!isFormValid}
          size="lg"
          style={styles.loginBtn}
          textStyle={styles.loginBtnText}
        />

        {/* Footer Link (Sign Up) */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don’t have an account? </Text>
          <TouchableOpacity onPress={handleNavigateSignUp} activeOpacity={0.7}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login Buttons (Stacked Vertically) */}
        <View style={styles.socialCol}>
          <AppButton
            title="Continue with google"
            onPress={() => { }}
            variant="outline"
            leftIcon={<GoogleIconItem />}
            style={styles.socialBtn}
            textStyle={styles.socialBtnText}
          />
          <AppButton
            title="Continue with apple"
            onPress={() => { }}
            variant="outline"
            leftIcon={<AppleIconItem />}
            style={styles.socialBtn}
            textStyle={styles.socialBtnText}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    paddingTop: 0,
  },
  title: {
    fontFamily: "DM Sans Bold",
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#868C98",
    marginBottom: 28,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  inputCardOverride: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
  },
  biometricBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 28,
  },
  forgotPasswordText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#868C98",
  },
  loginBtn: {
    borderRadius: 12,
    height: 52,
    backgroundColor: "#F8FAFC",
  },
  loginBtnText: {
    color: "#94A3B8",
    fontWeight: "600",
    fontSize: 16,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 28,
  },
  footerText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#868C98",
  },
  signUpLink: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  dividerText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    marginHorizontal: 12,
  },
  socialCol: {
    flexDirection: "column",
    gap: 12,
  },
  socialBtn: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    borderColor: "#E2E8F0",
    justifyContent: "center",
  },
  socialBtnText: {
    color: "#0F172A",
    fontWeight: "600",
    fontSize: 15,
  },
});

