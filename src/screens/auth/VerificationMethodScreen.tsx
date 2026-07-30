import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MailIconItem } from "../../components/ProfileIcons";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "VerificationMethod">;

export const VerificationMethodScreen = ({ route, navigation }: Props) => {
  const { driverId } = route.params;
  const [method, setMethod] = useState<"sms" | "email">("sms");
  const [sending, setSending] = useState(false);

  const handleContinue = async () => {
    setSending(true);
    try {
      // Bypassing real API call for local testing / mock flow
      navigation.navigate("OTPVerification", { driverId, method });
      /* Original API call:
      await authService.requestOtp(driverId, method);
      navigation.navigate("OTPVerification", { driverId, method });
      */
    } catch (e) {
      console.warn(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Account</Text>
      <Text style={styles.subtitle}>
        Choose how you{"'"}d like to receive your verification code
      </Text>

      <Option
        label="Text Message (SMS)"
        description="Receive a code via text message"
        icon="phone"
        selected={method === "sms"}
        onPress={() => setMethod("sms")}
      />
      <Option
        label="Email"
        description="Receive a code in your inbox."
        icon="mail"
        selected={method === "email"}
        onPress={() => setMethod("email")}
      />

      <TouchableOpacity
        style={[styles.button, sending && styles.buttonDisabled]}
        disabled={sending}
        onPress={handleContinue}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{sending ? "Sending..." : "Continue"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Option = ({
  label,
  description,
  icon,
  selected,
  onPress,
}: {
  label: string;
  description: string;
  icon: "phone" | "mail";
  selected: boolean;
  onPress: () => void;
}) => {
  const iconColor = selected ? "#000000" : colors.text;

  return (
    <View style={styles.optionContainer}>
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={[styles.outerBorderWrapper, selected && styles.outerBorderSelected]}>
        <TouchableOpacity
          style={[styles.optionCard, selected && styles.optionCardSelected]}
          onPress={onPress}
          activeOpacity={0.85}
        >
          {icon === "mail" ? (
            <View style={styles.optionIcon}>
              <MailIconItem size={20} color={iconColor} />
            </View>
          ) : (
            <Feather
              name={icon}
              size={20}
              color={iconColor}
              style={styles.optionIcon}
            />
          )}
          <Text style={[styles.optionDescription, selected && styles.optionDescriptionSelected]}>
            {description}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  title: {
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.8,
    marginBottom: spacing.xs,
    color: colors.text,
  },
  subtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    lineHeight: 23.8,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  optionContainer: {
    marginBottom: spacing.md,
  },
  optionLabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  outerBorderWrapper: {
    borderRadius: 10,
    padding: 2,
    backgroundColor: "transparent",
  },
  outerBorderSelected: {
    borderColor: colors.border2,
    borderWidth: 1,
    borderRadius: 10,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.sm2,
    height: 44,
    backgroundColor: "#FFFFFF",
  },
  optionCardSelected: {
    borderColor: "#000000",
    borderWidth: 1.5,
  },
  optionIcon: {
    marginRight: spacing.sm,
  },
  optionDescription: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  optionDescriptionSelected: {
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: spacing.xs,
  },
  buttonDisabled: {
    backgroundColor: colors.primaryDisabled,
  },
  buttonText: {
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
