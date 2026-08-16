import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { authService } from "../../api/services/auth";
import { AppButton, OTPForm } from "../../components/ui";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPasswordOTP">;

export const ForgotPasswordOTPScreen = ({ route, navigation }: Props) => {
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = async (codeToVerify: string) => {
    if (codeToVerify.length !== 6 || isVerifying) return;
    setIsVerifying(true);
    setErrorMessage(null);
    try {
      console.log("🌐 [API Call] POST /accounts/password-reset/verify-otp/ with otp:", codeToVerify);
      await authService.verifyPasswordResetOtp(codeToVerify);
      console.log("✅ [API Success] Password reset OTP verified!");
      setIsVerified(true);
      setTimeout(() => {
        navigation.navigate("ResetPassword", { email, otpCode: codeToVerify });
      }, 500);
    } catch (err: any) {
      console.error("❌ [API Error] verifyPasswordResetOtp failed:", err?.response?.data || err?.message);
      const backendErr = err?.response?.data?.message || err?.response?.data?.detail || err?.message || "Invalid OTP code. Please try again.";
      setErrorMessage(String(backendErr));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage(null);
    try {
      console.log("🌐 [API Call] POST /accounts/request-password-reset with email:", email);
      await authService.requestPasswordReset(email);
      console.log("✅ [API Success] Resent password reset code successfully");
    } catch (err: any) {
      console.error("❌ [API Error] resend password reset OTP failed:", err);
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
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          We sent a six digit code to {email}
        </Text>

        <OTPForm
          onChange={(val) => {
            setCode(val);
            if (errorMessage) setErrorMessage(null);
          }}
          onComplete={handleVerify}
          onResend={handleResend}
          error={errorMessage || undefined}
          loading={isVerifying}
          autoFocus={true}
        />

        <AppButton
          title={isVerifying ? "Verifying..." : isVerified ? "Verified" : "Verify Code"}
          onPress={() => handleVerify(code)}
          disabled={code.length < 6 || isVerifying}
          loading={isVerifying}
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
  content: { padding: spacing.lg, paddingTop: 0, flexGrow: 1 },
  title: { fontFamily: "DM Sans Bold", fontSize: 26, fontWeight: "700", color: "#0F172A" },
  subtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", marginBottom: 24 },
  loginRow: { marginTop: 32, alignItems: "center" },
  loginText: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B" },
  loginBold: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#375DFB" },
});
