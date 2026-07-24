import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { PasswordRuleChecklist } from "../../components/PasswordRuleChecklist";
import { usePasswordRules } from "../../hooks/usePasswordRules";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

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

export const ResetPasswordScreen = ({ route, navigation }: Props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const [isResetting, setIsResetting] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  const rules = usePasswordRules(password);
  const allRulesPassed = rules.every((r) => r.passed);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = allRulesPassed && passwordsMatch;

  const handleResetPassword = () => {
    if (!isFormValid || isResetting || isResetSuccess) return;

    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setIsResetSuccess(true);
      setTimeout(() => {
        navigation.navigate("Login");
      }, 1000);
    }, 1200);
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
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a reset link
        </Text>

        {/* Password Input Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
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
        </View>

        {/* Password Rules Checklist */}
        <PasswordRuleChecklist password={password} />

        {/* Confirm Password Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={[styles.passwordInputContainer, confirmFocused && styles.inputFocused]}>
            <TextInput
              underlineColorAndroid="transparent"
              style={styles.passwordInputField}
              placeholder="........."
              placeholderTextColor="#868C98"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              activeOpacity={0.7}
            >
              <EyeIcon visible={showConfirmPassword} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Reset Password Action Button */}
        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          disabled={!isFormValid || isResetting}
          onPress={handleResetPassword}
          activeOpacity={0.85}
        >
          {isResetting ? (
            <View style={styles.buttonContentRow}>
              <Text style={styles.buttonText}>Reset Password</Text>
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginLeft: 8 }} />
            </View>
          ) : isResetSuccess ? (
            <View style={styles.buttonContentRow}>
              <Text style={styles.buttonText}>Password has been reset!</Text>
              <Ionicons name="checkmark-circle" size={18} color="#22C55E" style={{ marginLeft: 8 }} />
            </View>
          ) : (
            <Text style={[styles.buttonText, !isFormValid && styles.buttonTextDisabled]}>
              Reset Password
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2, flexGrow: 1 },
  backButton: {
    marginBottom: spacing.md,
    marginTop: spacing.xs,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
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
    marginBottom: spacing.xl,
    lineHeight: 20,
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
  passwordInputContainer: {
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
  inputFocused: {
    borderColor: colors.primary,
  },
  button: {
    backgroundColor: "#375DFB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  buttonDisabled: {
    backgroundColor: "#F6F8FA",
  },
  buttonContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
});
