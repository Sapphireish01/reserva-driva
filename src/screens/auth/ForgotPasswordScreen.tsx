import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
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

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isEmailValid = email.trim().length > 3 && email.includes("@");

  const handleSendCode = () => {
    if (!isEmailValid) return;
    navigation.navigate("ForgotPasswordOTP", { email: email.trim() });
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
        {/* Header Title & Subtitle */}
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a reset link
        </Text>

        {/* Email Input Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={[styles.input, isFocused && styles.inputFocused]}
            placeholder="e.g JDoe@gmail.com"
            placeholderTextColor="#868C98"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={styles.fieldHint}>Use the email linked to your account.</Text>
        </View>

        {/* Send Code Action Button */}
        <TouchableOpacity
          style={[styles.button, !isEmailValid && styles.buttonDisabled]}
          disabled={!isEmailValid}
          onPress={handleSendCode}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, !isEmailValid && styles.buttonTextDisabled]}>
            Send Code
          </Text>
        </TouchableOpacity>

        {/* Remember Password Link */}
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
  field: {
    marginBottom: spacing.xl,
  },
  label: {
    fontFamily: "DM Sans",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1,
    marginBottom: spacing.xs,
    color: "#0F172A",
  },
  input: {
    fontFamily: "DM Sans",
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.text,
    backgroundColor: "#FFFFFF",
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  fieldHint: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#868C98",
    marginTop: 6,
  },
  button: {
    backgroundColor: "#375DFB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: spacing.md,
  },
  buttonDisabled: {
    backgroundColor: "#F6F8FA",
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
  loginRow: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  loginText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#868C98",
  },
  loginBold: {
    fontFamily: "DM Sans Bold",
    fontWeight: "700",
    color: "#0F172A",
  },
});
