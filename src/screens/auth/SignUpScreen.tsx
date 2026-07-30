import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { PasswordRuleChecklist } from "../../components/PasswordRuleChecklist";
import { AppButton, AppTextInput } from "../../components/ui";
import { useCountryCodes } from "../../hooks/useCountryCodes";
import { AuthStackParamList } from "../../navigation/types";
import { SignupFormValues, signupSchema } from "../../schemas/signup";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

const StyledPhoneInput = ({
  value,
  onChangeText,
}: {
  value?: string;
  onChangeText: (text: string) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const phoneInputRef = React.useRef<PhoneInput>(null);
  const { countryCodesList, defaultCountryCode } = useCountryCodes();

  return (
    <View style={[styles.phoneContainer, isFocused && styles.inputFocused]}>
      <PhoneInput
        ref={phoneInputRef}
        defaultCode={defaultCountryCode}
        countryPickerProps={{ countryCodes: countryCodesList }}
        layout="first"
        onChangeFormattedText={onChangeText}
        withShadow={false}
        withDarkTheme={false}
        containerStyle={styles.phoneInnerContainer}
        textContainerStyle={styles.phoneTextContainer}
        textInputStyle={styles.phoneTextInput}
        codeTextStyle={styles.phoneCodeText}
        flagButtonStyle={styles.phoneFlagButton}
        renderDropdownImage={
          <Ionicons name="chevron-down" size={14} color={colors.text} style={{ marginLeft: 4 }} />
        }
        textInputProps={{
          placeholder: "(555) 000-0000",
          placeholderTextColor: colors.textMuted,
          underlineColorAndroid: "transparent",
          onFocus: () => setIsFocused(true),
          onBlur: () => setIsFocused(false),
        }}
      />
    </View>
  );
};

export const SignUpScreen = ({ navigation }: Props) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: { agreedToTerms: false as unknown as true },
  });

  const password = watch("password") ?? "";
  const agreedToTerms = watch("agreedToTerms");

  const onSubmit = React.useCallback(
    async (values: SignupFormValues) => {
      try {
        const mockDriverId = "mock-driver-123";
        navigation.navigate("VerificationMethod", { driverId: mockDriverId });
      } catch (err) {
        console.warn(err);
      }
    },
    [navigation]
  );

  const handleNavigateLogin = React.useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Make Every Mile Count</Text>

        {/* Full Name */}
        <Controller
          control={control}
          name="fullName"
          render={({ field }) => (
            <AppTextInput
              label="Full Name"
              placeholder="e.g John Doe"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.fullName?.message}
            />
          )}
        />

        {/* Email Address */}
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <AppTextInput
              label="Email Address"
              placeholder="e.g JDoe@gmail.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.email?.message}
            />
          )}
        />

        {/* Phone Number */}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Phone Number</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field }) =>
              Platform.OS === "web" ? (
                <AppTextInput
                  placeholder="+1 (555) 000-0000"
                  keyboardType="phone-pad"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              ) : (
                <StyledPhoneInput
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )
            }
          />
          {errors.phone?.message ? (
            <Text style={styles.error}>{errors.phone.message}</Text>
          ) : null}
        </View>

        {/* Gender */}
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <AppTextInput
              label="Gender"
              placeholder="e.g Female"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.gender?.message}
            />
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <AppTextInput
              label="Password"
              placeholder="••••••••"
              value={field.value}
              onChangeText={field.onChange}
              isPassword
              error={errors.password?.message}
            />
          )}
        />
        {password.length > 0 && <PasswordRuleChecklist password={password} />}

        {/* Confirm Password */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <AppTextInput
              label="Confirm Password"
              placeholder="••••••••"
              value={field.value}
              onChangeText={field.onChange}
              isPassword
              error={errors.confirmPassword?.message}
            />
          )}
        />

        {/* Referral Code */}
        <Controller
          control={control}
          name="referralCode"
          render={({ field }) => (
            <AppTextInput
              label="Referral Code (optional)"
              placeholder="e.g WERT283-EDD"
              autoCapitalize="characters"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.referralCode?.message}
            />
          )}
        />

        {/* Terms Checkbox */}
        <Controller
          control={control}
          name="agreedToTerms"
          render={({ field }) => (
            <View style={styles.termsRow}>
              <TouchableOpacity
                style={[styles.checkbox, !!field.value && styles.checkboxChecked]}
                onPress={() => field.onChange(!field.value)}
                activeOpacity={0.8}
              >
                {!!field.value && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{" "}
                <Text style={styles.boldText}>Terms of Service</Text> and{" "}
                <Text style={styles.boldText}>Privacy Policy</Text>.
              </Text>
            </View>
          )}
        />

        <AppButton
          title="Create Account"
          loadingTitle="Creating..."
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || !agreedToTerms || isSubmitting}
          loading={isSubmitting}
          size="lg"
          style={styles.buttonOverride}
          textStyle={styles.buttonTextOverride}
        />

        <TouchableOpacity
          style={styles.loginRow}
          onPress={handleNavigateLogin}
          activeOpacity={0.7}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginBold}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    {children}
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xl * 4, flexGrow: 1 },
  title: {
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.8,
  },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.sm, marginTop: spacing.smlg },
  field: { marginBottom: spacing.md },
  label: {
    fontFamily: "DM Sans",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 23.8,
    letterSpacing: -0.1,
    marginBottom: spacing.xs,
    color: colors.text,
  },
  input: {
    fontFamily: "DM Sans",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 23.8,
    letterSpacing: -0.3,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.inputTextColor,
  },
  inputFocused: {
    borderColor: "#000000",
    borderWidth: 1.5,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.md,
  },
  passwordInputField: {
    flex: 1,
    fontFamily: "DM Sans",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 23.8,
    letterSpacing: -0.3,
    paddingVertical: spacing.sm,
    color: colors.text,
  },
  eyeButton: {
    paddingLeft: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  phoneContainer: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  phoneInnerContainer: {
    width: "100%",
    height: 48,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  phoneFlagButton: {
    width: 90,
    height: 48,
    backgroundColor: "transparent",
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  phoneCodeText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginLeft: -4,
  },
  phoneTextContainer: {
    height: 48,
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: spacing.sm,
  },
  phoneTextInput: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    height: 48,
    paddingVertical: 0,
  },
  error: { ...typography.caption, color: colors.error, marginTop: spacing.xs },
  termsRow: { flexDirection: "row", alignItems: "flex-start", marginVertical: spacing.md, gap: spacing.sm },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.grey,
    borderColor: colors.grey,
  },
  termsText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    lineHeight: 20,
    color: colors.grey,
    flex: 1,
  },
  boldText: {
    fontFamily: "DM Sans",
    fontWeight: "500",
    color: colors.inputTextColor,
  },
  buttonOverride: {
    borderRadius: 16,
    height: 52,
    marginTop: spacing.sm,
  },
  buttonTextOverride: {
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "600",
  },
  loginRow: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  loginText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: colors.textMuted,
  },
  loginBold: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
});
