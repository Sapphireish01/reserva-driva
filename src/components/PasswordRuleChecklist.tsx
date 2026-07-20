import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { usePasswordRules } from "../hooks/usePasswordRules";
import { colors, spacing, typography } from "../theme/colors";

export const PasswordRuleChecklist = ({ password }: { password: string }) => {
  const rules = usePasswordRules(password);

  return (
    <View style={styles.row}>
      {rules.map((rule) => (
        <Text
          key={rule.label}
          style={[styles.rule, { color: rule.passed ? colors.success : colors.textMuted }]}
        >
          {rule.passed ? "✓" : "○"} {rule.label}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  rule: {
    ...typography.caption,
  },
});
