import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PassengerDetailsModal } from "../../../../components/bookings/PassengerDetailsModal";
import { spacing } from "../../../../theme/colors";
import { useDriverBookingsQuery } from "../../../../hooks/useDriverTrips";
import { DriverBookingItem } from "../../../../api/services/trips";

interface TripDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  trip: any;
  onStartTrip: () => void;
  onTogglePause: () => void;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
  visible,
  onClose,
  trip,
  onStartTrip,
  onTogglePause,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedPassenger, setSelectedPassenger] = useState<any | null>(null);

  const { data: serverBookings = [] } = useDriverBookingsQuery(
    trip?.id ? { trip_id: trip.id, status: "confirmed" } : undefined
  );

  if (!trip) return null;

  const isPaused = trip.isPaused;
  const isRecurring = trip.isRecurring;

  // Map server bookings or fallback to trip.passengers
  const passengers = React.useMemo(() => {
    if (Array.isArray(serverBookings) && serverBookings.length > 0) {
      return serverBookings.map((b: DriverBookingItem) => ({
        id: String(b.id),
        passengerName: b.customer_name || "Passenger",
        passengerRating: parseFloat(String(b.customer_rating || "5.0")),
        passengerAvatar: b.customer_profile_image || undefined,
        isVerified: true,
        memberSince: "2026",
        completedTrips: 12,
        reliability: "98%",
        requestedSeats: b.seats_requested || 1,
        frequency: "Scheduled Trip",
        endDate: b.end_date || "",
        pickupLocation: b.pickup_location || trip.origin || "Pickup Location",
        dropoffLocation: b.dropoff_location || trip.destination || "Destination",
        status: b.status,
      }));
    }
    return trip.passengers || [];
  }, [serverBookings, trip]);

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <Text style={styles.headerTitle}>Trip Details</Text>
                {isPaused ? (
                  <View style={[styles.badge, styles.badgePaused]}>
                    <Text style={styles.badgePausedText}>Paused</Text>
                  </View>
                ) : isRecurring ? (
                  <View style={[styles.badge, styles.badgeRecurring]}>
                    <Text style={styles.badgeRecurringText}>Recurring Trip</Text>
                  </View>
                ) : (
                  <View style={[styles.badge, styles.badgeOneTime]}>
                    <Text style={styles.badgeOneTimeText}>One Time Trip</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 560 }}>
              {/* Estimated Earnings Card */}
              <View style={styles.earningsCard}>
                <Text style={styles.earningsLabel}>Estimated Earnings</Text>
                <Text style={styles.earningsAmount}>${trip.estimatedEarnings || "42.15"}</Text>
              </View>

              {/* Route Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Route</Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.locationLabelRow}>
                  <View style={styles.hollowCircle} />
                  <Text style={styles.detailLabel}>Pickup Location</Text>
                </View>
                <Text style={styles.detailValue}>{trip.origin || "Frebson Fitness Gym"}</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.locationLabelRow}>
                  <View style={styles.solidDot} />
                  <Text style={styles.detailLabel}>Destination</Text>
                </View>
                <Text style={styles.detailValue}>{trip.destination || "42, Montgomery Road Yaba"}</Text>
              </View>

              {/* Pricing Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Pricing</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Price per seat</Text>
                <Text style={styles.detailValue}>${trip.pricePerSeat || "12.15"}</Text>
              </View>

              {/* Schedule Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Schedule</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{trip.departureTime || "10:30 AM"}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Start Date</Text>
                <Text style={styles.detailValue}>{trip.date || "30 Mar 2026"}</Text>
              </View>

              {isRecurring && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Frequency</Text>
                    <Text style={styles.detailValue}>{trip.frequency || "Mon, Wed, Fri • Weekly"}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>End Date</Text>
                    <Text style={styles.detailValue}>{trip.endDate || "27 Apr 2026"}</Text>
                  </View>
                </>
              )}

              {/* Bookings Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Bookings</Text>
              </View>
              <View style={styles.bookingsBox}>
                <Text style={styles.bookingsText}>
                  {trip.bookedSeats || 3} of {trip.totalSeats || 4} Seats Booked
                </Text>
              </View>

              {/* Passengers Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Passengers</Text>
              </View>
              {passengers.map((p: any) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.passengerRow}
                  onPress={() => setSelectedPassenger(p)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: p.passengerAvatar }} style={styles.passengerAvatar} />
                  <View style={styles.passengerInfo}>
                    <Text style={styles.passengerName}>{p.passengerName}</Text>
                    <Text style={styles.passengerSeats}>{p.requestedSeats} Seat(s)</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ))}

              {/* Primary Action Button */}
              <TouchableOpacity
                style={styles.startTripBtn}
                onPress={() => {
                  onClose();
                  onStartTrip();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.startTripBtnText}>Start Trip</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Passenger Details Modal */}
      <PassengerDetailsModal
        visible={Boolean(selectedPassenger)}
        onClose={() => setSelectedPassenger(null)}
        passenger={selectedPassenger}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  cancelText: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: "#64748B",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeRecurring: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BEDBFF",
  },
  badgeRecurringText: {
    fontFamily: "DM Sans Bold",
    fontSize: 11,
    color: "#375DFB",
    fontWeight: "600",
  },
  badgePaused: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FFD6A8",
  },
  badgePausedText: {
    fontFamily: "DM Sans Bold",
    fontSize: 11,
    color: "#F54900",
    fontWeight: "600",
  },
  badgeOneTime: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
  badgeOneTimeText: {
    fontFamily: "DM Sans Bold",
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  earningsCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  earningsLabel: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#64748B",
    marginBottom: 4,
  },
  earningsAmount: {
    fontFamily: "DM Sans Bold",
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
  },
  sectionHeader: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: -spacing.lg,
    marginVertical: 10,
  },
  sectionHeaderText: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    color: "#868C98",
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  locationLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hollowCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
  },
  solidDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0F172A",
  },
  detailLabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
  },
  detailValue: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },
  bookingsBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginVertical: 8,
  },
  bookingsText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  passengerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  passengerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#E2E8F0",
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "600",
  },
  passengerSeats: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#64748B",
  },
  startTripBtn: {
    backgroundColor: "#375DFB",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 8,
  },
  startTripBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
