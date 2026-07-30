import { colors } from "@/theme/colors";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppBottomSheet } from "../../../../components/ui";

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTime: (formattedTime: string) => void;
  initialTime?: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1 < 10 ? `0${i + 1}` : `${i + 1}`));
const MINUTES = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  onClose,
  onSelectTime,
  initialTime,
}) => {
  const [selectedHour, setSelectedHour] = useState("06");
  const [selectedMinute, setSelectedMinute] = useState("28");
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");

  const handleClear = () => {
    setSelectedHour("06");
    setSelectedMinute("00");
    setSelectedPeriod("AM");
  };

  const handleContinue = () => {
    const formatted = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    onSelectTime(formatted);
    onClose();
  };

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title="Choose Time"
      maxHeight="80%"
    >
      <View style={styles.contentContainer}>
        {/* Wheel Selector Container */}
        <View style={styles.pickerContainer}>
          {/* Hours Scroll Column */}
          <View style={styles.columnWrapper}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              snapToInterval={40}
              decelerationRate="fast"
            >
              <View style={{ height: 40 }} />
              {HOURS.map((hr) => {
                const isSelected = hr === selectedHour;
                return (
                  <TouchableOpacity
                    key={hr}
                    style={[styles.itemCell, isSelected && styles.itemCellSelected]}
                    onPress={() => setSelectedHour(hr)}
                  >
                    <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                      {hr}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>

          <Text style={styles.colonSeparator}>:</Text>

          {/* Minutes Scroll Column */}
          <View style={styles.columnWrapper}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              snapToInterval={40}
              decelerationRate="fast"
            >
              <View style={{ height: 40 }} />
              {MINUTES.map((min) => {
                const isSelected = min === selectedMinute;
                return (
                  <TouchableOpacity
                    key={min}
                    style={[styles.itemCell, isSelected && styles.itemCellSelected]}
                    onPress={() => setSelectedMinute(min)}
                  >
                    <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                      {min}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>

          {/* AM / PM Toggle Column */}
          <View style={styles.periodColumn}>
            <TouchableOpacity
              style={[styles.periodCell, selectedPeriod === "AM" && styles.periodCellActive]}
              onPress={() => setSelectedPeriod("AM")}
            >
              <Text style={[styles.periodText, selectedPeriod === "AM" && styles.periodTextActive]}>
                AM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodCell, selectedPeriod === "PM" && styles.periodCellActive]}
              onPress={() => setSelectedPeriod("PM")}
            >
              <Text style={[styles.periodText, selectedPeriod === "PM" && styles.periodTextActive]}>
                PM
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear} activeOpacity={0.7}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.8}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 8,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 160,
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  columnWrapper: {
    height: 140,
    width: 60,
    overflow: "hidden",
  },
  scrollContent: {
    alignItems: "center",
  },
  colonSeparator: {
    fontFamily: "DM Sans Bold",
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginHorizontal: 12,
  },
  itemCell: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  itemCellSelected: {},
  itemText: {
    fontFamily: "DM Sans",
    fontSize: 16.8,
    letterSpacing: -0.36,
    color: colors.grey,
    fontWeight: "400",
  },
  itemTextSelected: {
    fontFamily: "DM Sans",
    fontSize: 19.2,
    letterSpacing: -0.6,
    color: colors.dark,
    fontWeight: "600",
  },
  periodColumn: {
    marginLeft: 24,
    justifyContent: "center",
    gap: 8,
  },
  periodCell: {
    // paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodCellActive: {
    // backgroundColor: "#F1F5F9",
  },
  periodText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15.22,
    letterSpacing: -0.33,
    color: colors.grey,
    fontWeight: "600",
  },
  periodTextActive: {
    color: colors.dark,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  clearBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  clearBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: colors.grey,
  },
  continueBtn: {
    flex: 1,
    backgroundColor: "#375DFB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

