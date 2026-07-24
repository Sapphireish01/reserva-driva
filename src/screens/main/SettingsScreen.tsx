import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainStackParamList } from "../../navigation/types";
import { colors, spacing, typography } from "../../theme/colors";

type Props = any;

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: string;
  onPress?: () => void;
  destructive?: boolean;
}

const SettingItem = ({ icon, label, badge, onPress, destructive }: SettingItemProps) => (
  <TouchableOpacity style={styles.itemRow} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.itemLeft}>
      <Ionicons
        name={icon}
        size={20}
        color={destructive ? colors.error : "#475569"}
        style={styles.itemIcon}
      />
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
            icon="person-outline"
            label="Profile"
            onPress={() => navigation.navigate("ProfileDetails")}
          />
          <View style={styles.divider} />
          <SettingItem icon="notifications-outline" label="Notifications" />
          <View style={styles.divider} />
          <SettingItem icon="alert-circle-outline" label="Emergency Contact" />
          <View style={styles.divider} />
          <SettingItem icon="car-outline" label="Vehicles" />
          <View style={styles.divider} />
          <SettingItem icon="people-outline" label="Communities" badge="Coming Soon" />
          <View style={styles.divider} />
          <SettingItem icon="card-outline" label="Bank Details" />
          <View style={styles.divider} />
          <SettingItem icon="options-outline" label="Preferences" />
          <View style={styles.divider} />
          <SettingItem icon="share-social-outline" label="Referrals" />
        </View>

        {/* Security Section */}
        <Text style={styles.sectionHeader}>Security</Text>
        <View style={styles.sectionCard}>
          <SettingItem icon="shield-checkmark-outline" label="Two-factor Authentication" />
          <View style={styles.divider} />
          <SettingItem icon="help-circle-outline" label="Report a Problem" />
          <View style={styles.divider} />
          <SettingItem
            icon="person-remove-outline"
            label="De-activate Account"
            destructive
          />
        </View>
      </ScrollView>
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
    marginBottom: spacing.lg,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E2E8F0",
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
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
  itemIcon: {
    marginRight: 14,
    width: 22,
  },
  itemLabel: {
    fontFamily: "DM Sans",
    fontSize: 15,
    fontWeight: "500",
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
});
