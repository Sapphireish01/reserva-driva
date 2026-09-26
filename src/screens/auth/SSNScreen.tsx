import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { driversService } from "../../api/services/drivers";
import { AppButton } from "../../components/ui";
import { AuthStackParamList } from "../../navigation/types";
import { ssnSchema } from "../../schemas/signup";
import { useAuthToast } from "../../context/AuthToastContext";
import { useAuthStore } from "../../state/authStore";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "SSN">;

export const SSNScreen = ({ route, navigation }: Props) => {
  const { email } = route.params;
  const user = useAuthStore((s) => s.user);
  const resolvedEmail = email || user?.email || "";

  const { showAuthError, showAuthToast } = useAuthToast();
  const [ssn, setSsn] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValid = ssnSchema.safeParse({ ssn }).success;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Submitted once, over TLS, straight to the backend for profile update.
      // `ssn` is never written to SecureStore/AsyncStorage and is discarded
      // from component state as soon as this screen unmounts.
      await driversService.uploadSsn(resolvedEmail, ssn);
      showAuthToast("Account created successfully! Please log in.", { type: "success" });
      navigation.reset({
        index: 0,
        routes: [{ name: "Login", params: resolvedEmail ? { email: resolvedEmail } : undefined }],
      });
    } catch (e: any) {
      showAuthError(e, "Couldn't verify your SSN. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Step...</Text>
      <Text style={styles.subtitle}>
        You&apos;re almost done! We just need to verify your SSN to complete your registration
      </Text>

      <Text style={styles.label}>Social Security Number</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g 000000000"
        keyboardType="number-pad"
        maxLength={9}
        value={ssn}
        onChangeText={(text) => setSsn(text.replace(/[^0-9]/g, ""))}
      />

      <AppButton
        title="Create Account"
        loadingTitle="Creating Account..."
        onPress={handleSubmit}
        disabled={!isValid || submitting}
        loading={submitting}
        size="lg"
        style={{ marginTop: "auto" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 0, padding: spacing.lg },
  title: { ...typography.h1 },
  subtitle: { ...typography.body, color: colors.dark, fontWeight: 400, fontSize: 14, marginVertical: spacing.md, lineHeight: 23.8, letterSpacing: -0.3 },
  label: { ...typography.caption, fontWeight: "500", marginBottom: spacing.xs },
  input: {
    fontWeight: "400",
    lineHeight: 23.8,
    letterSpacing: -0.3,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.sm2,
    paddingLeft: spacing.smlg,
  },
});
