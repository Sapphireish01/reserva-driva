import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { buttonTokens } from "../../theme/tokens";

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
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

  const isDisabled = disabled || loading;

  const buttonStyle: ViewStyle = {
    height: sizeConfig.height,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    borderRadius: sizeConfig.borderRadius,
    backgroundColor: isDisabled
      ? variantConfig.disabledBg
      : variantConfig.backgroundColor,
    borderWidth: variant === "outline" ? 1 : 0,
    borderColor: isDisabled ? variantConfig.disabledText : variantConfig.borderColor,
    alignSelf: fullWidth ? "stretch" : "auto",
  };

  const labelStyle: TextStyle = {
    fontSize: sizeConfig.fontSize,
    fontFamily: "DM Sans Bold",
    fontWeight: "700",
    color: isDisabled ? variantConfig.disabledText : variantConfig.textColor,
  };

  return (
    <TouchableOpacity
      style={[styles.baseButton, buttonStyle, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={activeOpacity}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isDisabled ? variantConfig.disabledText : variantConfig.textColor}
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[labelStyle, textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
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
