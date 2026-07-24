import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPasswordOTP">;

export const ForgotPasswordOTPScreen = ({ route, navigation }: Props) => {
  const { email } = route.params;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const inputs = useRef<Array<TextInput | null>>([]);

  const fullCode = code.join("");
  const isComplete = fullCode.length === 6;

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (!isComplete || isVerifying || isVerified) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setTimeout(() => {
        navigation.navigate("ResetPassword", { email });
      }, 800);
    }, 1200);
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
        {/* Title & Subtitle */}
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          We sent a six digit code to your email address and phone number
        </Text>

        {/* 6 Digit Input Boxes */}
        <View style={styles.otpRow}>
          {code.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(ref) => {
                inputs.current[idx] = ref;
              }}
              style={[
                styles.otpBox,
                focusedIndex === idx && styles.otpBoxFocused,
                digit ? styles.otpBoxFilled : null,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              onFocus={() => setFocusedIndex(idx)}
              onBlur={() => setFocusedIndex(null)}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Resend Link */}
        <TouchableOpacity style={styles.resendContainer} activeOpacity={0.7}>
          <Text style={styles.resendText}>
            Didn't receive a code? <Text style={styles.resendBold}>Resend</Text>
          </Text>
        </TouchableOpacity>

        {/* Verify Code Button */}
        <TouchableOpacity
          style={[
            styles.button,
            !isComplete && styles.buttonDisabled,
            isVerified && styles.buttonVerified,
          ]}
          disabled={!isComplete || isVerifying}
          onPress={handleVerify}
          activeOpacity={0.85}
        >
          {isVerifying ? (
            <View style={styles.buttonContentRow}>
              <Text style={styles.buttonText}>Verify Code</Text>
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginLeft: 8 }} />
            </View>
          ) : isVerified ? (
            <View style={styles.buttonContentRow}>
              <Text style={styles.buttonText}>Verified</Text>
              <Ionicons name="checkmark-circle" size={18} color="#22C55E" style={{ marginLeft: 8 }} />
            </View>
          ) : (
            <Text style={[styles.buttonText, !isComplete && styles.buttonTextDisabled]}>
              Verify Code
            </Text>
          )}
        </TouchableOpacity>

        {/* Security Footer Note */}
        <View style={styles.footerNoteContainer}>
          <Text style={styles.footerNoteText}>
            For your security, we verify every account.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2, flexGrow: 1 },
  backButton: {
    marginBottom: spacing.md,
    marginTop: spacing.xs,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  title: {
    fontFamily: "DM Sans",
    fontWeight: "900",
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.8,
    color: "#0F172A",
  },
  subtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#868C98",
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: spacing.lg,
  },
  otpBox: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    textAlign: "center",
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },
  otpBoxFocused: {
    borderColor: colors.dark,
  },
  otpBoxFilled: {
    borderColor: colors.border,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  resendText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#868C98",
  },
  resendBold: {
    fontFamily: "DM Sans Bold",
    fontWeight: "700",
    color: "#0F172A",
  },
  button: {
    backgroundColor: "#375DFB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  buttonDisabled: {
    backgroundColor: "#F6F8FA",
  },
  buttonVerified: {
    backgroundColor: "#375DFB",
  },
  buttonContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "DM Sans Bold",
    fontWeight: "700",
    fontSize: 15,
    color: "#FFFFFF",
  },
  buttonTextDisabled: {
    color: "#868C98",
  },
  footerNoteContainer: {
    marginTop: "auto",
    paddingTop: spacing.xl * 2,
    alignItems: "center",
  },
  footerNoteText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#868C98",
    textAlign: "center",
  },
});
