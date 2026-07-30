import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton, OTPForm } from "../../components/ui";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "OTPVerification">;

export const OTPVerificationScreen = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { driverId } = route.params;
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "verified" | "error">("idle");
  const isCodeComplete = code.length === 6;

  const handleVerify = React.useCallback(
    async (codeToVerify: string) => {
      if (codeToVerify.length !== 6) return;
      setStatus("verifying");
      setTimeout(() => {
        setStatus("verified");
        navigation.navigate("LicenseIntro", { driverId });
      }, 1200);
    },
    [driverId, navigation]
  );

  const handleResend = React.useCallback(() => {
    // Resend trigger mock
  }, []);

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        We sent a six digit code to your email address and phone number
      </Text>

      <OTPForm
        onChange={setCode}
        onComplete={handleVerify}
        onResend={handleResend}
        // loading={status === "verifying"}
        error={status === "error" ? "Invalid verification code. Please try again." : undefined}
        autoFocus={true}
      />

      <AppButton
        title={status === "verifying" ? "Verifying Code" : status === "verified" ? "Verified" : "Verify Code"}
        onPress={() => handleVerify(code)}
        disabled={!isCodeComplete || status === "verifying"}
        loading={status === "verifying"}
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
