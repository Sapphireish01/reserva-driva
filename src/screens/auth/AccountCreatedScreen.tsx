import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "AccountCreated">;

export const AccountCreatedScreen = ({ navigation }: Props) => {
  useEffect(() => {
    // RootNavigator should be listening to auth state (e.g. via a stored
    // session token / zustand auth store) and swap to MainAppNavigator once
    // it flips — this screen doesn't need to navigate manually.
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Created</Text>
      <Text style={styles.check}>✓</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
  title: { ...typography.h1, color: "#fff", marginBottom: spacing.md },
  check: { fontSize: 40, color: colors.success },
});
