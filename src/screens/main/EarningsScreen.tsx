import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { colors, spacing, typography } from "../../theme/colors";
import { tripsService } from "../../api/services/trips";

type Props = any;

export const EarningsScreen = ({ navigation }: Props) => {
  const [cashedOut, setCashedOut] = useState(false);

  const { data: earnings, isLoading } = useQuery({
    queryKey: ["driverEarnings"],
    queryFn: tripsService.getEarnings,
  });

  const handleCashOut = () => {
    setCashedOut(true);
    Alert.alert(
      "Cash Out Requested",
      `$${earnings?.todayEarnings.toFixed(2)} has been initiated for instant transfer to your linked bank account.`
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const todayBalance = cashedOut ? 0.0 : earnings?.todayEarnings ?? 75.0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Earnings Overview Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Available Balance</Text>
          <Text style={styles.heroAmount}>${todayBalance.toFixed(2)}</Text>
          <Text style={styles.heroSub}>Updated after every completed ride</Text>

          <TouchableOpacity
            style={[styles.cashOutButton, todayBalance === 0 && styles.disabledCashOut]}
            onPress={handleCashOut}
            disabled={todayBalance === 0}
          >
            <Text style={styles.cashOutText}>
              {todayBalance === 0 ? "Balance Transferred" : "Instant Cash Out"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Financial Metrics Summary */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>This Week</Text>
            <Text style={styles.metricValue}>${earnings?.weeklyEarnings.toFixed(2)}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Lifetime Earned</Text>
            <Text style={styles.metricValue}>${earnings?.totalEarned.toFixed(2)}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Trips Done</Text>
            <Text style={styles.metricValue}>{earnings?.completedTripsCount}</Text>
          </View>
        </View>

        {/* Payout Schedule Card */}
        <View style={styles.scheduleCard}>
          <Text style={styles.scheduleTitle}>📅 Automatic Weekly Payout</Text>
          <Text style={styles.scheduleBody}>
            Every Monday, your available balance is automatically deposited directly to your bank account via ACH transfer (No transfer fee).
          </Text>
        </View>

        {/* Recent Payout Activity */}
        <Text style={styles.sectionTitle}>Recent Payout Activity</Text>
        {earnings?.recentPayouts.map((item) => (
          <View key={item.id} style={styles.payoutCard}>
            <View style={styles.payoutInfo}>
              <Text style={styles.payoutDescription}>{item.description}</Text>
              <Text style={styles.payoutDate}>{item.date}</Text>
            </View>
            <Text style={styles.payoutAmount}>+${item.amount.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 8 : 0,
  },
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: spacing.md },
  heroCard: {
    backgroundColor: colors.navy,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  heroLabel: { ...typography.caption, color: "#9CA3AF" },
  heroAmount: { fontSize: 36, fontWeight: "800", color: "#FFF", marginVertical: 4 },
  heroSub: { ...typography.caption, color: "#6B7280", marginBottom: spacing.md },
  cashOutButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
  },
  disabledCashOut: { backgroundColor: colors.primaryDisabled },
  cashOutText: { color: "#FFF", fontWeight: "700", fontSize: 14 },

  metricsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
  metricCard: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    marginHorizontal: 3,
  },
  metricLabel: { fontSize: 11, color: colors.textMuted, marginBottom: 4 },
  metricValue: { fontSize: 16, fontWeight: "700", color: colors.text },

  scheduleCard: {
    backgroundColor: "#F3F4F6",
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.md,
  },
  scheduleTitle: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 4 },
  scheduleBody: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },

  sectionTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.sm },

  payoutCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  payoutInfo: { flex: 1 },
  payoutDescription: { fontSize: 14, fontWeight: "600", color: colors.text },
  payoutDate: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  payoutAmount: { fontSize: 15, fontWeight: "700", color: colors.success },
});
