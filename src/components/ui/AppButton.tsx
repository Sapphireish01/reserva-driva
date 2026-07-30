import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { buttonTokens } from "../../theme/tokens";
import { AppLoader, CheckIcon } from "./AppLoader";

interface TrailingTailSpinnerProps {
  size?: number;
  color?: string;
}

export const TrailingTailSpinner: React.FC<TrailingTailSpinnerProps> = ({
  size = 18,
  color = "#FFFFFF",
}) => <AppLoader size={size} color={color} />;

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingTitle?: string;
  success?: boolean;
  successTitle?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeOpacity?: number;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  loadingTitle,
  success = false,
  successTitle,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  style,
  textStyle,
  activeOpacity = 0.8,
}) => {
  const sizeConfig = buttonTokens.sizes[size];
  const variantConfig = buttonTokens.variants[variant];

  const isInteractiveDisabled = disabled && !loading && !success;
  const isButtonDisabled = disabled || loading || success;

  const buttonStyle: ViewStyle = {
    height: sizeConfig.height,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    borderRadius: sizeConfig.borderRadius,
    backgroundColor: isInteractiveDisabled
      ? variantConfig.disabledBg
      : variantConfig.backgroundColor,
    borderWidth: variant === "outline" ? 1 : 0,
    borderColor: isInteractiveDisabled ? variantConfig.disabledText : variantConfig.borderColor,
    alignSelf: fullWidth ? "stretch" : "auto",
  };

  const labelStyle: TextStyle = {
    fontSize: sizeConfig.fontSize,
    fontFamily: "DM Sans Bold",
    fontWeight: "500",
    color: isInteractiveDisabled ? variantConfig.disabledText : variantConfig.textColor,
  };

  const disabledStyle: ViewStyle = isInteractiveDisabled
    ? {
        backgroundColor: variantConfig.disabledBg,
        borderColor: variant === "outline" ? variantConfig.disabledText : "transparent",
      }
    : {};

  const disabledTextStyle: TextStyle = isInteractiveDisabled
    ? {
        color: variantConfig.disabledText,
      }
    : {};

  let displayTitle = title;
  if (success) {
    displayTitle = successTitle || title;
  } else if (loading) {
    displayTitle = loadingTitle || title;
  }

  let effectiveRightIcon = rightIcon;
  if (success) {
    effectiveRightIcon = <CheckIcon size={18} />;
  } else if (loading) {
    effectiveRightIcon = (
      <AppLoader
        size={18}
        color={isInteractiveDisabled ? variantConfig.disabledText : variantConfig.textColor}
      />
    );
  }

  return (
    <TouchableOpacity
      style={[styles.baseButton, buttonStyle, style, disabledStyle]}
      onPress={onPress}
      disabled={isButtonDisabled}
      activeOpacity={activeOpacity}
    >
      <View style={styles.contentRow}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <Text style={[labelStyle, textStyle, disabledTextStyle]}>{displayTitle}</Text>
        {effectiveRightIcon && <View style={styles.iconRight}>{effectiveRightIcon}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
