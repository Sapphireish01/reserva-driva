import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Linking,
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

interface PassengerDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  passenger: PassengerRequest | null;
  onReport?: (passenger: PassengerRequest) => void;
}

export const PassengerDetailsModal: React.FC<PassengerDetailsModalProps> = ({
  visible,
  onClose,
  passenger,
  onReport,
}) => {
  const insets = useSafeAreaInsets();

  if (!passenger) return null;

  const handleCall = () => {
    Linking.openURL("tel:+1234567890");
  };

  const handleMessage = () => {
    Linking.openURL("sms:+1234567890");
  };

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
          {/* Top Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.iconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={22} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{passenger.passengerName}</Text>
              {passenger.isVerified !== false && (
                <View style={styles.verifiedIcon}>
                  <VerifiedBadgeIcon size={18} color="#375DFB" />
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Profile Overview Card */}
            <View style={styles.profileSection}>
              <View style={styles.avatarWrapper}>
                {passenger.passengerAvatar ? (
                  <Image
                    source={{ uri: passenger.passengerAvatar }}
                    style={styles.largeAvatar}
                  />
                ) : (
                  <View style={[styles.largeAvatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarInitials}>
                      {passenger.passengerName.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.profileDetailsCol}>
                {/* Report Button */}
                <TouchableOpacity
                  style={styles.reportBtn}
                  onPress={() => onReport && onReport(passenger)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.reportText}>Report</Text>
                  <Ionicons name="flag-outline" size={14} color="#EF4444" />
                </TouchableOpacity>

                <View style={styles.statsContainer}>
                  <Text style={styles.statLine}>
                    Member since {passenger.memberSince || "2026"}
                  </Text>
                  <Text style={styles.statLine}>
                    {passenger.completedTrips || 42} Completed trips
                  </Text>
                  <Text style={styles.statLine}>
                    {passenger.reliability || "98%"} Booking Reliability
                  </Text>

                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#F59E0B" />
                    <Text style={styles.ratingText}>
                      {passenger.passengerRating.toFixed(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Current Booking Header Bar */}
            <View style={styles.sectionHeaderBar}>
              <Text style={styles.sectionHeaderText}>Current Booking</Text>
            </View>

            {/* Current Booking Details Table */}
            <View style={styles.bookingDetailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Number of Seats</Text>
                <Text style={styles.detailValue}>{passenger.requestedSeats}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Frequency</Text>
                <Text style={styles.detailValue}>
                  {passenger.frequency || "Mon, Wed • Weekly"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>End Date</Text>
                <Text style={styles.detailValue}>
                  {passenger.endDate || "27 Apr 2026"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Pickup Location</Text>
                <Text style={styles.detailValue}>{passenger.pickupLocation}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Destination</Text>
                <Text style={styles.detailValue}>{passenger.dropoffLocation}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Action Buttons */}
          <View style={styles.bottomActionsContainer}>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" />
              <Text style={styles.callBtnText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.messageBtn}
              onPress={handleMessage}
              activeOpacity={0.8}
            >
              <Ionicons name="mail" size={18} color="#375DFB" />
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
          </View>
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
    height: "90%",
    paddingTop: 16,
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
  iconBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  verifiedIcon: {
    marginLeft: 2,
  },
  cancelText: {
    fontFamily: "DM Sans",
    fontSize: 16,
    color: "#64748B",
  },
  body: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    padding: 20,
    alignItems: "flex-start",
  },
  avatarWrapper: {
    marginRight: 16,
  },
  largeAvatar: {
    width: 130,
    height: 130,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontFamily: "DM Sans Bold",
    fontSize: 36,
    color: "#64748B",
  },
  profileDetailsCol: {
    flex: 1,
    justifyContent: "space-between",
  },
  reportBtn: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    marginBottom: 12,
  },
  reportText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "500",
  },
  statsContainer: {
    gap: 6,
  },
  statLine: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#334155",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  sectionHeaderBar: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginVertical: 8,
  },
  sectionHeaderText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  bookingDetailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  detailLabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
    flex: 1,
  },
  detailValue: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    textAlign: "right",
    flex: 1.2,
  },
  bottomActionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
  },
  callBtn: {
    backgroundColor: "#375DFB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  callBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  messageBtn: {
    backgroundColor: "#EFF6FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  messageBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: "#375DFB",
  },
});
