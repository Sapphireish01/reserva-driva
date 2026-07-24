import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M12.9842 10C12.9842 11.65 11.6509 12.9833 10.0009 12.9833C8.35091 12.9833 7.01758 11.65 7.01758 10C7.01758 8.35 8.35091 7.01666 10.0009 7.01666C11.6509 8.35 12.9842 8.35 12.9842 10Z"
      stroke="#868C98"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.99987 16.8916C12.9415 16.8916 15.6832 15.1583 17.5915 12.1583C18.3415 10.9833 18.3415 9.00831 17.5915 7.83331C15.6832 4.83331 12.9415 3.09998 9.99987 3.09998C7.0582 3.09998 4.31654 4.83331 2.4082 7.83331C1.6582 9.00831 1.6582 10.9833 2.4082 12.1583C4.31654 15.1583 7.0582 16.8916 9.99987 16.8916Z"
      stroke="#868C98"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {!visible && (
      <Path
        d="M3 3L17 17"
        stroke="#868C98"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    )}
  </Svg>
);

const FingerprintIcon = () => (
  <Ionicons name="finger-print-outline" size={24} color="#868C98" />
);

const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

const AppleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="#000000">
    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.69c.62-.76 1.04-1.81.93-2.86-.9.04-2 .6-2.65 1.36-.58.67-1.09 1.74-.95 2.78 1.01.08 2.05-.52 2.67-1.28z" />
  </Svg>
);

export const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showBiometric, setShowBiometric] = useState(true);

  const isFormValid = email.trim().length > 0 && password.length >= 6;

  const handleLogin = () => {
    if (!isFormValid) return;
    // Perform authentication logic or navigate to MainTabs
    navigation.reset({
      index: 0,
      routes: [{ name: "AccountCreated" }],
    });
  };

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
        <View style={styles.field}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={[styles.input, emailFocused && styles.inputFocused]}
            placeholder="e.g JDoe@gmail.com"
            placeholderTextColor="#868C98"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>

        {/* Password Field with Biometric Button */}
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <View style={[styles.passwordInputContainer, passwordFocused && styles.inputFocused]}>
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.passwordInputField}
                placeholder="........."
                placeholderTextColor="#868C98"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((prev) => !prev)}
                activeOpacity={0.7}
              >
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            </View>

            {showBiometric && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={() => {
                  // Biometric authentication trigger
                }}
                activeOpacity={0.7}
              >
                <FingerprintIcon />
              </TouchableOpacity>
            )}
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => navigation.navigate("ForgotPassword")}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Log in Button */}
        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          disabled={!isFormValid}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, !isFormValid && styles.buttonTextDisabled]}>
            Log in
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity
          style={styles.signUpRow}
          onPress={() => navigation.navigate("SignUp")}
          activeOpacity={0.7}
        >
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={styles.signUpBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Logins */}
        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
          <GoogleIcon />
          <Text style={styles.socialButtonText}>Continue with google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
          <AppleIcon />
          <Text style={styles.socialButtonText}>Continue with apple</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2, flexGrow: 1 },
  title: {
    fontFamily: "DM Sans",
    fontWeight: "900",
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.8,
    color: "#0F172A",
  },
  subtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#868C98",
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: "DM Sans",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1,
    marginBottom: spacing.xs,
    color: "#0F172A",
  },
  input: {
    fontFamily: "DM Sans",
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.text,
    backgroundColor: "#FFFFFF",
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  passwordInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: "#FFFFFF",
  },
  passwordInputField: {
    flex: 1,
    fontFamily: "DM Sans",
    fontSize: 15,
    paddingVertical: 12,
    color: colors.text,
  },
  eyeButton: {
    padding: 6,
  },
  biometricButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
  forgotPasswordText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#868C98",
  },
  button: {
    backgroundColor: "#375DFB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: spacing.md,
  },
  buttonDisabled: {
    backgroundColor: "#F6F8FA",
  },
  buttonText: {
    fontFamily: "DM Sans Bold",
    fontWeight: "700",
    fontSize: 15,
    color: "#FFFFFF",
  },
  buttonTextDisabled: {
    color: "#868C98",
  },
  signUpRow: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: "center",
  },
  signUpText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#868C98",
  },
  signUpBold: {
    fontFamily: "DM Sans Bold",
    fontWeight: "700",
    color: "#0F172A",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#868C98",
    paddingHorizontal: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: spacing.sm,
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  socialButtonText: {
    fontFamily: "DM Sans Bold",
    fontWeight: "600",
    fontSize: 14,
    color: "#0F172A",
  },
});
