import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAddTripStopMutation } from "../../../../hooks/useDriverTrips";
import { colors, palette, spacing } from "../../../../theme/colors";

interface AddTripStopModalProps {
  visible: boolean;
  onClose: () => void;
  tripId: number | string;
}

export const AddTripStopModal: React.FC<AddTripStopModalProps> = ({
  visible,
  onClose,
  tripId,
}) => {
  const insets = useSafeAreaInsets();
  const [stopType, setStopType] = useState<"pickup" | "dropoff">("pickup");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const addStopMutation = useAddTripStopMutation();

  const handleClose = () => {
    setName("");
    setErrorMessage("");
    setStopType("pickup");
    onClose();
  };

  const handleAddStop = async () => {
    if (!name.trim()) {
      setErrorMessage("Please enter the stop location name.");
      return;
    }
    setErrorMessage("");

    try {
      await addStopMutation.mutateAsync({
        trip_id: tripId,
        stop_type: stopType,
        name: name.trim(),
      });
      handleClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add route stop. Please try again.";
      setErrorMessage(msg);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          style={styles.backdrop}
          onPress={handleClose}
          activeOpacity={1}
        />
        <View
          style={[
            styles.sheetContainer,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Route Stop</Text>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Stop Type Selector */}
          <Text style={styles.inputLabel}>Stop Type</Text>
          <View style={styles.typeSelectorRow}>
            <TouchableOpacity
              style={[
                styles.typePill,
                stopType === "pickup" && styles.typePillActive,
              ]}
              onPress={() => setStopType("pickup")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.typeDot,
                  stopType === "pickup" && styles.typeDotActive,
                ]}
              />
              <Text
                style={[
                  styles.typePillText,
                  stopType === "pickup" && styles.typePillTextActive,
                ]}
              >
                Pickup Point
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typePill,
                stopType === "dropoff" && styles.typePillActive,
              ]}
              onPress={() => setStopType("dropoff")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.typeDot,
                  { backgroundColor: "#EF4444" },
                  stopType === "dropoff" && styles.typeDotActive,
                ]}
              />
              <Text
                style={[
                  styles.typePillText,
                  stopType === "dropoff" && styles.typePillTextActive,
                ]}
              >
                Dropoff Point
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stop Name / Location Input */}
          <Text style={styles.inputLabel}>Location Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 7 & 8 Junction, Ikeja"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={(val) => {
              setName(val);
              if (errorMessage) setErrorMessage("");
            }}
          />

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!name.trim() || addStopMutation.isPending) &&
                styles.submitBtnDisabled,
            ]}
            onPress={handleAddStop}
            disabled={!name.trim() || addStopMutation.isPending}
            activeOpacity={0.8}
          >
            {addStopMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Add Stop</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  errorText: {
    fontFamily: "DM Sans",
    color: colors.error,
    fontSize: 13,
  },
  inputLabel: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  typeSelectorRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  typePill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  typePillActive: {
    borderColor: colors.primary,
    backgroundColor: "#EFF6FF",
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  typeDotActive: {
    transform: [{ scale: 1.2 }],
  },
  typePillText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  typePillTextActive: {
    fontFamily: "DM Sans Bold",
    fontWeight: "600",
    color: colors.primary,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: "DM Sans",
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    backgroundColor: palette.slate[300],
  },
  submitBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
