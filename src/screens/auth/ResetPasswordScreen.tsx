import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { authService } from "../../api/services/auth";
import { PasswordRuleChecklist } from "../../components/PasswordRuleChecklist";
import { AppButton, AppTextInput } from "../../components/ui";
import { usePasswordRules } from "../../hooks/usePasswordRules";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

export const ResetPasswordScreen = ({ route, navigation }: Props) => {
  const { otpCode } = route.params || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const rules = usePasswordRules(password);
  const allRulesPassed = rules.every((r) => r.passed);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = allRulesPassed && passwordsMatch;

  const handleResetPassword = async () => {
    if (!isFormValid || isResetting || isResetSuccess) return;

    setIsResetting(true);
    setApiError(null);
    try {
      console.log("🌐 [API Call] POST /accounts/password-reset/confirm/?otp_code=", otpCode);
      await authService.confirmPasswordReset(otpCode || "", password);
      console.log("✅ [API Success] Password reset confirmed successfully!");
      setIsResetSuccess(true);
      setTimeout(() => {
        navigation.navigate("Login");
      }, 1000);
    } catch (err: any) {
      console.error("❌ [API Error] confirmPasswordReset failed:", err?.response?.data || err?.message);
      const data = err?.response?.data;
      let msg = "Failed to reset password. Please try again.";
      if (typeof data === "string") {
        msg = data;
      } else if (data && typeof data === "object") {
        if (data.message) {
          msg = String(data.message);
        } else if (data.detail) {
          msg = String(data.detail);
        } else if (data.password && Array.isArray(data.password)) {
          msg = data.password.join(" ");
        } else if (data.user_pin && Array.isArray(data.user_pin)) {
          msg = data.user_pin.join(" ");
        } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
          msg = data.non_field_errors.join(" ");
        } else {
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            msg = data[firstKey].join(" ");
          } else if (firstKey && typeof data[firstKey] === "string") {
            msg = data[firstKey];
          }
        }
      } else if (err?.message) {
        msg = err.message;
      }
      setApiError(msg);
    } finally {
      setIsResetting(false);
    }
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
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Create a new password for your account
        </Text>

        <AppTextInput
          label="New Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          isPassword
          autoFocus={true}
        />

        <AppTextInput
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
          error={confirmPassword && !passwordsMatch ? "Passwords do not match" : undefined}
        />

        <View style={styles.checklistWrapper}>
          <PasswordRuleChecklist password={password} />
        </View>

        {apiError ? <Text style={styles.apiErrorText}>{apiError}</Text> : null}

        <AppButton
          title={isResetSuccess ? "Password Reset!" : "Reset Password"}
          onPress={handleResetPassword}
          disabled={!isFormValid || isResetting}
          loading={isResetting}
          size="lg"
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl * 1.5, flexGrow: 1 },
  title: { fontFamily: "DM Sans Bold", fontSize: 26, fontWeight: "700", color: "#0F172A" },
  subtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", marginBottom: 24 },
  checklistWrapper: { marginVertical: 12 },
  apiErrorText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: colors.error || "#EF4444",
    marginTop: spacing.xs,
  },
});
