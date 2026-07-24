import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { MainStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "TwoFactorAuth">;

const ShieldIcon = () => (
  <View style={styles.shieldBg}>
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="#475569"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8a2 2 0 100 4 2 2 0 000-4zm0 4v3"
        stroke="#475569"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </View>
);

export const TwoFactorAuthScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  // 2FA Enabled State
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // PIN Setup Modal States
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinStep, setPinStep] = useState<"create" | "confirm">("create");
  const [createPin, setCreatePin] = useState(["", "", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""]);
  const [focusedIdx, setFocusedIdx] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnabledSuccess, setIsEnabledSuccess] = useState(false);
  const pinInputs = useRef<Array<TextInput | null>>([]);

  // Turn Off Confirmation Modal State
  const [showTurnOffModal, setShowTurnOffModal] = useState(false);

  const handleToggle2FA = (val: boolean) => {
    if (val) {
      // Start setup
      setPinStep("create");
      setCreatePin(["", "", "", "", "", ""]);
      setConfirmPin(["", "", "", "", "", ""]);
      setIsEnabledSuccess(false);
      setShowPinModal(true);
    } else {
      setShowTurnOffModal(true);
    }
  };

  const handlePinChange = (text: string, index: number) => {
    const activePin = pinStep === "create" ? [...createPin] : [...confirmPin];
    activePin[index] = text;
    if (pinStep === "create") {
      setCreatePin(activePin);
    } else {
      setConfirmPin(activePin);
    }

    if (text && index < 5) {
      pinInputs.current[index + 1]?.focus();
    }
  };

  const isCurrentPinComplete = (pinStep === "create" ? createPin : confirmPin).every(
    (d) => d.length > 0
  );

  const handleContinuePin = () => {
    if (!isCurrentPinComplete) return;
    if (pinStep === "create") {
      setPinStep("confirm");
      setFocusedIdx(0);
    } else {
      // Submit & Enable
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsEnabledSuccess(true);
        setTimeout(() => {
          setIs2FAEnabled(true);
          setShowPinModal(false);
        }, 1000);
      }, 1200);
    }
  };

  const handleConfirmTurnOff = () => {
    setIs2FAEnabled(false);
    setShowTurnOffModal(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Two-Factor Authentication</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Shield Icon */}
        <View style={styles.iconContainer}>
          <ShieldIcon />
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          {is2FAEnabled
            ? "Two factor authentication is on. You'll need to enter your PIN if you register your current number again."
            : "Create a PIN for extra security, use the PIN to access your account"}
        </Text>

        {/* Toggle Switch Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{is2FAEnabled ? "Turn off" : "Turn on"}</Text>
          <Switch
            value={is2FAEnabled}
            onValueChange={handleToggle2FA}
            trackColor={{ false: "#E2E8F0", true: "#0F172A" }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Change PIN option when enabled */}
        {is2FAEnabled && (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setPinStep("create");
              setCreatePin(["", "", "", "", "", ""]);
              setConfirmPin(["", "", "", "", "", ""]);
              setIsEnabledSuccess(false);
              setShowPinModal(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.cardLabel}>Change PIN</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* 1. PIN Setup / Confirmation Modal */}
      <Modal visible={showPinModal} animationType="slide">
        <View style={[styles.pinModalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPinModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Two-Factor Authentication</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.pinModalBody}>
            <Text style={styles.pinSubtitle}>
              {pinStep === "create" ? "Create a six digit PIN" : "Confirm PIN"}
            </Text>

            <View style={styles.pinRow}>
              {(pinStep === "create" ? createPin : confirmPin).map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => {
                    pinInputs.current[idx] = ref;
                  }}
                  style={[styles.pinBox, focusedIdx === idx && styles.pinBoxFocused]}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry
                  value={digit}
                  onChangeText={(t) => handlePinChange(t, idx)}
                  onFocus={() => setFocusedIdx(idx)}
                  selectTextOnFocus
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.continueBtn,
                !isCurrentPinComplete && styles.continueBtnDisabled,
                isEnabledSuccess && styles.continueBtnSuccess,
              ]}
              disabled={!isCurrentPinComplete || isSubmitting}
              onPress={handleContinuePin}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : isEnabledSuccess ? (
                <View style={styles.successRow}>
                  <Text style={styles.continueBtnText}>Enabled</Text>
                  <Ionicons name="checkmark-circle" size={18} color="#22C55E" style={{ marginLeft: 6 }} />
                </View>
              ) : (
                <Text
                  style={[
                    styles.continueBtnText,
                    !isCurrentPinComplete && styles.continueBtnTextDisabled,
                  ]}
                >
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. Turn Off 2FA Confirmation Modal */}
      <Modal visible={showTurnOffModal} transparent animationType="fade">
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>Turn Off Two-Factor Authentication?</Text>
              <TouchableOpacity onPress={() => setShowTurnOffModal(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.dialogSubtitle}>
              Are you sure you want to turn off two factor authentication
            </Text>

            <TouchableOpacity style={styles.redBtn} onPress={handleConfirmTurnOff} activeOpacity={0.8}>
              <Text style={styles.redBtnText}>Turn Off</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => setShowTurnOffModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.outlineBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  shieldBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginBottom: spacing.md,
    backgroundColor: "#FFFFFF",
  },
  cardLabel: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  /* PIN Modal Styles */
  pinModalContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalHeaderTitle: { fontFamily: "DM Sans Bold", fontSize: 16, fontWeight: "700", color: "#0F172A" },
  modalCancelText: { fontFamily: "DM Sans", fontSize: 15, color: "#94A3B8" },
  pinModalBody: { padding: spacing.lg, alignItems: "center" },
  pinSubtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  pinRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: spacing.xl,
  },
  pinBox: {
    width: 46,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    textAlign: "center",
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    color: "#0F172A",
  },
  pinBoxFocused: { borderColor: "#0F172A" },
  continueBtn: {
    width: "100%",
    backgroundColor: "#375DFB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnDisabled: {
    backgroundColor: "#F8FAFC",
  },
  continueBtnSuccess: {
    backgroundColor: "#375DFB",
  },
  successRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  continueBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  continueBtnTextDisabled: {
    color: "#CBD5E1",
  },

  /* Dialog Overlay Styles */
  dialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  dialogCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: spacing.lg,
  },
  dialogHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  dialogTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  dialogSubtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", marginBottom: spacing.lg },
  redBtn: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  redBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  outlineBtn: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  outlineBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "600", color: "#475569" },
});
