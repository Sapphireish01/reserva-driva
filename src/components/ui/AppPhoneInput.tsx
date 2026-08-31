import { colors } from "@/theme/colors";
import { inputTokens } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { CountryCodeItem } from "../../api/services/countries";
import { useCountryCodes } from "../../hooks/useCountryCodes";

const RenderFlag = ({
  flag,
  code,
  size = 20,
  fontSize = 15,
}: {
  flag?: string;
  code: string;
  size?: number;
  fontSize?: number;
}) => {
  const [imageError, setImageError] = useState(false);
  const isUrl = flag && (flag.startsWith("http://") || flag.startsWith("https://"));

  if (isUrl && !imageError) {
    return (
      <Image
        source={{ uri: flag }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <Text style={{ fontSize, textAlign: "center" }}>
      {flag && !isUrl ? flag : getFlagEmoji(code)}
    </Text>
  );
};

export interface AppPhoneInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onCountryCodeChange?: (callingCode: string) => void;
  containerStyle?: ViewStyle;
  inputCardStyle?: ViewStyle;
}

export interface AppPhoneInputRef {
  getCountryCode: () => string;
  getCallingCode: () => string;
  getSelectedCountry: () => CountryCodeItem;
  isValidNumber: (number?: string) => boolean;
}

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const AppPhoneInput = forwardRef<AppPhoneInputRef, AppPhoneInputProps>(
  (
    {
      label,
      error,
      helperText,
      value,
      onChangeText,
      onCountryCodeChange,
      containerStyle,
      inputCardStyle,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const { countries } = useCountryCodes();
    const [selectedCountry, setSelectedCountry] = useState<CountryCodeItem>(
      countries[0] || { name: "United States", code: "US", dialCode: "+1" }
    );

    // Automatically default to the first item in the backend list when loaded
    useEffect(() => {
      if (countries && countries.length > 0) {
        setSelectedCountry(countries[0]);
        if (onCountryCodeChange) {
          onCountryCodeChange((countries[0].dialCode || "+1").replace("+", ""));
        }
      }
    }, [countries]);

    const flagButtonRef = useRef<View>(null);

    useImperativeHandle(ref, () => ({
      getCountryCode: () => selectedCountry.code,
      getCallingCode: () => (selectedCountry.dialCode || "+1").replace("+", ""),
      getSelectedCountry: () => selectedCountry,
      isValidNumber: (num?: string) => {
        const checkNum = num || value || "";
        return checkNum.replace(/[^0-9]/g, "").length >= 7;
      },
    }));

    const handleOpenDropdown = () => {
      flagButtonRef.current?.measureInWindow((x, y, _width, height) => {
        setDropdownPos({
          top: y + height + 6,
          left: Math.max(12, x),
        });
        setDropdownVisible(true);
      });
    };

    const getDisplayValue = (val?: string, dialCode?: string) => {
      if (!val) return "";
      if (dialCode && val.startsWith(dialCode)) {
        return val.slice(dialCode.length);
      }
      return val;
    };

    const handleSelectCountry = (item: CountryCodeItem) => {
      setSelectedCountry(item);
      setDropdownVisible(false);
      const callingCode = (item.dialCode || "+1").replace("+", "");
      if (onCountryCodeChange) {
        onCountryCodeChange(callingCode);
      }
    };

    const handleTextChange = (text: string) => {
      const cleaned = text.replace(/[^0-9]/g, "");
      if (onChangeText) {
        onChangeText(cleaned);
      }
    };

    const displayValue = getDisplayValue(value, selectedCountry.dialCode);

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

          {/* Left Dial Code Button */}
          <TouchableOpacity
            ref={flagButtonRef}
            style={styles.phoneFlagButton}
            activeOpacity={0.7}
            onPress={handleOpenDropdown}
          >
            <View style={styles.circularFlagWrapper}>
              <RenderFlag
                flag={selectedCountry.flag}
                code={selectedCountry.code}
                size={22}
                fontSize={15}
              />
            </View>
            <Text style={styles.phoneCodeText}>
              {selectedCountry.dialCode || "+1"}
            </Text>
            <Ionicons
              name={dropdownVisible ? "chevron-up" : "chevron-down"}
              size={14}
              color={colors.text}
              style={{ marginLeft: 2 }}
            />
          </TouchableOpacity>

          {/* Right Phone Number Input */}
          <View style={styles.phoneTextContainer}>
            <TextInput
              style={styles.phoneTextInput}
              placeholder="(555) 000-0000"
              placeholderTextColor={inputTokens.placeholderColor}
              underlineColorAndroid="transparent"
              keyboardType="number-pad"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={displayValue}
              onChangeText={handleTextChange}
            />
          </View>
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : helperText ? (
          <Text style={styles.helperText}>{helperText}</Text>
        ) : null}

        {/* Custom Anchored Dropdown Popover Modal */}
        <Modal
          visible={dropdownVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.dropdownCard,
                    {
                      top: dropdownPos.top,
                      left: dropdownPos.left,
                    },
                  ]}
                >
                  <ScrollView
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={styles.dropdownListContent}
                  >
                    {countries.map((item, index) => {
                      const isSelected =
                        item.code.toUpperCase() === selectedCountry.code.toUpperCase();
                      return (
                        <TouchableOpacity
                          key={`${item.code}-${index}`}
                          style={[
                            styles.countryItemRow,
                            isSelected && styles.countryItemRowSelected,
                          ]}
                          activeOpacity={0.7}
                          onPress={() => handleSelectCountry(item)}
                        >
                          <View style={styles.circularFlagWrapperSmall}>
                            <RenderFlag
                              flag={item.flag}
                              code={item.code}
                              size={20}
                              fontSize={13}
                            />
                          </View>
                          <Text style={styles.dialCodeText}>{item.dialCode}</Text>
                          <Text style={styles.isoCodeText}>{item.code}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
    flexDirection: "row",
    alignItems: "center",
  },
  focusedCard: {
    // borderColor: inputTokens.focusedBorderColor,
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
  phoneFlagButton: {
    height: "100%",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRightWidth: 1,
    borderRightColor: inputTokens.borderColor,
    backgroundColor: "transparent",
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
  flagEmoji: {
    fontSize: 15,
    textAlign: "center",
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
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  phoneTextInput: {
    fontFamily: "DM Sans",
    fontSize: 16,
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
  // Modal Popover Styles
  modalOverlay: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.15)",
  },
  dropdownCard: {
    position: "absolute",
    width: 150,
    maxHeight: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  dropdownListContent: {
    paddingVertical: 4,
  },
  countryItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    justifyContent: "space-between",
  },
  countryItemRowSelected: {
    backgroundColor: "#F1F5F9",
  },
  circularFlagWrapperSmall: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  flagEmojiSmall: {
    fontSize: 13,
    textAlign: "center",
  },
  dialCodeText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    fontWeight: "600",
    color: inputTokens.textColor || "#0F172A",
  },
  isoCodeText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
});
