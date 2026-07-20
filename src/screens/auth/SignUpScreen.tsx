import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Switch,
  Platform,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import PhoneInput from "react-native-phone-number-input";
import { AuthStackParamList } from "../../navigation/types";
import { signupSchema, SignupFormValues } from "../../schemas/signup";
import { authService } from "../../api/services/auth";
import { PasswordRuleChecklist } from "../../components/PasswordRuleChecklist";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

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
      const { data } = await authService.signUp(values);
      navigation.navigate("VerificationMethod", { driverId: data.driverId });
    } catch (err) {
      // Surface via toast/snackbar in your app's error-handling convention.
      console.warn(err);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Make Every Mile Count</Text>

      <Field label="Full Name" error={errors.fullName?.message}>
        <Controller
          control={control}
          name="fullName"
          render={({ field }) => (
            <TextInput
              style={styles.input}
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
            <TextInput
              style={styles.input}
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
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
                value={field.value}
                onChangeText={field.onChange}
              />
            ) : (
              <PhoneInput
                defaultCode="US"
                layout="first"
                onChangeFormattedText={field.onChange}
                containerStyle={styles.phoneContainer}
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
            <TextInput
              style={styles.input}
              placeholder="e.g Female"
              value={field.value}
              onChangeText={field.onChange as any}
            />
          )}
        />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextInput
              style={styles.input}
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
      </Field>
      <PasswordRuleChecklist password={password} />

      <Field label="Confirm Password" error={errors.confirmPassword?.message}>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <TextInput
              style={styles.input}
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
            <TextInput
              style={styles.input}
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
            <Switch value={!!field.value} onValueChange={field.onChange} />
            <Text style={styles.termsText}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        disabled={!isValid || isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>{isSubmitting ? "Creating..." : "Create Account"}</Text>
      </TouchableOpacity>
    </ScrollView>
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
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  title: { ...typography.h1 },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
  field: { marginBottom: spacing.md },
  label: { ...typography.caption, marginBottom: spacing.xs, color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  phoneContainer: { width: "100%", borderRadius: 8 },
  error: { ...typography.caption, color: colors.error, marginTop: spacing.xs },
  termsRow: { flexDirection: "row", alignItems: "center", marginVertical: spacing.md, gap: spacing.sm },
  termsText: { ...typography.caption, color: colors.textMuted, flex: 1 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: colors.primaryDisabled },
  buttonText: { color: "#fff", fontWeight: "600" },
});
