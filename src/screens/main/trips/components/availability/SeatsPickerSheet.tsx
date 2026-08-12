import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CheckIcon } from "@/components/ui";

const SEAT_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface SeatsPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedSeat: string;
  onSelectSeat: (seatNum: string) => void;
  insetsBottom: number;
}

export const SeatsPickerSheet: React.FC<SeatsPickerSheetProps> = ({
  visible,
  onClose,
  selectedSeat,
  onSelectSeat,
  insetsBottom,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.inlineOverlay}>
      <TouchableOpacity
        style={styles.inlineBackdrop}
        onPress={onClose}
        activeOpacity={1}
      />
      <View style={[styles.inlineSheetCard, { paddingBottom: Math.max(insetsBottom, 20) }]}>
        <View style={styles.dragPill} />
        <View style={styles.inlineHeader}>
          <Text style={styles.inlineTitle}>Select Available Seats</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 280 }}>
          {SEAT_OPTIONS.map((seatNum) => {
            const isSelected = selectedSeat === seatNum;
            return (
              <TouchableOpacity
                key={seatNum}
                style={[styles.seatOptionItem, isSelected && styles.seatOptionItemSelected]}
                onPress={() => onSelectSeat(seatNum)}
                activeOpacity={0.7}
              >
                <Text style={[styles.seatOptionText, isSelected && styles.seatOptionTextSelected]}>
                  {seatNum} {seatNum === "1" ? "seat" : "seats"}
                </Text>
                {isSelected && <CheckIcon size={16} color="#375DFB" />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 100,
  },
  inlineBackdrop: {
    flex: 1,
  },
  inlineSheetCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  dragPill: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 12,
  },
  inlineHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inlineTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  seatOptionItem: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
  },
  seatOptionItemSelected: {
    backgroundColor: "#EFF6FF",
  },
  seatOptionText: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: "#0F172A",
  },
  seatOptionTextSelected: {
    fontFamily: "DM Sans Bold",
    fontWeight: "700",
    color: "#375DFB",
  },
});
