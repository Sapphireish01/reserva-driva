import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { inputTokens } from "../../theme/tokens";

export interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isPassword = false,
      containerStyle,
      onFocus,
      onBlur,
      secureTextEntry,
      autoFocus = false,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const isSecure = isPassword ? !showPassword : secureTextEntry;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View
          style={[
            styles.inputCard,
            isFocused && styles.focusedCard,
            !!error && styles.errorCard,
          ]}
        >
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={styles.inputField}
            placeholderTextColor={inputTokens.placeholderColor}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isSecure}
            autoFocus={autoFocus}
            {...props}
          />
          {isPassword ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowPassword((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#64748B"
              />
            </TouchableOpacity>
          ) : (
            rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>
          )}
        </View>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : helperText ? (
          <Text style={styles.helperText}>{helperText}</Text>
        ) : null}
      </View>
    );
  }
);

AppTextInput.displayName = "AppTextInput";

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "700",
    color: inputTokens.labelColor,
    marginBottom: 6,
  },
  inputCard: {
    height: inputTokens.height,
    borderWidth: inputTokens.borderWidth,
    borderColor: inputTokens.borderColor,
    borderRadius: inputTokens.borderRadius,
    backgroundColor: inputTokens.backgroundColor,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  focusedCard: {
    // borderColor: inputTokens.focusedBorderColor,
  },
  errorCard: {
    borderColor: inputTokens.errorBorderColor,
  },
  inputField: {
    flex: 1,
    fontFamily: "DM Sans",
    fontSize: 15,
    color: inputTokens.textColor,
    height: "100%",
    fontWeight: "700",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  errorText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: inputTokens.errorBorderColor,
    marginTop: 4,
  },
  helperText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
});
