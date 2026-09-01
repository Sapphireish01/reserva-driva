import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatsGridSkeleton, TripCardSkeleton } from "../../../components/ui";
import { useDriverMetricsQuery } from "../../../hooks/useDriverMetrics";
import { useDriverTripsQuery } from "../../../hooks/useDriverTrips";
import {
  getUserAddress,
  getUserAvatar,
  getUserFirstName,
  useAuthStore,
} from "../../../state/authStore";

type Props = any;

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

export const HomeScreen = ({ navigation }: Props) => {
  const user = useAuthStore((s) => s.user);
  const firstName = getUserFirstName(user) || (user?.full_name ? user.full_name.split(" ")[0] : "Driver");
  const address = getUserAddress(user) || user?.profile?.address_line_1 || "";
  const avatarUri = getUserAvatar(user) || DEFAULT_AVATAR;
  const isVerified = user?.is_verified ?? true;

  // Live Driver Metrics Query
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    refetch: refetchMetrics,
  } = useDriverMetricsQuery();

  // Live Scheduled Trips Query
  const {
    data: serverTrips,
    isLoading: isLoadingTrips,
    refetch: refetchTrips,
  } = useDriverTripsQuery({ status: "scheduled" });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchMetrics(), refetchTrips()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchMetrics, refetchTrips]);

  // Normalize scheduled trips array
  const scheduledTrips = React.useMemo(() => {
    const rawList = Array.isArray(serverTrips)
      ? serverTrips
      : (serverTrips as any)?.results && Array.isArray((serverTrips as any).results)
      ? (serverTrips as any).results
      : [];
    return rawList;
  }, [serverTrips]);

  const showBanner = !isVerified || !user?.profile?.address_line_1;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#375DFB" />
        }
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingTitle}>Hello {firstName},</Text>
            {address ? (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                <Text style={styles.locationText} numberOfLines={1}>{address}</Text>
              </View>
            ) : (
              <Text style={styles.locationText}>Welcome to Reserva Driver</Text>
            )}
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.bellButton}
              onPress={() => navigation.navigate("Notifications")}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={24} color="#0F172A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => navigation.navigate("ProfileDetails")}
              activeOpacity={0.8}
            >
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Completion Alert Banner */}
        {showBanner && (
          <TouchableOpacity
            style={styles.bannerCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ProfileDetails")}
          >
            <Text style={styles.bannerText}>Complete your profile to start accepting requests.</Text>
            <Ionicons name="arrow-forward" size={18} color="#375DFB" />
          </TouchableOpacity>
        )}

        {/* 2x2 Stats Grid */}
        {isLoadingMetrics ? (
          <StatsGridSkeleton />
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Earnings</Text>
                <Text style={styles.statValue}>
                  {metrics?.total_earnings !== undefined ? `$${metrics.total_earnings}` : "$0.00"}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Active Bookings</Text>
                <Text style={styles.statValue}>{metrics?.active_bookings ?? 0}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Upcoming Trips</Text>
                <Text style={styles.statValue}>{metrics?.upcoming_trips ?? scheduledTrips.length}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Completed Trips</Text>
                <Text style={styles.statValue}>{metrics?.total_completed_trips ?? 0}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Trip Queue Section Title */}
        <Text style={styles.sectionTitle}>Trip Queue</Text>

        {isLoadingTrips ? (
          <View style={{ gap: 12 }}>
            <TripCardSkeleton />
            <TripCardSkeleton />
          </View>
        ) : scheduledTrips.length === 0 ? (
          /* Empty Queue State */
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Upcoming Trips</Text>
            <Text style={styles.emptySubtitle}>
              Schedule a trip to start receiving bookings from passengers travelling your route.
            </Text>

            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => navigation.navigate("TripsTab")}
              activeOpacity={0.8}
            >
              <Text style={styles.scheduleButtonText}>Schedule Trip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Live Populated Trip Queue */
          <View style={styles.queueContainer}>
            {scheduledTrips.map((trip: any, index: number) => {
              const isFirst = index === 0;
              const pickup = trip.pickup_location || trip.origin || "Pickup location";
              const dest = trip.destination || "Destination";
              const depTime =
                trip.departure_time_display ||
                trip.departure_time ||
                trip.trip_date ||
                "Scheduled";
              const availableSeats = trip.seats_available ?? trip.available_seats ?? 0;
              const totalSeats = trip.available_seats ?? 4;

              return (
                <View key={trip.id || index} style={styles.tripCard}>
                  {/* Badge */}
                  <View style={styles.badgeRow}>
                    <View style={isFirst ? styles.readyBadge : styles.upNextBadge}>
                      <Text style={isFirst ? styles.readyBadgeText : styles.upNextBadgeText}>
                        {isFirst ? "Ready To Go" : "Up Next"}
                      </Text>
                    </View>
                  </View>

                  {/* Timeline */}
                  <View style={styles.timelineContainer}>
                    <View style={styles.timelineItem}>
                      <View style={styles.circleDot} />
                      <View style={styles.timelineTextContainer}>
                        <Text style={styles.timelineLabel}>Pick up point</Text>
                        <Text style={styles.timelineLocation}>{pickup}</Text>
                      </View>
                    </View>

                    <View style={styles.timelineLine} />

                    <View style={styles.timelineItem}>
                      <Ionicons
                        name="location"
                        size={16}
                        color="#0F172A"
                        style={{ marginLeft: -3, marginRight: 10 }}
                      />
                      <View style={styles.timelineTextContainer}>
                        <Text style={styles.timelineLabel}>Destination</Text>
                        <Text style={styles.timelineLocation}>{dest}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Sub Info Grid */}
                  <View style={styles.tripInfoBox}>
                    <View style={styles.infoCol}>
                      <Text style={styles.infoLabel}>Departure</Text>
                      <Text style={styles.infoValue}>{depTime}</Text>
                    </View>
                    <View style={styles.infoCol}>
                      <Text style={styles.infoLabel}>Seats Remaining</Text>
                      <Text style={styles.infoValue}>
                        {availableSeats} of {totalSeats}
                      </Text>
                    </View>
                  </View>

                  {/* Action Button */}
                  {isFirst && (
                    <TouchableOpacity
                      style={styles.startTripButton}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate("TripsTab")}
                    >
                      <Text style={styles.startTripText}>View Trip Details</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 4 : 0,
  },
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  contentContainer: { paddingHorizontal: 16, paddingBottom: 32 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  headerLeft: { flex: 1 },
  greetingTitle: { fontFamily: "DM Sans Bold", fontSize: 22, fontWeight: "700", color: "#0F172A" },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B", fontWeight: "400" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  bellButton: { width: 38, height: 38, justifyContent: "center", alignItems: "center" },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  avatarImage: { width: "100%", height: "100%" },

  bannerCard: {
    backgroundColor: "#F0F6FE",
    borderWidth: 1,
    borderColor: "#E0ECFE",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  bannerText: { fontFamily: "DM Sans Bold", fontSize: 13, fontWeight: "600", color: "#375DFB", flex: 1, marginRight: 8 },

  statsGrid: { marginBottom: 20 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
  },
  statLabel: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B", marginBottom: 6, fontWeight: "400" },
  statValue: { fontFamily: "DM Sans Bold", fontSize: 24, fontWeight: "700", color: "#0F172A" },

  sectionTitle: { fontFamily: "DM Sans Bold", fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 12 },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  emptyTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A", marginBottom: 8 },
  emptySubtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
    maxWidth: 320,
  },
  scheduleButton: {
    backgroundColor: "#375DFB",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 12,
  },
  scheduleButtonText: { fontFamily: "DM Sans Bold", color: "#FFFFFF", fontWeight: "700", fontSize: 15 },

  queueContainer: { gap: 14 },
  tripCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
  },
  badgeRow: { flexDirection: "row", marginBottom: 14 },
  readyBadge: { backgroundColor: "#375DFB", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16 },
  readyBadgeText: { fontFamily: "DM Sans Bold", fontSize: 12, fontWeight: "700", color: "#FFFFFF" },
  upNextBadge: { backgroundColor: "#F1F5F9", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16 },
  upNextBadgeText: { fontFamily: "DM Sans Bold", fontSize: 12, fontWeight: "600", color: "#64748B" },

  timelineContainer: { marginBottom: 16 },
  timelineItem: { flexDirection: "row", alignItems: "center" },
  circleDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: "#94A3B8", marginRight: 12 },
  timelineLine: { width: 1.5, height: 20, backgroundColor: "#CBD5E1", marginLeft: 4, marginVertical: 2 },
  timelineTextContainer: { flex: 1 },
  timelineLabel: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8" },
  timelineLocation: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "600", color: "#0F172A" },

  tripInfoBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    flexDirection: "row",
    padding: 14,
    justifyContent: "space-between",
  },
  infoCol: { flex: 1, alignItems: "center" },
  infoLabel: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B", marginBottom: 4 },
  infoValue: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#0F172A" },

  startTripButton: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 14,
  },
  startTripText: { fontFamily: "DM Sans Bold", color: "#375DFB", fontSize: 15, fontWeight: "700" },
});
