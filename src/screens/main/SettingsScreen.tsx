import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
} from "../../components/ProfileIcons";
import { useAuthStore } from "../../state/authStore";
import { colors, spacing } from "../../theme/colors";

type Props = any;

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300";

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

  const [showDeactivateModal, setShowDeactivateModal] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [hasActiveBookings, setHasActiveBookings] = React.useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
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
          <Image source={{ uri: DEFAULT_AVATAR }} style={styles.userAvatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Prosper Edward</Text>
            <Text style={styles.userEmail}>Prosperedward001@gmail.com</Text>
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
          <View style={styles.divider} />
          <SettingItem
            icon={<NotificationIconItem color="#868C98" size={20} />}
            label="Notifications"
            onPress={() => navigation.navigate("Notifications")}
          />
          <View style={styles.divider} />
          <SettingItem
            icon={<EmergencyContactIconItem color="#868C98" size={20} />}
            label="Emergency Contact"
            onPress={() => navigation.navigate("EmergencyContacts")}
          />
          <View style={styles.divider} />
          <SettingItem
            icon={<VehiclesIconItem color="#868C98" size={20} />}
            label="Vehicles"
            onPress={() => navigation.navigate("Vehicles")}
          />
          <View style={styles.divider} />
          <SettingItem
            icon={<CommunitiesIconItem color="#868C98" size={20} />}
            label="Communities"
            badge="Coming Soon"
          />
          <View style={styles.divider} />
          <SettingItem
            icon={<BankDetailsIconItem color="#868C98" size={20} />}
            label="Bank Details"
            onPress={() => navigation.navigate("BankDetails")}
          />
          <View style={styles.divider} />
          <SettingItem
            icon={<PreferencesIconItem color="#868C98" size={20} />}
            label="Preferences"
            onPress={() => navigation.navigate("Preferences")}
          />
          <View style={styles.divider} />
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
          <View style={styles.divider} />
          <SettingItem
            icon={<ReportProblemIconItem color="#868C98" size={20} />}
            label="Report a Problem"
            onPress={() => navigation.navigate("ReportProblem")}
          />
          <View style={styles.divider} />
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
          <View style={styles.divider} />
          <SettingItem
            icon={<FAQIconItem color="#868C98" size={20} />}
            label="FAQs"
            onPress={() => navigation.navigate("FAQs")}
          />
          <View style={styles.divider} />
          <SettingItem
            icon={<ContactUsIconItem color="#868C98" size={20} />}
            label="Contact Us"
            onPress={() => navigation.navigate("ContactUs")}
          />
          <View style={styles.divider} />
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
            onPress={() => setShowDeactivateModal(false)}
          />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Deactivate Account?</Text>
              <TouchableOpacity onPress={() => setShowDeactivateModal(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSubtitle}>
              Are you sure you want to deactivate this account, you will no longer have access to Drifully
            </Text>

            {/* Alert Banner */}
            <View style={styles.alertBanner}>
              <Ionicons name="information-circle-outline" size={18} color="#D97706" style={{ marginRight: 8 }} />
              <Text style={styles.alertText}>
                {hasActiveBookings
                  ? "We cannot deactivate your account at the moment, you still have active bookings. Please complete bookings to proceed."
                  : "Active bookings must be completed before deactivation."}
              </Text>
            </View>

            {hasActiveBookings ? (
              <TouchableOpacity
                style={styles.blueBtn}
                onPress={() => {
                  setShowDeactivateModal(false);
                  navigation.navigate("BookingsTab");
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.blueBtnText}>Back to Bookings</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.redBtn}
                  onPress={() => setHasActiveBookings(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.redBtnText}>Deactivate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.outlineBtn}
                  onPress={() => setShowDeactivateModal(false)}
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
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 26,
    fontWeight: "800",
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
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E2E8F0",
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontFamily: "DM Sans Bold",
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#64748B",
  },
  sectionHeader: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "capitalize",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemIconContainer: {
    marginRight: 14,
    width: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  itemLabelDestructive: {
    color: colors.error,
  },
  badgeContainer: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontFamily: "DM Sans",
    fontSize: 11,
    color: "#64748B",
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
  sheetSubtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", marginBottom: spacing.md, lineHeight: 20 },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  alertText: { flex: 1, fontFamily: "DM Sans", fontSize: 13, color: "#92400E", lineHeight: 18 },
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
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  outlineBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "600", color: "#475569" },
});
