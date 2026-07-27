import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PassengerRequest, tripsService } from "../../../api/services/trips";
import { PassengerDetailsModal } from "../../../components/bookings/PassengerDetailsModal";
import { RoutePassengersModal } from "../../../components/bookings/RoutePassengersModal";
import { VerifiedBadgeIcon } from "../../../components/ProfileIcons";
import { AppButton } from "../../../components/ui";
import { colors, spacing } from "../../../theme/colors";

type Props = any;

type FilterTab = "pending" | "accepted" | "rejected";

export const PassengerRequestsScreen = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const filterTripId = route.params?.tripId;
  const [activeTab, setActiveTab] = useState<FilterTab>("pending");

  // Modal states
  const [selectedPassenger, setSelectedPassenger] = useState<PassengerRequest | null>(null);
  const [selectedRoutePassengers, setSelectedRoutePassengers] = useState<PassengerRequest[] | null>(null);

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

  // Calculate pending count for tab badge
  const pendingCount = useMemo(() => {
    return requests.filter((r) => r.status === "pending").length;
  }, [requests]);

  // Filter requests based on active tab
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (filterTripId && r.tripId !== filterTripId) return false;
      if (activeTab === "pending") return r.status === "pending";
      if (activeTab === "accepted") return r.status === "approved" || (r.status as string) === "accepted";
      if (activeTab === "rejected") return r.status === "declined" || (r.status as string) === "rejected";
      return true;
    });
  }, [requests, filterTripId, activeTab]);

  // Group accepted requests by route (Pickup & Destination)
  const groupedAcceptedRoutes = useMemo(() => {
    const accepted = requests.filter((r) => r.status === "approved" || (r.status as string) === "accepted");
    const map = new Map<string, { pickup: string; destination: string; passengers: PassengerRequest[] }>();

    accepted.forEach((req) => {
      const key = `${req.pickupLocation}__${req.dropoffLocation}`;
      if (!map.has(key)) {
        map.set(key, {
          pickup: req.pickupLocation,
          destination: req.dropoffLocation,
          passengers: [],
        });
      }
      map.get(key)!.passengers.push(req);
    });

    return Array.from(map.values());
  }, [requests]);

  const renderEmptyState = () => {
    let title = "";
    let subtitle = "";
    let buttonTitle = "";
    let onButtonPress = () => {};

    if (activeTab === "pending") {
      title = "No Pending Requests";
      subtitle = "New booking requests will appear here for you to review and respond to.";
      buttonTitle = "View Upcoming Trips";
      onButtonPress = () => navigation.navigate("TripsTab");
    } else if (activeTab === "accepted") {
      title = "No Confirmed Bookings";
      subtitle = "Accepted booking requests will appear here for easy reference.";
      buttonTitle = "View Upcoming Trips";
      onButtonPress = () => navigation.navigate("TripsTab");
    } else {
      title = "Nothing Rejected";
      subtitle = "Any booking requests you decline will be listed here";
      buttonTitle = "View Pending Requests";
      onButtonPress = () => setActiveTab("pending");
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySub}>{subtitle}</Text>
        <AppButton
          title={buttonTitle}
          onPress={onButtonPress}
          fullWidth={false}
          style={styles.emptyBtn}
        />
      </View>
    );
  };

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "accepted", label: "Accepted" },
    { key: "rejected", label: "Rejected" },
  ];

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
        <Text style={styles.headerTitle}>Bookings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContentRow}>
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab.label}
                </Text>
                {tab.count !== undefined && tab.count > 0 && (
                  <View style={styles.badgePill}>
                    <Text style={styles.badgeText}>{tab.count}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#375DFB" style={{ marginTop: 40 }} />
      ) : activeTab === "accepted" ? (
        /* Accepted Tab View (Mockup 1) */
        groupedAcceptedRoutes.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={groupedAcceptedRoutes}
            keyExtractor={(item, index) => `${item.pickup}-${index}`}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#375DFB"]} />
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.routeCard}
                activeOpacity={0.7}
                onPress={() => setSelectedRoutePassengers(item.passengers)}
              >
                <View style={styles.timelineCol}>
                  <View style={styles.openDot} />
                  <View style={styles.dottedLine} />
                  <View style={styles.filledDot} />
                </View>

                <View style={styles.routeTextCol}>
                  <View style={styles.pointRow}>
                    <Text style={styles.pointLabel}>Pick up point</Text>
                    <Text style={styles.pointValue} numberOfLines={1}>
                      {item.pickup}
                    </Text>
                  </View>

                  <View style={styles.pointRow}>
                    <Text style={styles.pointLabel}>Destination</Text>
                    <Text style={styles.pointValue} numberOfLines={1}>
                      {item.destination}
                    </Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>
            )}
          />
        )
      ) : (
        /* Pending / Other Tabs View (Mockup 3) */
        filteredRequests.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredRequests}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#375DFB"]} />
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => setSelectedPassenger(item)}
              >
                <View style={styles.cardHeader}>
                  {/* Avatar */}
                  {item.passengerAvatar ? (
                    <Image source={{ uri: item.passengerAvatar }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <Text style={styles.avatarInitials}>{item.passengerName.charAt(0)}</Text>
                    </View>
                  )}

                  {/* Info */}
                  <View style={styles.passengerInfoCol}>
                    <View style={styles.nameRow}>
                      <Text style={styles.passengerName}>{item.passengerName}</Text>
                      {item.isVerified !== false && (
                        <View style={styles.verifiedIcon}>
                          <VerifiedBadgeIcon size={16} color="#375DFB" />
                        </View>
                      )}
                    </View>

                    <Text style={styles.routeSnippet} numberOfLines={1}>
                      {item.pickupLocation} → {item.dropoffLocation}
                    </Text>

                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={13} color="#64748B" />
                        <Text style={styles.metaText}>{item.days || "Mon, Fri"}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="person-outline" size={13} color="#64748B" />
                        <Text style={styles.metaText}>
                          {item.requestedSeats} Seat{item.requestedSeats > 1 ? "s" : ""}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Rating */}
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.ratingText}>{item.passengerRating.toFixed(1)}</Text>
                  </View>
                </View>

                {/* Actions or Status Banner */}
                {item.status === "pending" ? (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.declineBtn]}
                      onPress={(e) => {
                        e.stopPropagation();
                        respondMutation.mutate({ id: item.id, action: "decline" });
                      }}
                      disabled={respondMutation.isPending}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.acceptBtn]}
                      onPress={(e) => {
                        e.stopPropagation();
                        respondMutation.mutate({ id: item.id, action: "approve" });
                      }}
                      disabled={respondMutation.isPending}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.statusBanner,
                      item.status === "approved" || (item.status as string) === "accepted"
                        ? styles.bannerApproved
                        : styles.bannerDeclined,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBannerText,
                        item.status === "approved" || (item.status as string) === "accepted"
                          ? styles.textApproved
                          : styles.textDeclined,
                      ]}
                    >
                      Request {item.status.toUpperCase()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        )
      )}

      {/* Modals */}
      <RoutePassengersModal
        visible={!!selectedRoutePassengers}
        passengers={selectedRoutePassengers || []}
        onClose={() => setSelectedRoutePassengers(null)}
        onSelectPassenger={(passenger) => {
          setSelectedPassenger(passenger);
        }}
      />

      <PassengerDetailsModal
        visible={!!selectedPassenger}
        passenger={selectedPassenger}
        onClose={() => setSelectedPassenger(null)}
      />
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
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: { borderBottomColor: "#0F172A" },
  tabContentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tabText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#94A3B8",
  },
  activeTabText: {
    fontFamily: "DM Sans Bold",
    fontWeight: "700",
    color: "#0F172A",
  },
  badgePill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySub: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyBtn: {
    paddingHorizontal: 24,
    borderRadius: 12,
  },

  listContent: { padding: spacing.md, gap: 12 },

  /* Pending Card Styles (Mockup 3) */
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontFamily: "DM Sans Bold",
    fontSize: 20,
    color: "#64748B",
  },
  passengerInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  passengerName: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  verifiedIcon: {
    marginLeft: 2,
  },
  routeSnippet: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#64748B",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  declineBtn: {
    backgroundColor: "#FEF2F2",
  },
  acceptBtn: {
    backgroundColor: "#375DFB",
  },
  declineText: {
    fontFamily: "DM Sans Bold",
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 14,
  },
  acceptText: {
    fontFamily: "DM Sans Bold",
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  /* Accepted Route Card Styles (Mockup 1) */
  routeCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
  },
  timelineCol: {
    alignItems: "center",
    marginRight: 12,
    width: 16,
  },
  openDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#94A3B8",
    backgroundColor: "#FFF",
  },
  dottedLine: {
    width: 1,
    height: 24,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    marginVertical: 2,
  },
  filledDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#64748B",
  },
  routeTextCol: {
    flex: 1,
    gap: 12,
  },
  pointRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 8,
  },
  pointLabel: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#94A3B8",
    width: 100,
  },
  pointValue: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    flex: 1,
    textAlign: "right",
  },
  statusBanner: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  bannerApproved: { backgroundColor: "#ECFDF5" },
  bannerDeclined: { backgroundColor: "#FEF2F2" },
  statusBannerText: { fontFamily: "DM Sans Bold", fontSize: 12, fontWeight: "700" },
  textApproved: { color: colors.success },
  textDeclined: { color: "#EF4444" },
});
