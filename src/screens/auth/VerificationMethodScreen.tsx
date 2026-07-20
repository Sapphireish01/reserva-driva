import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { authService } from "../../api/services/auth";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "VerificationMethod">;

export const VerificationMethodScreen = ({ route, navigation }: Props) => {
  const { driverId } = route.params;
  const [method, setMethod] = useState<"sms" | "email">("sms");
  const [sending, setSending] = useState(false);

  const handleContinue = async () => {
    setSending(true);
    try {
      await authService.requestOtp(driverId, method);
      navigation.navigate("OTPVerification", { driverId, method });
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Account</Text>
      <Text style={styles.subtitle}>
        Choose how you'd like to receive your verification code
      </Text>

      <Option
        label="Text Message (SMS)"
        description="Receive a code via text message"
        selected={method === "sms"}
        onPress={() => setMethod("sms")}
      />
      <Option
        label="Email"
        description="Receive a code in your inbox"
        selected={method === "email"}
        onPress={() => setMethod("email")}
      />

      <TouchableOpacity style={styles.button} disabled={sending} onPress={handleContinue}>
        <Text style={styles.buttonText}>{sending ? "Sending..." : "Continue"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Option = ({
  label,
  description,
  selected,
  onPress,
}: {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.option, selected && styles.optionSelected]}
    onPress={onPress}
  >
    <View style={[styles.radio, selected && styles.radioSelected]} />
    <View>
      <Text style={styles.optionLabel}>{label}</Text>
      <Text style={styles.optionDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.h1 },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  optionSelected: { borderColor: colors.primary },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: colors.border },
  radioSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  optionLabel: { ...typography.body, fontWeight: "600" },
  optionDescription: { ...typography.caption, color: colors.textMuted },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
