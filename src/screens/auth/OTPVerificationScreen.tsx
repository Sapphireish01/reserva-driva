import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { AuthStackParamList } from "../../navigation/types";
// import { authService } from "../../api/services/auth";
import { OTPCodeInput } from "../../components/OTPCodeInput";
import { useCountdown } from "../../hooks/useCountdown";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "OTPVerification">;

export const OTPVerificationScreen = ({ route, navigation }: Props) => {
  const { driverId } = route.params;
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "verified" | "error">("idle");
  const { secondsLeft, reset } = useCountdown(10);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === "verifying") {
      spinValue.setValue(0);
      const animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
      return () => animation.stop();
    }
  }, [status, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleVerify = async (value: string) => {
    setStatus("verifying");
    try {
      // Bypassing real API call for local testing / mock flow
      setStatus("verified");
      navigation.navigate("LicenseIntro", { driverId });

      /* Original API call:
      const { data } = await authService.verifyOtp(driverId, value);
      if (data.verified) {
        setStatus("verified");
        navigation.navigate("LicenseIntro", { driverId });
      } else {
        setStatus("error");
      }
      */
    } catch {
      setStatus("error");
    }
  };

  const handleResend = async () => {
    // Bypassing real API call for local testing / mock flow
    reset();

    /* Original API call:
    await authService.requestOtp(driverId, method);
    reset();
    */
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        We sent a six digit code to your email address and phone number
      </Text>

      <OTPCodeInput value={code} onChange={setCode} onComplete={handleVerify} />

      {secondsLeft > 0 ? (
        <Text style={styles.expiry}>
          Code expires in {secondsLeft}s
        </Text>
      ) : (
        <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
          <Text style={styles.resend}>
            Didn{"'"}t receive a code? <Text style={styles.resendLink}>Resend</Text>
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, code.length < 6 && styles.buttonDisabled]}
        disabled={code.length < 6 || status === "verifying"}
        onPress={() => handleVerify(code)}
      >
        <View style={styles.buttonContent}>
          {status === "verifying" && (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="2.5"
                />
                <Path
                  d="M 12 3 A 9 9 0 0 1 21 12"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </Svg>
            </Animated.View>
          )}
          {status === "verified" && (
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M 8 0 C 12.4183 0 16 3.58172 16 8 C 16 12.4183 12.4183 16 8 16 C 3.58172 16 0 12.4183 0 8 C 0 3.58172 3.58172 0 8 0 Z M 11.4142 5.58579 C 11.7396 5.26035 12.267 5.26035 12.5924 5.58579 C 12.9178 5.91123 12.9178 6.43867 12.5924 6.76411 L 7.42093 11.9356 C 7.09549 12.261 6.56805 12.261 6.24261 11.9356 L 3.40759 9.10058 C 3.08215 8.77515 3.08215 8.24771 3.40759 7.92227 C 3.73303 7.59683 4.26047 7.59683 4.58591 7.92227 L 6.83177 10.1681 L 11.4142 5.58579 Z"
                fill="#05DF72"
              />
            </Svg>
          )}
          <Text style={[styles.buttonText, (code.length >= 6 || status !== "idle") && styles.buttonTextActive]}>
            {status === "verifying" ? "Verifying..." : status === "verified" ? "Verified" : "Verify Code"}
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.footerText}>For your security, we verify every account.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.h1 },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
  expiry: { ...typography.caption, color: colors.textMuted, textAlign: "center", marginTop: spacing.md },
  resend: { ...typography.caption, color: colors.textMuted, textAlign: "center", marginTop: spacing.xl },
  resendLink: { color: colors.dark, fontWeight: "700" },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: colors.primaryDisabled },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: { color: colors.textMuted, fontWeight: "600" },
  buttonTextActive: { color: "#FFFFFF" },
  footerText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: "auto",
    marginBottom: spacing.xl,
  },
});
