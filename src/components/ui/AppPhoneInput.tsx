import { colors } from "@/theme/colors";
import { inputTokens } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { useCountryCodes } from "../../hooks/useCountryCodes";

export interface AppPhoneInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  containerStyle?: ViewStyle;
  inputCardStyle?: ViewStyle;
}

export const AppPhoneInput = forwardRef<PhoneInput, AppPhoneInputProps>(
  (
    {
      label,
      error,
      helperText,
      value,
      onChangeText,
      containerStyle,
      inputCardStyle,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const internalRef = useRef<PhoneInput>(null);
    const phoneInputRef = (ref as React.RefObject<PhoneInput>) || internalRef;
    const { countryCodesList, defaultCountryCode } = useCountryCodes();

    // Strip country dial code prefix if present so the input box only carries digits
    const displayValue = value ? value.replace(/^\+\d{1,4}\s?/, "") : undefined;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View
          style={[
            styles.inputCard,
            inputCardStyle,
            isFocused && styles.focusedCard,
            !!error && styles.errorCard,
          ]}
        >
          {isFocused && (
            <View
              style={[
                styles.innerFocusedBorder,
                {
                  borderRadius:
                    ((StyleSheet.flatten(inputCardStyle)?.borderRadius as number) ||
                      inputTokens.borderRadius) - 1,
                },
              ]}
              pointerEvents="none"
            />
          )}
          <PhoneInput
            ref={phoneInputRef}
            defaultCode={defaultCountryCode}
            countryPickerProps={{
              countryCodes: countryCodesList,
              withEmoji: false,
              renderFlagButton: (flagProps: { children?: React.ReactNode }) => (
                <View style={styles.circularFlagWrapper}>
                  {flagProps.children}
                </View>
              ),
            }}

            layout="second"
            onChangeText={onChangeText}
            withShadow={false}
            withDarkTheme={false}
            containerStyle={styles.phoneInnerContainer}
            textContainerStyle={styles.phoneTextContainer}
            textInputStyle={styles.phoneTextInput}
            codeTextStyle={styles.phoneCodeText}
            flagButtonStyle={styles.phoneFlagButton}
            renderDropdownImage={
              <Ionicons
                name="chevron-down"
                size={14}
                color={colors.text}
                style={{ marginLeft: 2 }}
              />
            }
            textInputProps={{
              placeholder: "(555) 000-0000",
              placeholderTextColor: inputTokens.placeholderColor,
              underlineColorAndroid: "transparent",
              onFocus: () => setIsFocused(true),
              onBlur: () => setIsFocused(false),
              value: displayValue,
            }}
          />
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

AppPhoneInput.displayName = "AppPhoneInput";

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 6,
  },
  inputCard: {
    height: inputTokens.height,
    borderWidth: inputTokens.borderWidth,
    borderColor: inputTokens.borderColor,
    borderRadius: inputTokens.borderRadius,
    backgroundColor: inputTokens.backgroundColor,
    overflow: "hidden",
  },
  focusedCard: {
    borderColor: inputTokens.focusedBorderColor,
  },
  innerFocusedBorder: {
    position: "absolute",
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderWidth: 1.5,
    borderColor: "#000000",
    zIndex: 10,
  },
  errorCard: {
    borderColor: inputTokens.errorBorderColor,
  },
  phoneInnerContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  phoneFlagButton: {
    height: "100%",
    paddingHorizontal: 12,
    backgroundColor: "transparent",
    borderRightWidth: 1,
    borderRightColor: inputTokens.borderColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  circularFlagWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  phoneCodeText: {
    fontFamily: "DM Sans",
    fontSize: 15,
    fontWeight: "500",
    color: inputTokens.textColor,
    marginLeft: 2,
  },
  phoneTextContainer: {
    flex: 1,
    height: "100%",
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  phoneTextInput: {
    fontFamily: "DM Sans",
    fontSize: 15,
    fontWeight: "500",
    color: inputTokens.textColor,
    height: "100%",
    paddingVertical: 0,
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
