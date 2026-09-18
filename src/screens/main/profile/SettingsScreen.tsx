import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLoader } from "../../../components/ui";
import {
  BankDetailsIconItem,
  ChatSupportIconItem,
  CommunitiesIconItem,
  ContactUsIconItem,
  DeactivateIconItem,
  EmergencyContactIconItem,
  FAQIconItem,
  LogoutIconItem,
  NotificationIconItem,
  PreferencesIconItem,
  ProfileIconItem,
  ReferralsIconItem,
  ReportProblemIconItem,
  TwoFAIconItem,
  VehiclesIconItem,
  WarningIconItem,
} from "../../../components/ProfileIcons";
import {
  getUserAvatar,
  getUserEmail,
  getUserFullName,
  useAuthStore,
} from "../../../state/authStore";
import { colors, spacing } from "../../../theme/colors";

type Props = any;

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onPress?: () => void;
  destructive?: boolean;
}

const SettingItem = ({ icon, label, badge, onPress, destructive }: SettingItemProps) => (
  <TouchableOpacity style={styles.itemRow} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.itemLeft}>
      <View style={styles.itemIconContainer}>{icon}</View>
      <Text style={[styles.itemLabel, destructive && styles.itemLabelDestructive]}>
        {label}
      </Text>
      {badge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
    <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
  </TouchableOpacity>
);

