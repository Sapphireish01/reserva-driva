import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/theme/colors";

interface Step3SeatsPriceFormProps {
  availableSeats: string;
  onOpenSeatsPicker: () => void;
  price: string;
  onChangePrice: (val: string) => void;
  isValid: boolean;
  onContinue: () => void;
}

export const Step3SeatsPriceForm: React.FC<Step3SeatsPriceFormProps> = ({
  availableSeats,
  onOpenSeatsPicker,
  price,
  onChangePrice,
  isValid,
  onContinue,
}) => {
  return (
    <>
      {/* Available Seats Dropdown */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Available Seats</Text>
        <TouchableOpacity
          style={styles.pickerField}
          onPress={onOpenSeatsPicker}
          activeOpacity={0.8}
        >
          <Text style={[styles.pickerValue, !availableSeats && styles.placeholderText]}>
            {availableSeats ? `${availableSeats}` : "e.g 2"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Price (per seat) */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Price (per seat)</Text>
        <View style={styles.priceInputCard}>
          <Text style={styles.priceCurrencySymbol}>$</Text>
          <TextInput
            style={styles.priceTextInput}
            placeholder="0.00"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
            value={price}
            onChangeText={onChangePrice}
          />
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.continueBtn, !isValid && styles.continueBtnDisabled]}
        disabled={!isValid}
        onPress={onContinue}
        activeOpacity={0.8}
      >
        <Text style={[styles.continueBtnText, !isValid && styles.continueBtnTextDisabled]}>
          Continue
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    fontWeight: "500",
    color: colors.dark,
    marginBottom: 6,
  },
  pickerField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerValue: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
  },
  placeholderText: {
    color: "#94A3B8",
  },
  priceInputCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  priceCurrencySymbol: {
    fontFamily: "DM Sans",
    fontSize: 16,
    color: "#64748B",
    marginRight: 8,
  },
  priceTextInput: {
    flex: 1,
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    height: "100%",
  },
  continueBtn: {
    backgroundColor: "#375DFB",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  continueBtnDisabled: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  continueBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  continueBtnTextDisabled: {
    color: "#94A3B8",
  },
});
