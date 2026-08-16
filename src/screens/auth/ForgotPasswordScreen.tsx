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
import { authService } from "../../api/services/auth";
import { AppButton, AppTextInput } from "../../components/ui";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isEmailValid = email.trim().length > 3 && email.includes("@");

  const handleSendCode = async () => {
    if (!isEmailValid || isSending) return;
    setIsSending(true);
    setApiError(null);
    try {
      console.log("🌐 [API Call] POST /accounts/password-reset/ with email:", email.trim());
      await authService.requestPasswordReset(email.trim());
      console.log("✅ [API Success] Password reset code sent!");
      navigation.navigate("ForgotPasswordOTP", { email: email.trim() });
    } catch (err: any) {
      console.error("❌ [API Error] requestPasswordReset failed:", err?.response?.data || err?.message);
      const backendErr = err?.response?.data?.message || err?.response?.data?.detail || err?.message || "Failed to send reset code. Please try again.";
      setApiError(String(backendErr));
    } finally {
      setIsSending(false);
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
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a reset link
        </Text>

        <AppTextInput
          label="Email Address"
          placeholder="e.g JDoe@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus={true}
          helperText="Use the email linked to your account."
        />

        {apiError ? <Text style={styles.apiErrorText}>{apiError}</Text> : null}

        <AppButton
          title={isSending ? "Sending Code..." : "Send Code"}
          onPress={handleSendCode}
          disabled={!isEmailValid || isSending}
          loading={isSending}
          size="lg"
          style={{ marginTop: 24 }}
        />

        <TouchableOpacity
          style={styles.loginRow}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.7}
        >
          <Text style={styles.loginText}>
            Remember your password? <Text style={styles.loginBold}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl * 1.5, flexGrow: 1 },
  title: { fontFamily: "DM Sans Bold", fontSize: 26, fontWeight: "700", color: "#0F172A" },
  subtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", marginBottom: 32 },
  loginRow: { marginTop: 32, alignItems: "center" },
  loginText: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B" },
  loginBold: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#375DFB" },
  apiErrorText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: colors.error || "#EF4444",
    marginTop: spacing.xs,
  },
});
