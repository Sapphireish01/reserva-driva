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
import { CopyIconItem } from "../../../components/ProfileIcons";
import { CheckIcon, ReferralsScreenSkeleton } from "../../../components/ui";
import { useReferralDetailsQuery } from "../../../hooks/useReferrals";
import { MainStackParamList } from "../../../navigation/types";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "Referrals">;

export const ReferralsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { data: referralData, isLoading } = useReferralDetailsQuery();
  const [copiedToast, setCopiedToast] = useState(false);

  const rewardPoints = (referralData?.reward_points ?? 0).toLocaleString();
  const numReferrals = String(referralData?.no_of_referrals ?? 0);
  const referralCode = referralData?.referral_code || "RES-EP-83293";

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
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referrals</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.content}>
          <ReferralsScreenSkeleton />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, spacing.lg) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
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
                <CopyIconItem color="#868C98" size={20} />
              </TouchableOpacity>
            </View>

            {/* Toast Popup */}
            {copiedToast && (
              <View style={styles.toastCard}>
                <CheckIcon size={16} style={{ marginRight: 6 }} />
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
          </View>

          {/* Footer Terms Note at the bottom */}
          <Text style={styles.footerNote}>
            Rewards are credited after your friend&apos;s first completed trip. Terms apply.
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 20, fontWeight: "700", color: colors.dark },
  content: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  mainContent: { flex: 1 },

  statsRow: { flexDirection: "row", gap: 16, marginBottom: spacing.xl },
  statCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    height: 88,
  },
  statLabel: { fontFamily: "DM Sans", fontSize: 12, color: "#868C98", marginBottom: 6 },
  statValue: { fontFamily: "DM Sans Bold", fontSize: 22, fontWeight: "700", color: colors.dark },

  sectionGroup: { marginBottom: spacing.xl },
  sectionHeader: { fontFamily: "DM Sans", fontSize: 13, color: "#868C98", marginBottom: 8 },
  bannerText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    color: colors.dark,
    lineHeight: 22,
    fontWeight: "700",
  },

  labelHeader: { fontFamily: "DM Sans", fontSize: 13, color: "#868C98", marginBottom: 8 },
  codeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
  },
  codeText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: colors.grey },

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
  toastText: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#166534" },

  howItWorksTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: colors.dark, marginBottom: 6 },
  explainerSubtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#868C98", marginBottom: spacing.md },
  stepList: { gap: 14 },
  stepText: { fontFamily: "DM Sans Bold", fontSize: 15, color: colors.dark, lineHeight: 22, fontWeight: "600" },

  footerNote: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#868C98",
    lineHeight: 20,
    marginTop: spacing.xl * 1.5,
  },
});
