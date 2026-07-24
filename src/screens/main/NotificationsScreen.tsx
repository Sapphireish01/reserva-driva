import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainStackParamList } from "../../navigation/types";
import { spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "Notifications">;

export const NotificationsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [inApp, setInApp] = useState(true);
  const [email, setEmail] = useState(false);
  const [sms, setSms] = useState(false);

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* In-App Notification */}
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Ionicons name="notifications-outline" size={20} color="#0F172A" style={styles.icon} />
            <Text style={styles.itemLabel}>In-App Notification</Text>
          </View>
          <Switch
            value={inApp}
            onValueChange={setInApp}
            trackColor={{ false: "#E2E8F0", true: "#0F172A" }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Email Notification */}
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Ionicons name="mail-outline" size={20} color="#0F172A" style={styles.icon} />
            <Text style={styles.itemLabel}>Email Notification</Text>
          </View>
          <Switch
            value={email}
            onValueChange={setEmail}
            trackColor={{ false: "#E2E8F0", true: "#0F172A" }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* SMS Notification */}
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Ionicons name="call-outline" size={20} color="#0F172A" style={styles.icon} />
            <Text style={styles.itemLabel}>SMS Notification</Text>
          </View>
          <Switch
            value={sms}
            onValueChange={setSms}
            trackColor={{ false: "#E2E8F0", true: "#0F172A" }}
            thumbColor="#FFFFFF"
          />
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
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 14,
  },
  itemLabel: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
});
