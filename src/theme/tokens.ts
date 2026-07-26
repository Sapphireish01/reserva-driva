import { colors, palette } from "./colors";

export const buttonTokens = {
  sizes: {
    sm: {
      height: 38,
      paddingHorizontal: 16,
      borderRadius: 10,
      fontSize: 13,
    },
    md: {
      height: 48,
      paddingHorizontal: 20,
      borderRadius: 12,
      fontSize: 15,
    },
    lg: {
      height: 54,
      paddingHorizontal: 24,
      borderRadius: 12,
      fontSize: 16,
    },
  },
  variants: {
    primary: {
      backgroundColor: colors.primary,
      textColor: palette.neutral[0],
      borderColor: "transparent",
      disabledBg: "#F6F8FA",
      disabledText: "#CDD0D5",
    },
    secondary: {
      backgroundColor: "#CDD0D5",
      textColor: palette.slate[900],
      borderColor: "transparent",
      disabledBg: palette.slate[100],
      disabledText: palette.slate[400],
    },
    outline: {
      backgroundColor: "transparent",
      textColor: colors.primary,
      borderColor: colors.primary,
      disabledBg: "transparent",
      disabledText: palette.slate[300],
    },
    ghost: {
      backgroundColor: "transparent",
      textColor: palette.slate[700],
      borderColor: "transparent",
      disabledBg: "transparent",
      disabledText: palette.slate[300],
    },
    destructive: {
      backgroundColor: palette.error[600],
      textColor: palette.neutral[0],
      borderColor: "transparent",
      disabledBg: palette.error[200],
      disabledText: palette.error[400],
    },
  },
};

export const inputTokens = {
  height: 50,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.border,
  focusedBorderColor: colors.primary,
  errorBorderColor: colors.error,
  backgroundColor: palette.neutral[0],
  placeholderColor: palette.slate[400],
  textColor: palette.slate[900],
  labelColor: palette.slate[700],
};

export const modalTokens = {
  backdropColor: "rgba(15, 23, 42, 0.5)",
  borderRadius: 24,
  dragIndicatorColor: palette.slate[300],
  backgroundColor: palette.neutral[0],
};
