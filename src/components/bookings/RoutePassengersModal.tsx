import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
import { PassengerRequest } from "../../api/services/trips";
import { VerifiedBadgeIcon } from "../ProfileIcons";
import { colors, spacing } from "../../theme/colors";

interface RoutePassengersModalProps {
  visible: boolean;
  onClose: () => void;
  passengers: PassengerRequest[];
  onSelectPassenger: (passenger: PassengerRequest) => void;
}

export const RoutePassengersModal: React.FC<RoutePassengersModalProps> = ({
  visible,
  onClose,
  passengers,
  onSelectPassenger,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Passengers</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Passenger List */}
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {passengers.map((passenger) => {
              const isConfirmed = passenger.status === "approved";
              return (
                <TouchableOpacity
                  key={passenger.id}
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() => onSelectPassenger(passenger)}
                >
                  <View style={styles.cardHeader}>
                    {/* Avatar */}
                    {passenger.passengerAvatar ? (
                      <Image
                        source={{ uri: passenger.passengerAvatar }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarInitials}>
                          {passenger.passengerName.charAt(0)}
                        </Text>
                      </View>
                    )}

                    {/* Middle Info */}
                    <View style={styles.infoCol}>
                      <View style={styles.nameRow}>
                        <Text style={styles.passengerName} numberOfLines={1}>
                          {passenger.passengerName}
                        </Text>
                        {passenger.isVerified !== false && (
                          <View style={styles.verifiedIcon}>
                            <VerifiedBadgeIcon size={16} color="#375DFB" />
                          </View>
                        )}
                      </View>

                      <View style={styles.routeRow}>
                        <Text style={styles.routeText} numberOfLines={1}>
                          {passenger.pickupLocation} → {passenger.dropoffLocation}
                        </Text>
                      </View>

                      <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                          <Ionicons name="calendar-outline" size={13} color="#64748B" />
                          <Text style={styles.detailText}>{passenger.days || "Mon, Fri"}</Text>
                        </View>

                        <View style={styles.detailItem}>
                          <Ionicons name="person-outline" size={13} color="#64748B" />
                          <Text style={styles.detailText}>
                            {passenger.requestedSeats} Seat{passenger.requestedSeats > 1 ? "s" : ""}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Right side: Star rating & Status badge */}
                    <View style={styles.rightCol}>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color="#F59E0B" />
                        <Text style={styles.ratingText}>
                          {passenger.passengerRating.toFixed(1)}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          isConfirmed ? styles.confirmedBadge : styles.cancelledBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            isConfirmed ? styles.confirmedText : styles.cancelledText,
                          ]}
                        >
                          {isConfirmed ? "Confirmed" : "Cancelled"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingTop: 10,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: {
    fontFamily: "DM Sans Bold",
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  cancelText: {
    fontFamily: "DM Sans",
    fontSize: 16,
    color: "#64748B",
  },
  list: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
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
  infoCol: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passengerName: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginRight: 4,
  },
  verifiedIcon: {
    marginLeft: 2,
  },
  routeText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  routeRow: {
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#64748B",
  },
  rightCol: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 56,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  confirmedBadge: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  cancelledBadge: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statusBadgeText: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    fontWeight: "600",
  },
  confirmedText: {
    color: "#10B981",
  },
  cancelledText: {
    color: "#94A3B8",
  },
});
