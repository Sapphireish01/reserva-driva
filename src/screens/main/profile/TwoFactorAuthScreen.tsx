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
import { OTPCodeInput } from "../../../components/OTPCodeInput";
import { ToggleIconItem } from "../../../components/ProfileIcons";
import {
  AppBottomSheet,
  AppButton,
  AppFullScreenModal,
} from "../../../components/ui";
import { authService } from "../../../api/services/auth";
import { MainStackParamList } from "../../../navigation/types";
import { getUserMfaEnabled, useAuthStore } from "../../../state/authStore";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "TwoFactorAuth">;

const ShieldIcon = () => (
  <View style={styles.shieldBg}>
    <Svg width={44} height={44} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11v3.5"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </View>
);

export const TwoFactorAuthScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const initialMfa = getUserMfaEnabled(user);
  const [is2FAEnabled, setIs2FAEnabled] = useState(initialMfa);

  React.useEffect(() => {
    setIs2FAEnabled(getUserMfaEnabled(user));
  }, [user]);

  const updateMfaState = (enabled: boolean) => {
    if (!user) return;
    const updated = {
      ...user,
      mfa_enabled: enabled,
      mfa_method: enabled ? "2FA_PIN" : undefined,
      profile: {
        ...(user.profile || { user: user.id, full_name: user.full_name, email: user.email }),
        mfa_enabled: enabled,
        mfa_method: enabled ? "2FA_PIN" : undefined,
      },
    };
    setUser(updated);
  };

  // PIN Setup Modal States
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinStep, setPinStep] = useState<"create" | "confirm">("create");
  const [pinCode, setPinCode] = useState("");
  const [firstCode, setFirstCode] = useState("");
  const [pinError, setPinError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Turn Off Modal States
  const [showTurnOffModal, setShowTurnOffModal] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Change PIN Modal States
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [changePinStep, setChangePinStep] = useState<"current" | "new" | "confirm">("current");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [changePinError, setChangePinError] = useState("");
  const [isSubmittingChangePin, setIsSubmittingChangePin] = useState(false);
  const [isSuccessChangePin, setIsSuccessChangePin] = useState(false);

  const handleToggle2FA = (val: boolean) => {
    if (val) {
      setPinStep("create");
      setPinCode("");
      setFirstCode("");
      setPinError("");
      setIsSuccess(false);
      setShowPinModal(true);
    } else {
      setShowTurnOffModal(true);
    }
  };

  const handleContinuePin = async () => {
    if (pinCode.length < 6) return;

    if (pinStep === "create") {
      setFirstCode(pinCode);
      setPinStep("confirm");
      setPinCode("");
      setPinError("");
    } else {
      if (pinCode === firstCode) {
        setIsSubmitting(true);
        setPinError("");
        try {
          // 1. Setup 2FA PIN
          await authService.setup2FA({
            user_pin: firstCode,
            confirm_pin: pinCode,
          });

          // 2. Manage 2FA status to enable
          await authService.manage2FAStatus(true);

          setIsSuccess(true);
          setIs2FAEnabled(true);
          updateMfaState(true);
          setTimeout(() => {
            setIsSuccess(false);
            setShowPinModal(false);
          }, 1200);
        } catch (err: any) {
          console.warn("⚠️ Failed to setup 2FA on backend:", err?.response?.data || err?.message);
          const backendErr =
            err?.response?.data?.message ||
            err?.response?.data?.detail ||
            err?.response?.data?.user_pin?.[0] ||
            "Failed to set 2FA PIN. Please try again.";
          setPinError(String(backendErr));
          setPinCode("");
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setPinError("PINs do not match. Please try again.");
        setPinCode("");
      }
    }
  };

  const confirmTurnOff = async () => {
    if (isDeactivating) return;
    setIsDeactivating(true);
    try {
      // 1. Deactivate 2FA
      await authService.deactivate2FA();
      // 2. Manage 2FA status to disable
      await authService.manage2FAStatus(false);

      setIs2FAEnabled(false);
      updateMfaState(false);
      setShowTurnOffModal(false);
    } catch (err: any) {
      console.warn("⚠️ Failed to deactivate 2FA on backend:", err?.response?.data || err?.message);
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleContinueChangePin = async () => {
    if (changePinStep === "current") {
      if (currentPin.length < 6) return;
      setIsSubmittingChangePin(true);
      setChangePinError("");
      try {
        const res = await authService.initiatePinChange({ current_pin: currentPin });
        if (res.data?.success || res.data) {
          setChangePinStep("new");
          setChangePinError("");
        }
      } catch (err: any) {
        console.warn("⚠️ Invalid current PIN:", err?.response?.data || err?.message);
        const backendErr =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.response?.data?.current_pin?.[0] ||
          "Invalid current PIN. Please try again.";
        setChangePinError(String(backendErr));
        setCurrentPin("");
      } finally {
        setIsSubmittingChangePin(false);
      }
    } else if (changePinStep === "new") {
      if (newPin.length < 6) return;
      setChangePinStep("confirm");
      setChangePinError("");
    } else if (changePinStep === "confirm") {
      if (confirmNewPin.length < 6) return;
      if (confirmNewPin !== newPin) {
        setChangePinError("PINs do not match. Please try again.");
        setConfirmNewPin("");
        return;
      }
      setIsSubmittingChangePin(true);
      setChangePinError("");
      try {
        await authService.confirmPinChange({
          user_pin: newPin,
          confirm_pin: confirmNewPin,
        });
        setIsSuccessChangePin(true);
        setTimeout(() => {
          setIsSuccessChangePin(false);
          setShowChangePinModal(false);
        }, 1200);
      } catch (err: any) {
        console.warn("⚠️ Failed to change PIN:", err?.response?.data || err?.message);
        const backendErr =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Failed to change PIN. Please try again.";
        setChangePinError(String(backendErr));
        setConfirmNewPin("");
      } finally {
        setIsSubmittingChangePin(false);
      }
    }
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
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Two-Factor Authentication</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ShieldIcon />
          <Text style={styles.heroSubtitle}>
            Create a PIN for extra security, use the PIN to access your account
          </Text>
        </View>

        {/* Toggle Row */}
        <View style={styles.toggleCard}>
          <Text style={styles.toggleTitle}>Turn on</Text>
          <ToggleIconItem value={is2FAEnabled} onValueChange={handleToggle2FA} />
        </View>

        {/* Change PIN Option (Visible when 2FA is active) */}
        {is2FAEnabled && (
          <TouchableOpacity
            style={[styles.toggleCard, { marginTop: spacing.md }]}
            onPress={() => {
              setChangePinStep("current");
              setCurrentPin("");
              setNewPin("");
              setConfirmNewPin("");
              setChangePinError("");
              setIsSuccessChangePin(false);
              setShowChangePinModal(true);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.toggleTitle}>Change PIN</Text>
            <Ionicons name="chevron-forward" size={20} color="#868C98" />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* PIN Setup Full-Screen Modal */}
      <AppFullScreenModal
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        title="Two-Factor Authentication"
        leftActionText="Cancel"
        height="85%"
      >
        <View style={styles.pinModalBody}>
          <Text style={styles.pinInstructionTitle}>
            {pinStep === "create" ? "Create a six digit PIN" : "Confirm your six digit PIN"}
          </Text>

          <View style={styles.otpWrapper}>
            <OTPCodeInput
              value={pinCode}
              onChange={(val) => {
                setPinCode(val);
                if (pinError) setPinError("");
              }}
            />
          </View>

          {pinError ? <Text style={styles.errorText}>{pinError}</Text> : null}

          <AppButton
            title="Continue"
            onPress={handleContinuePin}
            disabled={pinCode.length < 6 || isSubmitting || isSuccess}
            loading={isSubmitting}
            success={isSuccess}
            successTitle="Enabled"
            size="lg"
            style={{ marginTop: 36 }}
          />
        </View>
      </AppFullScreenModal>

      {/* Change PIN Full-Screen Modal */}
      <AppFullScreenModal
        visible={showChangePinModal}
        onClose={() => setShowChangePinModal(false)}
        title="Change 2FA PIN"
        leftActionText="Cancel"
        height="85%"
      >
        <View style={styles.pinModalBody}>
          <Text style={styles.pinInstructionTitle}>
            {changePinStep === "current"
              ? "Enter your current six digit PIN"
              : changePinStep === "new"
              ? "Create a new six digit PIN"
              : "Confirm your new six digit PIN"}
          </Text>

          <View style={styles.otpWrapper}>
            <OTPCodeInput
              value={
                changePinStep === "current"
                  ? currentPin
                  : changePinStep === "new"
                  ? newPin
                  : confirmNewPin
              }
              onChange={(val) => {
                if (changePinStep === "current") setCurrentPin(val);
                else if (changePinStep === "new") setNewPin(val);
                else setConfirmNewPin(val);
                if (changePinError) setChangePinError("");
              }}
            />
          </View>

          {changePinError ? <Text style={styles.errorText}>{changePinError}</Text> : null}

          <AppButton
            title="Continue"
            onPress={handleContinueChangePin}
            disabled={
              (changePinStep === "current" && currentPin.length < 6) ||
              (changePinStep === "new" && newPin.length < 6) ||
              (changePinStep === "confirm" && confirmNewPin.length < 6) ||
              isSubmittingChangePin ||
              isSuccessChangePin
            }
            loading={isSubmittingChangePin}
            success={isSuccessChangePin}
            successTitle="PIN Changed"
            size="lg"
            style={{ marginTop: 36 }}
          />
        </View>
      </AppFullScreenModal>

      {/* Turn Off 2FA Confirmation Sheet */}
      <AppBottomSheet
        visible={showTurnOffModal}
        onClose={() => setShowTurnOffModal(false)}
        title="Turn Off Two-Factor Authentication?"
      >
        <Text style={styles.sheetSubtitle}>
          Are you sure you want to turn off two factor authentication
        </Text>
        <View style={styles.deleteActionColumn}>
          <AppButton
            title="Turn Off"
            onPress={confirmTurnOff}
            variant="destructive"
            loading={isDeactivating}
            disabled={isDeactivating}
            size="lg"
            style={{ borderRadius: 14 }}
          />
          <AppButton
            title="Cancel"
            onPress={() => setShowTurnOffModal(false)}
            size="lg"
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
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
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 20, fontWeight: "700", color: "#0F172A" },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  heroSection: { alignItems: "center", marginBottom: 24 },
  shieldBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F6F8FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  heroSubtitle: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: "#868C98",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  toggleTitle: { fontFamily: "DM Sans Medium", fontSize: 15, fontWeight: "500", color: "#0F172A" },
  pinModalBody: { paddingHorizontal: 20, paddingTop: 16 },
  pinInstructionTitle: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 24,
  },
  otpWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  errorText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#DC2626",
    textAlign: "center",
    marginTop: 12,
  },
  sheetSubtitle: { fontFamily: "DM Sans", fontSize: 15, color: colors.grey, marginBottom: 20 },
  deleteActionColumn: { flexDirection: "column", gap: 12, marginTop: 4 },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  cancelButtonText: {
    color: colors.grey,
    fontFamily: "DM Sans Bold",
  },
});
