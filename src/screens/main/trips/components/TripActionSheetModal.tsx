import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "../../../../theme/colors";

interface TripActionSheetModalProps {
  visible: boolean;
  onClose: () => void;
  trip: any;
  onViewDetails: () => void;
  onStartTrip: () => void;
  onEditTrip: () => void;
  onTogglePause: () => void;
  onCancelTrip: () => void;
}

export const TripActionSheetModal: React.FC<TripActionSheetModalProps> = ({
  visible,
  onClose,
  trip,
  onViewDetails,
  onStartTrip,
  onEditTrip,
  onTogglePause,
  onCancelTrip,
}) => {
  const insets = useSafeAreaInsets();

  if (!trip) return null;

  const isPaused = trip.isPaused;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Trip Details</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Action List */}
          <View style={styles.actionList}>
            {/* View Trip Details */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                onClose();
                onViewDetails();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>View Trip Details</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Start Trip */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                onClose();
                onStartTrip();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>Start Trip</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Edit Trip */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                onClose();
                onEditTrip();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>Edit Trip</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Pause / Unpause Trip */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                onClose();
                onTogglePause();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>{isPaused ? "Unpause Trip" : "Pause Trip"}</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Cancel Trip */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                onClose();
                onCancelTrip();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>Cancel Trip</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  actionList: {
    gap: 10,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
  },
});
