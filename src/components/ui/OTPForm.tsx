import { colors } from "@/theme/colors";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OTPCodeInput } from "../OTPCodeInput";
import { AppLoader, CheckIcon } from "./AppLoader";

export interface OTPFormProps {
  onComplete: (code: string) => void;
  onChange?: (code: string) => void;
  onResend?: () => void | Promise<void>;
  resendCountdownSeconds?: number;
  cellCount?: number;
  loading?: boolean;
  error?: string;
  autoFocus?: boolean;
}

export const OTPForm: React.FC<OTPFormProps> = ({
  onComplete,
  onChange,
  onResend,
  resendCountdownSeconds = 30,
  cellCount = 6,
  loading = false,
  error,
}) => {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(resendCountdownSeconds);
  const [isResending, setIsResending] = useState(false);
  const [isResent, setIsResent] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (timer > 0 || loading || isResending) return;
    setIsResending(true);
    setIsResent(false);
    try {
      await Promise.all([
        onResend?.(),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
      setIsResent(true);
      setTimer(resendCountdownSeconds);
      setCode("");
      onChange?.("");
      setTimeout(() => {
        setIsResent(false);
      }, 3000);
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (val: string) => {
    setCode(val);
    onChange?.(val);
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
          <AppLoader size={20} color="#375DFB" />
          <Text style={styles.loadingText}>Verifying code...</Text>
        </View>
      ) : (
        <View style={styles.resendRow}>
          {isResending ? (
            <>
              <Text style={styles.resendPrompt}>Didn't receive a code? </Text>
              <View style={styles.actionRow}>
                <Text style={styles.resendAction}>Resend </Text>
                <AppLoader size={16} color="#828282" />
              </View>
            </>
          ) : isResent ? (
            <>
              <Text style={styles.resendPrompt}>Didn't receive a code? </Text>
              <View style={styles.actionRow}>
                <Text style={styles.sentAction}>Sent </Text>
                <CheckIcon size={10} color={colors.success} />
              </View>
            </>
          ) : timer > 0 ? (
            <Text style={styles.resendPrompt}>Code expires in {timer}s</Text>
          ) : (
            <>
              <Text style={styles.resendPrompt}>Didn't receive a code? </Text>
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={styles.resendAction}>Resend</Text>
              </TouchableOpacity>
            </>
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
    marginTop: 52,
  },
  resendPrompt: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
  },
  timerText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "500",
    color: "#94A3B8",
  },
  resendAction: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sentAction: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "500",
  },
});
