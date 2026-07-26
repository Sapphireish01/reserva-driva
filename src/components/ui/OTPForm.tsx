import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OTPCodeInput } from "../OTPCodeInput";

export interface OTPFormProps {
  onComplete: (code: string) => void;
  onResend?: () => void;
  resendCountdownSeconds?: number;
  cellCount?: number;
  loading?: boolean;
  error?: string;
  autoFocus?: boolean;
}

export const OTPForm: React.FC<OTPFormProps> = ({
  onComplete,
  onResend,
  resendCountdownSeconds = 30,
  cellCount = 6,
  loading = false,
  error,
}) => {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(resendCountdownSeconds);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    if (timer > 0 || loading) return;
    setTimer(resendCountdownSeconds);
    setCode("");
    onResend?.();
  };

  const handleCodeChange = (val: string) => {
    setCode(val);
    if (val.length === cellCount) {
      onComplete(val);
    }
  };

  return (
    <View style={styles.container}>
      <OTPCodeInput value={code} onChange={handleCodeChange} onComplete={onComplete} />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#375DFB" />
          <Text style={styles.loadingText}>Verifying code...</Text>
        </View>
      ) : (
        <View style={styles.resendRow}>
          <Text style={styles.resendPrompt}>Didn't receive the code? </Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
              <Text style={styles.resendAction}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: 16,
  },
  errorText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#DC2626",
    marginTop: 12,
    textAlign: "center",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  loadingText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  resendPrompt: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
  },
  timerText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
  },
  resendAction: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "700",
    color: "#375DFB",
  },
});
