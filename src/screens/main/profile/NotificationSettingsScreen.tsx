import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authService } from "../../../api/services/auth";
import { NotificationIconItem, ToggleIconItem } from "../../../components/ProfileIcons";
import { MainStackParamList } from "../../../navigation/types";
import { getUserNotificationSettings, useAuthStore } from "../../../state/authStore";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "NotificationSettings">;

export const NotificationSettingsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const initialPrefs = getUserNotificationSettings(user);
  const [inApp, setInApp] = useState(initialPrefs.notify_in_app);
  const [email, setEmail] = useState(initialPrefs.notify_via_email);
  const [sms, setSms] = useState(initialPrefs.notify_via_sms);

  React.useEffect(() => {
    if (user) {
      const prefs = getUserNotificationSettings(user);
      setInApp(prefs.notify_in_app);
      setEmail(prefs.notify_via_email);
      setSms(prefs.notify_via_sms);
    }
  }, [user]);

  const updateToggle = async (
    key: "notify_in_app" | "notify_via_email" | "notify_via_sms",
    val: boolean
  ) => {
    // Immediate optimistic state update
    if (key === "notify_in_app") setInApp(val);
    if (key === "notify_via_email") setEmail(val);
    if (key === "notify_via_sms") setSms(val);

    const updatedInApp = key === "notify_in_app" ? val : inApp;
    const updatedEmail = key === "notify_via_email" ? val : email;
    const updatedSms = key === "notify_via_sms" ? val : sms;

    if (!user) return;

    // Optimistically update Zustand store
    const updatedLocalUser = {
      ...user,
      profile: {
        ...(user.profile || {
          user: user.id,
          full_name: user.full_name,
          email: user.email,
        }),
        [key]: val,
      },
    };
    await setUser(updatedLocalUser);

    try {
      // Call PUT /accounts/profile/notifications/ service
      await authService.updateNotificationSettings({
        notify_in_app: updatedInApp,
        notify_via_email: updatedEmail,
        notify_via_sms: updatedSms,
      });
    } catch (err) {
      console.warn("⚠️ Failed to update notification preferences on server:", err);
      // Revert state on network error
      if (key === "notify_in_app") setInApp(!val);
      if (key === "notify_via_email") setEmail(!val);
      if (key === "notify_via_sms") setSms(!val);
      await setUser(user);
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
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* In-App Notification */}
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <View style={styles.icon}>
              <NotificationIconItem color="#868C98" size={20} />
            </View>
            <View>
              <Text style={styles.itemLabel}>In-App Notification</Text>
              <Text style={styles.itemSub}>Receive real-time alerts inside the app</Text>
            </View>
          </View>
          <ToggleIconItem value={inApp} onValueChange={(val) => updateToggle("notify_in_app", val)} />
        </View>

        {/* Email Notification */}
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Ionicons name="mail-outline" size={20} color="#868C98" style={styles.icon} />
            <View>
              <Text style={styles.itemLabel}>Email Notification</Text>
              <Text style={styles.itemSub}>Receive ride and payment receipts via email</Text>
            </View>
          </View>
          <ToggleIconItem value={email} onValueChange={(val) => updateToggle("notify_via_email", val)} />
        </View>

        {/* SMS Notification */}
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Ionicons name="call-outline" size={20} color="#868C98" style={styles.icon} />
            <View>
              <Text style={styles.itemLabel}>SMS Notification</Text>
              <Text style={styles.itemSub}>Get urgent text alerts on your phone</Text>
            </View>
          </View>
          <ToggleIconItem value={sms} onValueChange={(val) => updateToggle("notify_via_sms", val)} />
        </View>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: "700",
    color: colors.dark,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  icon: {
    marginRight: 14,
    width: 24,
    alignItems: "center",
  },
  itemLabel: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: colors.dark,
  },
  itemSub: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#868C98",
    marginTop: 2,
  },
});
