import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { ssnSchema } from "../../schemas/signup";
import { driversService } from "../../api/services/drivers";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "SSN">;

export const SSNScreen = ({ route, navigation }: Props) => {
  const { driverId } = route.params;
  const [ssn, setSsn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isValid = ssnSchema.safeParse({ ssn }).success;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // Submitted once, over TLS, straight to the backend for tokenization.
      // `ssn` is never written to SecureStore/AsyncStorage and is discarded
      // from component state as soon as this screen unmounts.
      await driversService.submitSsn(driverId, ssn);
      navigation.navigate("AccountCreated");
    } catch (e: any) {
      setError(e?.message ?? "Couldn't verify your SSN. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Step...</Text>
      <Text style={styles.subtitle}>
        You're almost done! We just need to verify your SSN to complete your registration
      </Text>

      <Text style={styles.label}>Social Security Number</Text>
      <TextInput
        style={styles.input}
        placeholder="000000000"
        keyboardType="number-pad"
        maxLength={9}
        secureTextEntry
        value={ssn}
        onChangeText={(text) => setSsn(text.replace(/[^0-9]/g, ""))}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        disabled={!isValid || submitting}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Creating Account..." : "Create Account"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.h1 },
  subtitle: { ...typography.body, color: colors.textMuted, marginVertical: spacing.md },
  label: { ...typography.caption, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  error: { ...typography.caption, color: colors.error, marginTop: spacing.xs },
  button: {
    marginTop: "auto",
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: colors.primaryDisabled },
  buttonText: { color: "#fff", fontWeight: "600" },
});