export const SettingsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((state) => state.logout);
  const deactivateAccount = useAuthStore((state) => state.deactivateAccount);
  const user = useAuthStore((state) => state.user);

  const fullName = getUserFullName(user) || "Driver Account";
  const email = getUserEmail(user);
  const avatarUri = getUserAvatar(user) || DEFAULT_AVATAR;

  const [showDeactivateModal, setShowDeactivateModal] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [hasActiveBookings, setHasActiveBookings] = React.useState(false);
  const [isDeactivating, setIsDeactivating] = React.useState(false);
  const [deactivateError, setDeactivateError] = React.useState<string | null>(null);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  const handleCloseDeactivate = () => {
    if (isDeactivating) return;
    setShowDeactivateModal(false);
    setDeactivateError(null);
    setHasActiveBookings(false);
  };

  const handleDeactivate = async () => {
    setIsDeactivating(true);
    setDeactivateError(null);
    try {
      const res = await deactivateAccount();
      setShowDeactivateModal(false);
      Alert.alert(
        "Account Deactivated",
        res?.message || "Your account has been deactivated successfully."
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Could not deactivate account. Please ensure all active bookings are completed.";
      if (
        msg.toLowerCase().includes("booking") ||
        msg.toLowerCase().includes("trip") ||
        msg.toLowerCase().includes("active")
      ) {
        setHasActiveBookings(true);
      }
      setDeactivateError(msg);
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Title */}
        <Text style={styles.headerTitle}>Settings</Text>

        {/* User Card */}
        <TouchableOpacity
          style={styles.userCard}
          onPress={() => navigation.navigate("ProfileDetails")}
          activeOpacity={0.8}
        >
          <Image source={{ uri: avatarUri }} style={styles.userAvatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{fullName}</Text>
            {email ? <Text style={styles.userEmail}>{email}</Text> : null}
          </View>
        </TouchableOpacity>

        {/* Account Section */}
        <Text style={styles.sectionHeader}>Account</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            icon={<ProfileIconItem color="#868C98" size={20} />}
            label="Profile"
            onPress={() => navigation.navigate("ProfileDetails")}
          />
          <SettingItem
            icon={<NotificationIconItem color="#868C98" size={20} />}
            label="Notifications"
            onPress={() => navigation.navigate("Notifications")}
          />
          <SettingItem
            icon={<EmergencyContactIconItem color="#868C98" size={20} />}
            label="Emergency Contact"
            onPress={() => navigation.navigate("EmergencyContacts")}
          />
          <SettingItem
            icon={<VehiclesIconItem color="#868C98" size={20} />}
            label="Vehicles"
            onPress={() => navigation.navigate("Vehicles")}
          />
          <SettingItem
            icon={<CommunitiesIconItem color="#868C98" size={20} />}
            label="Communities"
            badge="Coming Soon"
          />
          <SettingItem
            icon={<BankDetailsIconItem color="#868C98" size={20} />}
            label="Bank Details"
            onPress={() => navigation.navigate("BankDetails")}
          />
          <SettingItem
            icon={<PreferencesIconItem color="#868C98" size={20} />}
            label="Preferences"
            onPress={() => navigation.navigate("Preferences")}
          />
          <SettingItem
            icon={<ReferralsIconItem color="#868C98" size={20} />}
            label="Referrals"
            onPress={() => navigation.navigate("Referrals")}
          />
        </View>

        {/* Security Section */}
        <Text style={styles.sectionHeader}>Security</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            icon={<TwoFAIconItem color="#868C98" size={20} />}
            label="Two-factor Authentication"
            onPress={() => navigation.navigate("TwoFactorAuth")}
          />
          <SettingItem
            icon={<ReportProblemIconItem color="#868C98" size={20} />}
            label="Report a Problem"
            onPress={() => navigation.navigate("ReportProblem")}
          />
          <SettingItem
            icon={<DeactivateIconItem color="#868C98" size={20} />}
            label="De-activate Account"
            onPress={() => {
              setHasActiveBookings(false);
              setShowDeactivateModal(true);
            }}
          />
        </View>

        {/* Other Section */}
        <Text style={styles.sectionHeader}>Other</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            icon={<ChatSupportIconItem color="#868C98" size={20} />}
            label="Chat with support"
            onPress={() => navigation.navigate("ChatWithSupport")}
          />
          <SettingItem
            icon={<FAQIconItem color="#868C98" size={20} />}
            label="FAQs"
            onPress={() => navigation.navigate("FAQs")}
          />
          <SettingItem
            icon={<ContactUsIconItem color="#868C98" size={20} />}
            label="Contact Us"
            onPress={() => navigation.navigate("ContactUs")}
          />
          <SettingItem
            icon={<LogoutIconItem color="#868C98" size={20} />}
            label="Logout"
            onPress={() => setShowLogoutModal(true)}
          />
        </View>
      </ScrollView>

      {/* 1. Deactivate Account Bottom Sheet Modal */}
      <Modal visible={showDeactivateModal} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.sheetBackdrop}
            onPress={handleCloseDeactivate}
            disabled={isDeactivating}
          />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Deactivate Account?</Text>
              <TouchableOpacity onPress={handleCloseDeactivate} disabled={isDeactivating}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSubtitle}>
              Are you sure you want to <Text style={styles.boldText}>deactivate</Text> this account? You will no longer have access to Rezarva.
            </Text>

            {/* Alert Banner */}
            <View style={styles.alertBanner}>
              <View style={{ marginRight: 8 }}>
                <WarningIconItem color="#9F2D00" size={18} />
              </View>
              <Text style={styles.alertText}>
                {hasActiveBookings
                  ? "We cannot deactivate your account at the moment, you still have active bookings. Please complete bookings to proceed."
                  : "Active bookings must be completed before deactivation."}
              </Text>
            </View>

            {deactivateError ? (
              <View
                style={[
                  styles.alertBanner,
                  { backgroundColor: "#FEF2F2", borderColor: "#FFA2A2", borderWidth: 1 },
                ]}
              >
                <View style={{ marginRight: 8 }}>
                  <WarningIconItem color="#E7000B" size={18} />
                </View>
                <Text style={[styles.alertText, { color: "#E7000B" }]}>
                  {deactivateError}
                </Text>
              </View>
            ) : null}

            {hasActiveBookings ? (
              <TouchableOpacity
                style={styles.blueBtn}
                onPress={() => {
                  handleCloseDeactivate();
                  navigation.navigate("BookingsTab");
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.blueBtnText}>Back to Bookings</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.redBtn, isDeactivating && { opacity: 0.7 }]}
                  onPress={handleDeactivate}
                  disabled={isDeactivating}
                  activeOpacity={0.8}
                >
                  {isDeactivating ? (
                    <AppLoader />
                  ) : (
                    <Text style={styles.redBtnText}>Deactivate</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.outlineBtn}
                  onPress={handleCloseDeactivate}
                  disabled={isDeactivating}
                  activeOpacity={0.7}
                >
                  <Text style={styles.outlineBtnText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* 2. Logout Bottom Sheet Modal */}
      <Modal visible={showLogoutModal} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.sheetBackdrop}
            onPress={() => setShowLogoutModal(false)}
          />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Logout?</Text>
              <TouchableOpacity onPress={() => setShowLogoutModal(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSubtitle}>
              Are you sure you want to logout from this account?
            </Text>

            <TouchableOpacity style={styles.blueBtn} onPress={handleLogout} activeOpacity={0.8}>
              <Text style={styles.blueBtnText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => setShowLogoutModal(false)}
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
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 26,
    fontWeight: "600",
    color: "#0F172A",
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: 0,
    marginBottom: spacing.lg,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontFamily: "DM Sans Bold",
    fontSize: 17,
    fontWeight: "500",
    color: "#0F172A",
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: colors.grey,
  },
  sectionHeader: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    fontWeight: "600",
    color: colors.grey,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    marginHorizontal: -spacing.md,
    textTransform: "capitalize",
    backgroundColor: "#F6F8FA",
  },

  sectionCard: {
    gap: spacing.md,
    paddingVertical: spacing.md,
    overflow: "hidden",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingVertical: spacing.sm,
    // paddingHorizontal: spacing.md,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemIconContainer: {
    marginRight: 14,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "400",
    color: colors.dark,
  },
  itemLabelDestructive: {
    color: colors.error,
  },
  badgeContainer: {
    backgroundColor: "#F6F8FA",
    borderWidth: 1,
    borderColor: "#E2E4E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontFamily: "DM Sans",
    fontSize: 11,
    color: colors.grey,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 50,
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    paddingBottom: spacing.xl * 1.5,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sheetTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  sheetSubtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#475569", marginBottom: spacing.md, lineHeight: 20 },
  boldText: { fontFamily: "DM Sans Bold", fontWeight: "700", color: "#0F172A" },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    // borderWidth: 1,
    // borderColor: "#FDE68A",
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  alertText: { flex: 1, fontFamily: "DM Sans", fontSize: 12, color: "#9F2D00", lineHeight: 17 },
  blueBtn: {
    backgroundColor: "#375DFB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  blueBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
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
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  outlineBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "600", color: colors.dark },
});
