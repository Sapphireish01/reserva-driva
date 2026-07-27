import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { buttonTokens } from "../../theme/tokens";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface TrailingTailSpinnerProps {
  size?: number;
  color?: string;
}

export const TrailingTailSpinner: React.FC<TrailingTailSpinnerProps> = ({
  size = 18,
  color = "#FFFFFF",
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 750,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const strokeWidth = 2.2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <AnimatedSvg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: [{ rotate: spin }] }}
    >
      <Defs>
        <LinearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="45%" stopColor={color} stopOpacity="0.6" />
          <Stop offset="85%" stopColor={color} stopOpacity="0.15" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#tailGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${circumference * 0.78} ${circumference * 0.22}`}
      />
    </AnimatedSvg>
  );
};

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
    fontWeight: "700",
    color: isInteractiveDisabled ? variantConfig.disabledText : variantConfig.textColor,
  };

  let displayTitle = title;
  if (success) {
    displayTitle = successTitle || title;
  } else if (loading) {
    displayTitle = loadingTitle || title;
  }

  let effectiveRightIcon = rightIcon;
  if (success) {
    effectiveRightIcon = <Ionicons name="checkmark-circle" size={18} color="#22C55E" />;
  } else if (loading) {
    effectiveRightIcon = (
      <TrailingTailSpinner
        size={18}
        color={isInteractiveDisabled ? variantConfig.disabledText : variantConfig.textColor}
      />
    );
  }

  return (
    <TouchableOpacity
      style={[styles.baseButton, buttonStyle, style]}
      onPress={onPress}
      disabled={isButtonDisabled}
      activeOpacity={activeOpacity}
    >
      <View style={styles.contentRow}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <Text style={[labelStyle, textStyle]}>{displayTitle}</Text>
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
