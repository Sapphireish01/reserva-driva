import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Clipboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainStackParamList } from "../../navigation/types";
import { spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "Referrals">;

export const ReferralsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const referralCode = "DRF-VALERIE-24";

  const [rewardPoints, setRewardPoints] = useState("10,000");
  const [numReferrals, setNumReferrals] = useState("10");
  const [copiedToast, setCopiedToast] = useState(false);

  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 1800);
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
        <Text style={styles.headerTitle}>Referrals</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Your Reward Points</Text>
            <Text style={styles.statValue}>{rewardPoints}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>No. Of Referrals</Text>
            <Text style={styles.statValue}>{numReferrals}</Text>
          </View>
        </View>

        {/* Invite Friends & Earn Rewards */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionHeader}>Invite friends and earn rewards</Text>
          <Text style={styles.bannerText}>
            Earn an extra ₦1,000 for every successful driver you refer. Invite qualified drivers today and start turning your network into extra income.
          </Text>
        </View>

        {/* Referral Code Box */}
        <View style={styles.sectionGroup}>
          <Text style={styles.labelHeader}>Referral Code</Text>
          <TouchableOpacity
            style={styles.codeCard}
            onPress={handleCopyCode}
            activeOpacity={0.7}
          >
            <Text style={styles.codeText}>{referralCode}</Text>
            <Ionicons name="copy-outline" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Toast Popup */}
        {copiedToast && (
          <View style={styles.toastCard}>
            <Ionicons name="checkmark-circle" size={16} color="#22C55E" style={{ marginRight: 6 }} />
            <Text style={styles.toastText}>Referral code copied!</Text>
          </View>
        )}

        {/* How It Works */}
        <View style={styles.sectionGroup}>
          <Text style={styles.howItWorksTitle}>How It Works</Text>
          <Text style={styles.explainerSubtitle}>A simple three-step explainer:</Text>

          <View style={styles.stepList}>
            <Text style={styles.stepText}>1. Share your referral code.</Text>
            <Text style={styles.stepText}>2. Your friend signs up and gets verified</Text>
            <Text style={styles.stepText}>3. You both earn rewards.</Text>
          </View>
        </View>

        {/* Footer Terms Note */}
        <Text style={styles.footerNote}>
          Rewards are credited after your friend's first completed trip. Terms apply.
        </Text>
      </ScrollView>
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
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl * 2 },

  statsRow: { flexDirection: "row", gap: 12, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    height: 72,
  },
  statLabel: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8", marginBottom: 4 },
  statValue: { fontFamily: "DM Sans Bold", fontSize: 20, fontWeight: "800", color: "#0F172A" },

  sectionGroup: { marginBottom: spacing.lg },
  sectionHeader: { fontFamily: "DM Sans", fontSize: 12, color: "#94A3B8", marginBottom: 6 },
  bannerText: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    color: "#0F172A",
    lineHeight: 20,
    fontWeight: "600",
  },

  labelHeader: { fontFamily: "DM Sans", fontSize: 12, color: "#94A3B8", marginBottom: 6 },
  codeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  codeText: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#0F172A" },

  toastCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  toastText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#166534" },

  howItWorksTitle: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
  explainerSubtitle: { fontFamily: "DM Sans", fontSize: 13, color: "#94A3B8", marginBottom: spacing.md },
  stepList: { gap: 12 },
  stepText: { fontFamily: "DM Sans", fontSize: 13, color: "#0F172A", lineHeight: 18 },

  footerNote: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 18,
    marginTop: spacing.xl,
  },
});
