import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authService } from "../../api/services/auth";
import { AppButton, OTPForm } from "../../components/ui";
import { useVerifyOtpMutation } from "../../hooks/useAuth";
import { AuthStackParamList } from "../../navigation/types";
import { useAuthToast } from "../../context/AuthToastContext";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "OTPVerification">;

export const OTPVerificationScreen = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { driverId } = route.params;
  const { showAuthError, showAuthToast } = useAuthToast();
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const isCodeComplete = code.length === 6;

  const { mutateAsync: verifyOtp, isPending: isVerifying } = useVerifyOtpMutation();

  const handleVerify = React.useCallback(
    async (codeToVerify: string) => {
      if (codeToVerify.length !== 6 || isVerifying) return;
      try {
        console.log("🌐 [API Call] POST /accounts/verify-otp/ with otp:", codeToVerify);
        await verifyOtp(codeToVerify);
        setIsVerified(true);
        console.log("✅ [API Success] OTP verified successfully!");
        navigation.navigate("LicenseIntro", { driverId });
      } catch (err: any) {
        console.error("❌ [API Error] verifyOtp failed:", err?.response?.data || err?.message);
        showAuthError(err, "Invalid verification code. Please try again.");
      }
    },
    [driverId, isVerifying, navigation, verifyOtp, showAuthError]
  );

  const handleResend = React.useCallback(async () => {
    const emailToUse = (route.params as any)?.email;
    if (!emailToUse) {
      console.warn("⚠️ No email passed to OTPVerificationScreen for resend");
      showAuthToast("Unable to resend code without email address.", { type: "error" });
      return;
    }
    try {
      console.log("🌐 [API Call] POST /accounts/resend-otp/?email=", emailToUse);
      await authService.resendOtp(emailToUse);
      console.log("✅ [API Success] Resent OTP successfully");
      showAuthToast("A new verification code has been sent to your email.", { type: "info" });
    } catch (err: any) {
      console.error("❌ [API Error] resendOtp failed:", err);
      showAuthError(err, "Failed to resend verification code.");
    }
  }, [route.params, showAuthToast, showAuthError]);

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        We sent a six digit code to your email address and phone number
      </Text>

      <OTPForm
        onChange={(val) => {
          setCode(val);
        }}
        onComplete={handleVerify}
        onResend={handleResend}
        autoFocus={true}
      />

      <AppButton
        title={isVerifying ? "Verifying Code" : isVerified ? "Verified" : "Verify Code"}
        onPress={() => handleVerify(code)}
        disabled={!isCodeComplete || isVerifying}
        loading={isVerifying}
        size="lg"
        style={{ marginTop: 16 }}
      />

      <Text style={styles.footerText}>For your security, we verify every account.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  footerText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: "auto",
    marginBottom: 69,
  },
});
