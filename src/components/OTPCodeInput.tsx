import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { colors, typography } from "../theme/colors";

const CELL_COUNT = 6;

interface Props {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
}

export const OTPCodeInput = ({ value, onChange, onComplete }: Props) => {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [fieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: (next) => {
      onChange(next);
      if (next.length === CELL_COUNT) onComplete?.(next);
    },
  });

  return (
    <CodeField
      ref={ref}
      {...fieldProps}
      value={value}
      onChangeText={onChange}
      cellCount={CELL_COUNT}
      rootStyle={styles.root}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => (
        <View
          key={index}
          onLayout={getCellOnLayoutHandler(index)}
          style={[styles.cell, isFocused && styles.cellFocused]}
        >
          <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  root: { justifyContent: "space-between" },
  cell: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cellFocused: { borderColor: colors.primary },
  cellText: { ...typography.h2, color: colors.text },
});
