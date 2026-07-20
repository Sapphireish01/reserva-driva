import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { authService } from "../../api/services/auth";
import { useCountdown } from "../../hooks/useCountdown";
import { OTPCodeInput } from "../../components/OTPCodeInput";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "OTPVerification">;

export const OTPVerificationScreen = ({ route, navigation }: Props) => {
  const { driverId, method } = route.params;
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "verified" | "error">("idle");
  const { secondsLeft, isExpired, reset } = useCountdown(180);

  const handleVerify = async (value: string) => {
    setStatus("verifying");
    try {
      // The backend — not the client — decides whether the code is valid.
      const { data } = await authService.verifyOtp(driverId, value);
      if (data.verified) {
        setStatus("verified");
        navigation.navigate("LicenseIntro", { driverId });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleResend = async () => {
    await authService.requestOtp(driverId, method);
    reset();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        We sent a six digit code to your email address and phone number
      </Text>

      <OTPCodeInput value={code} onChange={setCode} onComplete={handleVerify} />

      <Text style={styles.expiry}>
        {isExpired ? "Code expired" : `Code expires in ${secondsLeft}s`}
      </Text>

      <TouchableOpacity disabled={!isExpired} onPress={handleResend}>
        <Text style={styles.resend}>
          Didn't receive a code? <Text style={styles.resendLink}>Resend</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, code.length < 6 && styles.buttonDisabled]}
        disabled={code.length < 6 || status === "verifying"}
        onPress={() => handleVerify(code)}
      >
        <Text style={styles.buttonText}>
          {status === "verifying" ? "Verifying..." : status === "verified" ? "Verified ✓" : "Verify Code"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.h1 },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
  expiry: { ...typography.caption, color: colors.textMuted, textAlign: "center", marginTop: spacing.md },
  resend: { ...typography.caption, color: colors.textMuted, textAlign: "center", marginTop: spacing.sm },
  resendLink: { color: colors.primary, fontWeight: "600" },
  button: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: colors.primaryDisabled },
  buttonText: { color: "#fff", fontWeight: "600" },
});
