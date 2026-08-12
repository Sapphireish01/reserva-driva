import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ToggleIconItem } from "@/components/ProfileIcons";
import { CheckIcon } from "@/components/ui";
import { colors } from "@/theme/colors";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

interface Step2RecurringFormProps {
  frequency: "Daily" | "Weekly" | "Monthly" | "";
  onSelectFrequency: (freq: "Daily" | "Weekly" | "Monthly") => void;
  isCustomRange: boolean;
  onToggleCustomRange: (val: boolean) => void;
  selectedDays: string[];
  onToggleDaySelection: (day: string) => void;
  endDateFormatted: string;
  onOpenEndDatePicker: () => void;
  isValid: boolean;
  onContinue: () => void;
}

export const Step2RecurringForm: React.FC<Step2RecurringFormProps> = ({
  frequency,
  onSelectFrequency,
  isCustomRange,
  onToggleCustomRange,
  selectedDays,
  onToggleDaySelection,
  endDateFormatted,
  onOpenEndDatePicker,
  isValid,
  onContinue,
}) => {
  return (
    <>
      <Text style={[styles.label, { marginBottom: 12 }]}>Frequency</Text>

      {/* Frequency Options */}
      {(["Daily", "Weekly", "Monthly"] as const).map((freq) => {
        const isSelected = frequency === freq && !isCustomRange;
        return (
          <TouchableOpacity
            key={freq}
            style={[styles.freqCard, isSelected && styles.freqCardSelected]}
            onPress={() => onSelectFrequency(freq)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <CheckIcon size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.freqText}>{freq}</Text>
          </TouchableOpacity>
        );
      })}

      {/* Custom Range Switch */}
      <View style={[styles.toggleRow, { marginTop: 12, justifyContent: "flex-end" }]}>
        <ToggleIconItem
          value={isCustomRange}
          onValueChange={onToggleCustomRange}
        />
        <Text style={styles.toggleLabel}>Custom Range</Text>
      </View>

      {/* Custom Days Pills (when Custom Range ON) */}
      {isCustomRange && (
        <View style={styles.daysGrid}>
          {WEEKDAYS.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayPill, isSelected && styles.dayPillSelected]}
                onPress={() => onToggleDaySelection(day)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <CheckIcon size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.dayPillText}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* End Date */}
      <View style={[styles.fieldGroup, { marginTop: 16 }]}>
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity
          style={styles.pickerField}
          onPress={onOpenEndDatePicker}
          activeOpacity={0.8}
        >
          <Text style={[styles.pickerValue, !endDateFormatted && styles.placeholderText]}>
            {endDateFormatted || "30 Apr 2026"}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#64748B" />
        </TouchableOpacity>
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
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  toggleLabel: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  freqCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  freqCardSelected: {
    borderColor: "#375DFB",
    backgroundColor: "#EFF6FF",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: "#375DFB",
    borderColor: "#375DFB",
  },
  freqText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 12,
  },
  dayPill: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dayPillSelected: {
    borderColor: "#375DFB",
    backgroundColor: "#EFF6FF",
  },
  dayPillText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
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
