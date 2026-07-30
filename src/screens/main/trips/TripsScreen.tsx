import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../../../theme/colors";
import { CancelTripModal } from "./components/CancelTripModal";
import { SetAvailabilityModal } from "./components/SetAvailabilityModal";
import { TripActionSheetModal } from "./components/TripActionSheetModal";
import { TripDetailsModal } from "./components/TripDetailsModal";

type TabType = "Upcoming" | "Recurring" | "Completed" | "Cancelled";

export const TripsScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<TabType>("Upcoming");

  // Modals state
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Sample trips matching the exact spec in design images
  const [trips, setTrips] = useState<any[]>([
    {
      id: "trip-101",
      origin: "Frebson Fitness Gym",
      destination: "CMS Bus Stop Lagos Island",
      seatsRemaining: 2,
      totalSeats: 4,
      departureTime: "10:30AM",
      date: "Tomorrow",
      status: "scheduled",
      isRecurring: true,
      frequency: "Mon, Wed, Fri • Weekly",
      endDate: "27 Apr 2026",
      estimatedEarnings: "42.15",
      pricePerSeat: "12.15",
      isPaused: false,
    },
    {
      id: "trip-102",
      origin: "Frebson Fitness Gym",
      destination: "CMS Bus Stop Lagos Island",
      seatsRemaining: 2,
      totalSeats: 4,
      departureTime: "10:30AM",
      date: "30 Mar 2026",
      status: "scheduled",
      isRecurring: false,
      estimatedEarnings: "25.00",
      pricePerSeat: "12.50",
      isPaused: false,
    },
  ]);

  const handleAddTrip = (newTripData: any) => {
    const newTrip = {
      id: `trip-${Date.now()}`,
      origin: newTripData.pickupLocation,
      destination: newTripData.destination,
      seatsRemaining: 3,
      totalSeats: 4,
      departureTime: newTripData.departureTime,
      date: newTripData.date,
      status: "scheduled",
      isRecurring: newTripData.isRecurring,
      frequency: newTripData.frequency || "Daily",
      endDate: newTripData.endDate,
      estimatedEarnings: "36.45",
      pricePerSeat: "12.15",
      isPaused: false,
    };
    setTrips([newTrip, ...trips]);
  };

  const handleStartTrip = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: "completed" } : t))
    );
  };

  const handleTogglePause = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, isPaused: !t.isPaused } : t))
    );
  };

  const handleConfirmCancel = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: "cancelled" } : t))
    );
  };

  // Filter trips per tab
  const filteredTrips = trips.filter((t) => {
    if (activeTab === "Upcoming") return t.status === "scheduled" && !t.isRecurring;
    if (activeTab === "Recurring") return t.isRecurring && t.status === "scheduled";
    if (activeTab === "Completed") return t.status === "completed";
    if (activeTab === "Cancelled") return t.status === "cancelled";
    return false;
  });

  const emptyStateConfig: Record<TabType, { title: string; subtitle: string }> = {
    Upcoming: {
      title: "Ready for Your Next Trip?",
      subtitle: "Schedule a trip and let passengers reserve seats before you hit the road.",
    },
    Recurring: {
      title: "No Recurring Trips",
      subtitle: "Schedule a trip to start receiving bookings from passengers travelling your route.",
    },
    Completed: {
      title: "No Trips Yet",
      subtitle: "Your completed trips, passenger ratings, and earnings will appear here.",
    },
    Cancelled: {
      title: "No Cancelled Trips",
      subtitle: "Cancelled trips will appear here.",
    },
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{emptyStateConfig[activeTab].title}</Text>
      <Text style={styles.emptySubtitle}>{emptyStateConfig[activeTab].subtitle}</Text>
      <TouchableOpacity
        style={styles.setAvailabilityBtn}
        onPress={() => setShowAvailabilityModal(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.setAvailabilityBtnText}>Set Availability</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTripCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => {
        setSelectedTrip(item);
        setShowActionSheet(true);
      }}
      activeOpacity={0.85}
    >
      {/* Route Row: Origin -> Destination */}
      <View style={styles.routeHeaderRow}>
        <Text style={styles.routeName} numberOfLines={1}>
          {item.origin}
        </Text>
        <Ionicons name="arrow-forward" size={14} color="#64748B" style={styles.arrowIcon} />
        <Text style={styles.routeName} numberOfLines={1}>
          {item.destination}
        </Text>
      </View>

      {/* Seats Remaining Row */}
      <View style={styles.seatsRow}>
        <Ionicons name="people-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
        <Text style={styles.seatsText}>Seats Remaining: {item.seatsRemaining}</Text>
      </View>

      {/* Date, Time & Pill Badge Row */}
      <View style={styles.cardFooter}>
        <View style={styles.dateTimeGroup}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" style={{ marginRight: 5 }} />
            <Text style={styles.metaText}>{item.date}</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#64748B" style={{ marginRight: 5 }} />
            <Text style={styles.metaText}>{item.departureTime}</Text>
          </View>
        </View>

        {/* Pill Badge */}
        {item.isRecurring ? (
          <View style={styles.pillRecurring}>
            <Text style={styles.pillRecurringText}>Recurring Trip</Text>
          </View>
        ) : (
          <View style={styles.pillOneTime}>
            <Text style={styles.pillOneTimeText}>One Time Trip</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trips</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsRow}>
        {(["Upcoming", "Recurring", "Completed", "Cancelled"] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {filteredTrips.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredTrips}
          keyExtractor={(item) => item.id}
          renderItem={renderTripCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* 1. Set Availability Modal */}
      <SetAvailabilityModal
        visible={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        onSubmit={handleAddTrip}
      />

      {/* 2. Trip Action Options Sheet */}
      <TripActionSheetModal
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        trip={selectedTrip}
        onViewDetails={() => setShowDetailsModal(true)}
        onStartTrip={() => selectedTrip && handleStartTrip(selectedTrip.id)}
        onEditTrip={() => setShowAvailabilityModal(true)}
        onTogglePause={() => selectedTrip && handleTogglePause(selectedTrip.id)}
        onCancelTrip={() => setShowCancelModal(true)}
      />

      {/* 3. Full Trip Details Modal */}
      <TripDetailsModal
        visible={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        trip={selectedTrip}
        onStartTrip={() => selectedTrip && handleStartTrip(selectedTrip.id)}
        onTogglePause={() => selectedTrip && handleTogglePause(selectedTrip.id)}
      />

      {/* 4. Cancel Trip Confirmation Sheet */}
      <CancelTripModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirmCancel={() => selectedTrip && handleConfirmCancel(selectedTrip.id)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    // borderBottomWidth: 1,
    // borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
  },
  tabItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabItemActive: {
    borderBottomColor: "#0F172A",
  },
  tabText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#CDD0D5",
    fontWeight: "500",
  },
  tabTextActive: {
    fontFamily: "DM Sans Bold",
    color: colors.dark,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    lineHeight: 17,
    fontWeight: "500",
    color: colors.dark,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: colors.grey,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 12,
    maxWidth: 328,
  },
  setAvailabilityBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  setAvailabilityBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  listContent: {
    padding: spacing.md,
  },
  tripCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  routeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  routeName: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    flexShrink: 1,
  },
  arrowIcon: {
    marginHorizontal: 8,
  },
  seatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  seatsText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#868C98",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateTimeGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
  },
  pillRecurring: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BEDBFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillRecurringText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#375DFB",
    fontWeight: "500",
  },
  pillOneTime: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillOneTimeText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
