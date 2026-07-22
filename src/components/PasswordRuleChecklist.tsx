import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { usePasswordRules } from "../hooks/usePasswordRules";
import { colors, spacing } from "../theme/colors";

export const PasswordRuleChecklist = ({ password }: { password: string }) => {
  const rules = usePasswordRules(password);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Password must contain at least:</Text>
      <View style={styles.pillsRow}>
        {rules.map((rule) => (
          <View
            key={rule.label}
            style={[
              styles.pill,
              rule.passed && styles.pillPassed,
            ]}
          >
            <Text style={[styles.pillText, rule.passed && styles.pillTextPassed]}>
              {rule.label}
            </Text>
            <Ionicons
              name={rule.passed ? "checkmark-circle" : "checkmark-circle-outline"}
              size={15}
              color={rule.passed ? colors.success : colors.textMuted}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
  },
  pillPassed: {
    borderColor: colors.success,
    backgroundColor: "#F0FDF4",
  },
  pillText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    fontWeight: "400",
    color: colors.grey,
  },
  pillTextPassed: {
    color: colors.text,
    fontWeight: "500",
  },
});
