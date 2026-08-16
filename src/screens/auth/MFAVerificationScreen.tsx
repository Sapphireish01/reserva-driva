import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { authService } from "../../api/services/auth";
import { AppButton, OTPForm } from "../../components/ui";
import { AuthStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../state/authStore";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "MFAVerification">;

export const MFAVerificationScreen = ({ route, navigation }: Props) => {
  const { email } = route.params || {};
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const login = useAuthStore((s) => s.login);

  const isCodeComplete = code.length === 6;

  const handleVerify2FA = React.useCallback(
    async (codeToVerify: string) => {
      if (codeToVerify.length !== 6 || isVerifying) return;
      try {
        setIsVerifying(true);
        setErrorMessage(null);
        console.log("🌐 [API Call] POST /accounts/2fa/verify/ with mfa_code");
        const res = await authService.verify2FA(codeToVerify);
        console.log("✅ [API Success] 2FA verification response:", res.data);

        const data = res.data;
        const accessToken = data?.access;
        if (!accessToken) {
          throw new Error(data?.message || "2FA verification succeeded but no access token was returned.");
        }

        await login(accessToken, data?.refresh, data?.user);
      } catch (err: any) {
        console.error("❌ [API Error] verify2FA failed:", err?.response?.data || err?.message);
        const backendData = err?.response?.data;
        let msg = "Invalid 2FA PIN. Please try again.";
        if (typeof backendData === "string") {
          msg = backendData;
        } else if (backendData && typeof backendData === "object") {
          msg = backendData.message || backendData.detail || backendData.error || msg;
        } else if (err?.message) {
          msg = err.message;
        }
        setErrorMessage(msg);
      } finally {
        setIsVerifying(false);
      }
    },
    [isVerifying, login]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Two-Factor Verification</Text>
      <Text style={styles.subtitle}>
        {email
          ? `Enter the 6-digit 2FA code / PIN associated with ${email}`
          : "Please enter your 6-digit 2FA code / PIN to continue."}
      </Text>

      <OTPForm
        onChange={(val) => {
          setCode(val);
          if (errorMessage) setErrorMessage(null);
        }}
        onComplete={handleVerify2FA}
        error={errorMessage || undefined}
        autoFocus={true}
      />

      <AppButton
        title={isVerifying ? "Verifying PIN..." : "Verify 2FA"}
        onPress={() => handleVerify2FA(code)}
        disabled={!isCodeComplete || isVerifying}
        loading={isVerifying}
        size="lg"
        style={{ marginTop: 16 }}
      />

      <Text style={styles.footerText}>For your security, 2FA verification is required.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
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
    marginBottom: 60,
  },
});
