import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MainStackParamList } from "../../navigation/types";
import { colors, spacing, typography } from "../../theme/colors";
import { tripsService, PassengerRequest } from "../../api/services/trips";

type Props = any;

type FilterTab = "pending" | "approved" | "declined";

export const PassengerRequestsScreen = ({ route }: Props) => {
  const queryClient = useQueryClient();
  const filterTripId = route.params?.tripId;
  const [activeTab, setActiveTab] = useState<FilterTab>("pending");

  const {
    data: requests = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["passengerRequests"],
    queryFn: tripsService.getPassengerRequests,
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "decline" }) =>
      tripsService.respondToRequest(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["passengerRequests"] });
      queryClient.invalidateQueries({ queryKey: ["driverTrips"] });
    },
  });

  const filteredRequests = requests.filter((r) => {
    if (filterTripId && r.tripId !== filterTripId) return false;
    return r.status === activeTab;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Tabs */}
        <View style={styles.tabsRow}>
          {(["pending", "approved", "declined"] as FilterTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                {requests.filter((r) => (filterTripId ? r.tripId === filterTripId : true) && r.status === tab).length}
                )
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : filteredRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No {activeTab} requests</Text>
            <Text style={styles.emptySub}>
              Requests from riders will appear here when they request seats on your route.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredRequests}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary]} />
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.passengerName}>{item.passengerName}</Text>
                    <Text style={styles.ratingText}>★ {item.passengerRating.toFixed(1)} Rating</Text>
                  </View>
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>${item.totalPrice.toFixed(2)}</Text>
                    <Text style={styles.seatsSub}>{item.requestedSeats} seat(s)</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.locationRow}>
                  <Text style={styles.locationLabel}>Pickup:</Text>
                  <Text style={styles.locationValue}>{item.pickupLocation}</Text>
                </View>

                <View style={styles.locationRow}>
                  <Text style={styles.locationLabel}>Dropoff:</Text>
                  <Text style={styles.locationValue}>{item.dropoffLocation}</Text>
                </View>

                <Text style={styles.timestamp}>Requested {item.createdAt}</Text>

                {item.status === "pending" ? (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.declineBtn]}
                      onPress={() => respondMutation.mutate({ id: item.id, action: "decline" })}
                      disabled={respondMutation.isPending}
                    >
                      <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => respondMutation.mutate({ id: item.id, action: "approve" })}
                      disabled={respondMutation.isPending}
                    >
                      <Text style={styles.approveText}>Approve Rider</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.statusBanner,
                      item.status === "approved" ? styles.bannerApproved : styles.bannerDeclined,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBannerText,
                        item.status === "approved" ? styles.textApproved : styles.textDeclined,
                      ]}
                    >
                      Request {item.status.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            )}
          />
        )}
      </View>
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
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: { borderBottomColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: "600", color: colors.textMuted },
  activeTabText: { color: colors.primary, fontWeight: "700" },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl },
  emptyTitle: { ...typography.h2, color: colors.text, marginBottom: 6 },
  emptySub: { ...typography.body, color: colors.textMuted, textAlign: "center" },

  listContent: { padding: spacing.md },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  passengerName: { fontSize: 16, fontWeight: "700", color: colors.text },
  ratingText: { fontSize: 12, color: "#D97706", fontWeight: "600", marginTop: 2 },
  priceBadge: { alignItems: "flex-end" },
  priceText: { fontSize: 16, fontWeight: "700", color: colors.success },
  seatsSub: { fontSize: 11, color: colors.textMuted },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },

  locationRow: { flexDirection: "row", marginBottom: 4 },
  locationLabel: { fontSize: 13, fontWeight: "600", color: colors.textMuted, width: 60 },
  locationValue: { fontSize: 13, color: colors.text, flex: 1 },

  timestamp: { fontSize: 11, color: colors.textMuted, marginTop: 6, fontStyle: "italic" },

  actionsRow: { flexDirection: "row", marginTop: spacing.md, gap: 10 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  declineBtn: { backgroundColor: "#FEE2E2" },
  approveBtn: { backgroundColor: colors.primary },
  declineText: { color: colors.error, fontWeight: "700", fontSize: 13 },
  approveText: { color: "#FFF", fontWeight: "700", fontSize: 13 },

  statusBanner: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  bannerApproved: { backgroundColor: "#ECFDF5" },
  bannerDeclined: { backgroundColor: "#FEE2E2" },
  statusBannerText: { fontSize: 12, fontWeight: "700" },
  textApproved: { color: colors.success },
  textDeclined: { color: colors.error },
});
