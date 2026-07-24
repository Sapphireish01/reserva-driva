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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import Svg, { Path } from "react-native-svg";
// import { authService } from "../../api/services/auth";
import { PasswordRuleChecklist } from "../../components/PasswordRuleChecklist";
import { AuthStackParamList } from "../../navigation/types";
import { SignupFormValues, signupSchema } from "../../schemas/signup";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M12.9842 10C12.9842 11.65 11.6509 12.9833 10.0009 12.9833C8.35091 12.9833 7.01758 11.65 7.01758 10C7.01758 8.35 8.35091 7.01666 10.0009 7.01666C11.6509 7.01666 12.9842 8.35 12.9842 10Z"
      stroke="#868C98"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.99987 16.8916C12.9415 16.8916 15.6832 15.1583 17.5915 12.1583C18.3415 10.9833 18.3415 9.00831 17.5915 7.83331C15.6832 4.83331 12.9415 3.09998 9.99987 3.09998C7.0582 3.09998 4.31654 4.83331 2.4082 7.83331C1.6582 9.00831 1.6582 10.9833 2.4082 12.1583C4.31654 15.1583 7.0582 16.8916 9.99987 16.8916Z"
      stroke="#868C98"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {!visible && (
      <Path
        d="M3 3L17 17"
        stroke="#868C98"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    )}
  </Svg>
);

const StyledTextInput = (
  props: React.ComponentProps<typeof TextInput> & { isPassword?: boolean }
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isPassword, secureTextEntry, style, ...restProps } = props;

  if (isPassword || secureTextEntry) {
    return (
      <View style={[styles.passwordInputContainer, isFocused && styles.inputFocused]}>
        <TextInput
          underlineColorAndroid="transparent"
          {...restProps}
          secureTextEntry={!showPassword}
          style={[styles.passwordInputField, style]}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword((prev) => !prev)}
          activeOpacity={0.7}
        >
          <EyeIcon visible={showPassword} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TextInput
      underlineColorAndroid="transparent"
      {...props}
      style={[styles.input, isFocused && styles.inputFocused, style]}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
    />
  );
};

const StyledPhoneInput = ({
  value,
  onChangeText,
}: {
  value?: string;
  onChangeText: (text: string) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const phoneInputRef = React.useRef<PhoneInput>(null);

  return (
    <View style={[styles.phoneContainer, isFocused && styles.inputFocused]}>
      <PhoneInput
        ref={phoneInputRef}
        defaultCode="US"
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

  const onSubmit = async (values: SignupFormValues) => {
    try {
      // Bypassing the real API call for local testing / mock flow
      const mockDriverId = "mock-driver-123";
      navigation.navigate("VerificationMethod", { driverId: mockDriverId });

      /* Original API call:
      const { data } = await authService.signUp(values);
      navigation.navigate("VerificationMethod", { driverId: data.driverId });
      */
    } catch (err) {
      // Surface via toast/snackbar in your app's error-handling convention.
      console.warn(err);
    }
  };

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

        <Field label="Full Name" error={errors.fullName?.message}>
          <Controller
            control={control}
            name="fullName"
            render={({ field }) => (
              <StyledTextInput
                placeholder="e.g John Doe"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
        </Field>

        <Field label="Email Address" error={errors.email?.message}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <StyledTextInput
                placeholder="e.g JDoe@gmail.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
        </Field>

        <Field label="Phone Number" error={errors.phone?.message}>
          <Controller
            control={control}
            name="phone"
            render={({ field }) =>
              Platform.OS === "web" ? (
                <StyledTextInput
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
        </Field>

        <Field label="Gender" error={errors.gender?.message}>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              // Swap for your app's Select/ActionSheet component.
              <StyledTextInput
                placeholder="e.g Female"
                value={field.value}
                onChangeText={field.onChange as any}
              />
            )}
          />
        </Field>

        <Field label="Password">
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <StyledTextInput
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
        </Field>
        {password.length > 0 && <PasswordRuleChecklist password={password} />}

        <Field label="Confirm Password" error={errors.confirmPassword?.message}>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <StyledTextInput
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
        </Field>

        <Field label="Referral Code (optional)" error={errors.referralCode?.message}>
          <Controller
            control={control}
            name="referralCode"
            render={({ field }) => (
              <StyledTextInput
                placeholder="e.g WERT283-EDD"
                autoCapitalize="characters"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
        </Field>

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
                {!!field.value && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{" "}
                <Text style={styles.boldText}>Terms of Service</Text> and{" "}
                <Text style={styles.boldText}>Privacy Policy</Text>.
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={[styles.button, (!isValid || isSubmitting) && styles.buttonDisabled]}
          disabled={!isValid || isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[styles.buttonText, (!isValid || isSubmitting) && styles.buttonTextDisabled]}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginRow}
          onPress={() => navigation.navigate("Login")}
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
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 4, flexGrow: 1 },
  title: {
    fontFamily: "DM Sans",
    fontWeight: "900",
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.8,
  },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.sm, marginTop: spacing.smlg },
  field: { marginBottom: spacing.md },
  label: {
    fontFamily: "DM Sans",
    fontWeight: "700",
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
    fontSize: 14,
    lineHeight: 20,
    color: colors.grey,
    flex: 1,
  },
  boldText: {
    fontFamily: "DM Sans",
    fontWeight: "700",
    color: colors.inputTextColor,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    backgroundColor: "#F1F5F9",
  },
  buttonText: {
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonTextDisabled: {
    color: "#CAD5E2",
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
