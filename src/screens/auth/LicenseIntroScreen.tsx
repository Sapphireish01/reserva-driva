import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "LicenseIntro">;

const GUIDELINES = [
  "Make sure your license is valid and not expired.",
  "Ensure all four corners of the license are visible and clearly captured.",
  "Avoid blurry or dark images — your details should be easy to read.",
  "The name on your license must match your driver details.",
];

export const LicenseIntroScreen = ({ route, navigation }: Props) => {
  const { driverId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Valid Drivers License</Text>
      <Text style={styles.subtitle}>
        Upload a valid license to continue with your self-drive booking.
      </Text>

      <Text style={styles.guidelinesTitle}>Capture guidelines</Text>
      {GUIDELINES.map((g) => (
        <Text key={g} style={styles.guideline}>
          • {g}
        </Text>
      ))}

      <Text style={styles.note}>Your information is secure and only used for verification.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("LicenseFrontCapture", { driverId })}
      >
        <Text style={styles.buttonText}>Scan License</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.h1 },
  subtitle: { ...typography.body, color: colors.textMuted, marginVertical: spacing.md },
  guidelinesTitle: { ...typography.h2, marginBottom: spacing.sm },
  guideline: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs },
  note: { ...typography.caption, color: colors.textMuted, marginTop: spacing.lg },
  button: {
    marginTop: "auto",
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
