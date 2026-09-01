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
import { PasswordRuleChecklist } from "../../components/PasswordRuleChecklist";
import { AppButton, AppPhoneInput, AppPhoneInputRef, AppTextInput } from "../../components/ui";
import { SignupPayload } from "../../api/services/auth";
import { useSignUpMutation } from "../../hooks/useAuth";
import { AuthStackParamList } from "../../navigation/types";
import { SignupFormValues, signupSchema } from "../../schemas/signup";
import { useAuthToast } from "../../context/AuthToastContext";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export const SignUpScreen = ({ navigation }: Props) => {
  const { showAuthError } = useAuthToast();
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("1");
  const phoneInputRef = React.useRef<AppPhoneInputRef>(null);
  const { mutateAsync: signUp, isPending: isSigningUp } = useSignUpMutation();

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
        console.log("🌐 [API Call] POST /accounts/register/ via useSignUpMutation", values);

        const callingCode = phoneInputRef.current?.getCallingCode() || selectedCountryCode || "1";

        const payload: SignupPayload = {
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phone.replace(/[^0-9]/g, ""),
          countryCode: callingCode,
          gender: values.gender,
          password: values.password,
          referralCode: values.referralCode || undefined,
        };

        const data = await signUp(payload);
        console.log("📡 [API Response] POST /auth/signup payload:", data);

        const driverId = (data as any)?.driverId ?? (data as any)?.id ?? "mock-driver-123";
        navigation.navigate("VerificationMethod", { driverId });
      } catch (err: any) {
        console.error("❌ [API Error] useSignUpMutation failed:", err?.response?.data || err?.message);
        showAuthError(err, "Failed to create account. Please try again.");
      }
    },
    [signUp, navigation, selectedCountryCode, showAuthError]
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
              autoCapitalize="words"
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
              value={field.value}
              onChangeText={field.onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        {/* Phone Number */}
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <AppPhoneInput
              ref={phoneInputRef}
              label="Phone Number"
              value={field.value}
              onChangeText={field.onChange}
              onCountryCodeChange={setSelectedCountryCode}
              error={errors.phone?.message}
            />
          )}
        />

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

        {/* Referral Code (Optional) */}
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

        {/* Terms of Service Checkbox */}
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
          disabled={!isValid || !agreedToTerms || isSubmitting || isSigningUp}
          loading={isSubmitting || isSigningUp}
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
