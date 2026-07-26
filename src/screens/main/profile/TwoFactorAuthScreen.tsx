import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { ToggleIconItem } from "../../../components/ProfileIcons";
import {
  AppBottomSheet,
  AppButton,
  OTPForm,
} from "../../../components/ui";
import { MainStackParamList } from "../../../navigation/types";
import { colors, spacing } from "../../../theme/colors";

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

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinStep, setPinStep] = useState<"create" | "confirm">("create");
  const [firstCode, setFirstCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTurnOffModal, setShowTurnOffModal] = useState(false);

  const handleToggle2FA = (val: boolean) => {
    if (val) {
      setPinStep("create");
      setFirstCode("");
      setShowPinModal(true);
    } else {
      setShowTurnOffModal(true);
    }
  };

  const handlePinComplete = (code: string) => {
    if (pinStep === "create") {
      setFirstCode(code);
      setPinStep("confirm");
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIs2FAEnabled(true);
        setShowPinModal(false);
      }, 1000);
    }
  };

  const confirmTurnOff = () => {
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
        <View style={styles.heroSection}>
          <ShieldIcon />
          <Text style={styles.heroTitle}>Two-Factor Authentication</Text>
          <Text style={styles.heroSubtitle}>
            Enhance your account security by requiring a six-digit PIN code during sensitive actions.
          </Text>
        </View>

        {/* Toggle Row */}
        <View style={styles.toggleCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Enable 2FA Authentication</Text>
            <Text style={styles.toggleSubtitle}>
              {is2FAEnabled ? "Protection is currently active" : "Protect your account from unauthorized access"}
            </Text>
          </View>

          <ToggleIconItem value={is2FAEnabled} onValueChange={handleToggle2FA} />
        </View>
      </ScrollView>

      {/* PIN Setup Bottom Sheet */}
      <AppBottomSheet
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        title={pinStep === "create" ? "Create 6-Digit PIN" : "Confirm 6-Digit PIN"}
      >
        <Text style={styles.sheetSubtitle}>
          {pinStep === "create" ? "Choose a security PIN code" : "Re-enter your 6-digit PIN to confirm"}
        </Text>

        <OTPForm
          onComplete={handlePinComplete}
          loading={isSubmitting}
          autoFocus={true}
        />
      </AppBottomSheet>

      {/* Turn Off 2FA Bottom Sheet */}
      <AppBottomSheet
        visible={showTurnOffModal}
        onClose={() => setShowTurnOffModal(false)}
        title="Turn Off 2FA?"
      >
        <Text style={styles.sheetSubtitle}>
          Disabling two-factor authentication will lower your account security.
        </Text>
        <View style={styles.deleteActionRow}>
          <AppButton
            title="Keep Enabled"
            onPress={() => setShowTurnOffModal(false)}
            variant="secondary"
            style={{ flex: 1 }}
          />
          <AppButton
            title="Turn Off"
            onPress={confirmTurnOff}
            variant="destructive"
            style={{ flex: 1 }}
          />
        </View>
      </AppBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  heroSection: { alignItems: "center", marginBottom: 32 },
  shieldBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: { fontFamily: "DM Sans Bold", fontSize: 20, fontWeight: "700", color: "#0F172A", marginBottom: 8 },
  heroSubtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", textAlign: "center", paddingHorizontal: 16 },
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 16,
  },
  toggleTitle: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#0F172A" },
  toggleSubtitle: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B", marginTop: 2 },
  sheetSubtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", marginBottom: 12 },
  deleteActionRow: { flexDirection: "row", gap: 12, marginTop: 16 },
});
