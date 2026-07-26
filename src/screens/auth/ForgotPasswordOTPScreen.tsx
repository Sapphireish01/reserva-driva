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
import { AppButton, OTPForm } from "../../components/ui";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPasswordOTP">;

export const ForgotPasswordOTPScreen = ({ route, navigation }: Props) => {
  const { email } = route.params;
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = (code: string) => {
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
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          We sent a six digit code to {email}
        </Text>

        <OTPForm
          onComplete={handleVerify}
          loading={isVerifying}
          autoFocus={true}
        />

        <AppButton
          title={isVerifying ? "Verifying..." : isVerified ? "Verified" : "Verify Code"}
          onPress={() => {}}
          disabled={isVerifying}
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
  content: { padding: spacing.lg, paddingTop: spacing.xl * 1.5, flexGrow: 1 },
  title: { fontFamily: "DM Sans Bold", fontSize: 26, fontWeight: "700", color: "#0F172A" },
  subtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", marginBottom: 24 },
  loginRow: { marginTop: 32, alignItems: "center" },
  loginText: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B" },
  loginBold: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#375DFB" },
});
