import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = any;

// Demo preview states matching the user's 4 screenshot frames
type ScreenState = "banner" | "empty" | "queue" | "requestModal";

export const HomeScreen = ({ navigation }: Props) => {
  const [activeState, setActiveState] = useState<ScreenState>("queue");
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);

  const handleStateChange = (state: ScreenState) => {
    setActiveState(state);
    if (state === "banner") {
      setShowBanner(true);
      setShowRequestModal(false);
    } else if (state === "empty") {
      setShowBanner(false);
      setShowRequestModal(false);
    } else if (state === "queue") {
      setShowBanner(false);
      setShowRequestModal(false);
    } else if (state === "requestModal") {
      setShowBanner(false);
      setShowRequestModal(true);
    }
  };

  const isQueueEmpty = activeState === "empty" || activeState === "banner";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* State Switcher Bar for easy demoing of all 4 designs */}
      {/* <View style={styles.stateBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stateBarContent}>
          <TouchableOpacity
            style={[styles.stateChip, activeState === "banner" && styles.stateChipActive]}
            onPress={() => handleStateChange("banner")}
          >
            <Text style={[styles.stateChipText, activeState === "banner" && styles.stateChipTextActive]}>
              1. Profile Banner
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stateChip, activeState === "empty" && styles.stateChipActive]}
            onPress={() => handleStateChange("empty")}
          >
            <Text style={[styles.stateChipText, activeState === "empty" && styles.stateChipTextActive]}>
              2. Empty Queue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stateChip, activeState === "queue" && styles.stateChipActive]}
            onPress={() => handleStateChange("queue")}
          >
            <Text style={[styles.stateChipText, activeState === "queue" && styles.stateChipTextActive]}>
              3. Trip Queue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stateChip, activeState === "requestModal" && styles.stateChipActive]}
            onPress={() => handleStateChange("requestModal")}
          >
            <Text style={[styles.stateChipText, activeState === "requestModal" && styles.stateChipTextActive]}>
              4. Ride Request Modal
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View> */}

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingTitle}>Hello Prosper,</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
              <Text style={styles.locationText}>42 Montgomery Road, Yaba</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellButton}>
              <Ionicons name="notifications-outline" size={22} color="#0F172A" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.avatarContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Completion Alert Banner (Screen 1) */}
        {showBanner && (
          <TouchableOpacity style={styles.bannerCard} activeOpacity={0.8}>
            <Text style={styles.bannerText}>Complete your profile to start accepting requests.</Text>
            <Ionicons name="arrow-forward" size={18} color="#2563EB" />
          </TouchableOpacity>
        )}

        {/* 2x2 Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Earnings</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Active Bookings</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Upcoming Trips</Text>
              <Text style={styles.statValue}>{isQueueEmpty ? "0" : "2"}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Completed Trips</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
        </View>

        {/* Trip Queue Section */}
        <Text style={styles.sectionTitle}>Trip Queue</Text>

        {isQueueEmpty ? (
          /* Empty Queue State (Screen 2) */
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Upcoming Trips</Text>
            <Text style={styles.emptySubtitle}>
              Schedule a trip to start receiving bookings from passengers travelling your route.
            </Text>

            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => navigation.navigate("CreateTrip")}
            >
              <Text style={styles.scheduleButtonText}>Schedule Trip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Populated Trip Queue State (Screen 3) */
          <View style={styles.queueContainer}>
            {/* Card 1: Ready To Go */}
            <View style={styles.tripCard}>
              <View style={styles.badgeRow}>
                <View style={styles.readyBadge}>
                  <Text style={styles.readyBadgeText}>Ready To Go</Text>
                </View>
              </View>

              {/* Timeline */}
              <View style={styles.timelineContainer}>
                <View style={styles.timelineItem}>
                  <View style={styles.circleDot} />
                  <View style={styles.timelineTextContainer}>
                    <Text style={styles.timelineLabel}>Pick up point</Text>
                    <Text style={styles.timelineLocation}>Frebson Fitness Gym</Text>
                  </View>
                </View>

                <View style={styles.timelineLine} />

                <View style={styles.timelineItem}>
                  <Ionicons name="location" size={14} color="#0F172A" style={{ marginLeft: -1, marginRight: 11 }} />
                  <View style={styles.timelineTextContainer}>
                    <Text style={styles.timelineLabel}>Destination</Text>
                    <Text style={styles.timelineLocation}>42, Montgomery Road Yaba</Text>
                  </View>
                </View>
              </View>

              {/* Sub Info Grid */}
              <View style={styles.tripInfoBox}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Departure</Text>
                  <Text style={styles.infoValue}>10:30AM</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Seats Remaining</Text>
                  <Text style={styles.infoValue}>1 of 4</Text>
                </View>
              </View>

              {/* Action Button */}
              <TouchableOpacity style={styles.startTripButton}>
                <Text style={styles.startTripText}>Start Trip</Text>
              </TouchableOpacity>
            </View>

            {/* Card 2: Up Next */}
            <View style={styles.tripCard}>
              <View style={styles.badgeRow}>
                <View style={styles.upNextBadge}>
                  <Text style={styles.upNextBadgeText}>Up Next</Text>
                </View>
              </View>

              {/* Timeline */}
              <View style={styles.timelineContainer}>
                <View style={styles.timelineItem}>
                  <View style={styles.circleDot} />
                  <View style={styles.timelineTextContainer}>
                    <Text style={styles.timelineLabel}>Pick up point</Text>
                    <Text style={styles.timelineLocation}>Frebson Fitness Gym</Text>
                  </View>
                </View>

                <View style={styles.timelineLine} />

                <View style={styles.timelineItem}>
                  <Ionicons name="location" size={14} color="#0F172A" style={{ marginLeft: -1, marginRight: 11 }} />
                  <View style={styles.timelineTextContainer}>
                    <Text style={styles.timelineLabel}>Destination</Text>
                    <Text style={styles.timelineLocation}>43, Montgomery Road Yaba</Text>
                  </View>
                </View>
              </View>

              {/* Sub Info Grid */}
              <View style={styles.tripInfoBox}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Departure</Text>
                  <Text style={styles.infoValue}>2 Jul 2026 9:00AM</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Seats Remaining</Text>
                  <Text style={styles.infoValue}>2 of 4</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Incoming Ride Request Modal (Screen 4) */}
      <Modal
        visible={showRequestModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRequestModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowRequestModal(false)}
          >
            <Ionicons name="close-circle" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                }}
                style={styles.passengerAvatar}
              />
              <View style={styles.passengerInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.passengerName}>Edward Prosper</Text>
                  <Ionicons name="checkmark-circle" size={16} color="#2563EB" style={{ marginLeft: 4 }} />
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color="#F59E0B" />
                    <Text style={styles.ratingText}>4.9</Text>
                  </View>
                </View>

                <Text style={styles.modalRoute}>Frebson Fitness Gym → CMS Bus Stop</Text>

                <View style={styles.modalMetaRow}>
                  <View style={styles.metaBadge}>
                    <Ionicons name="calendar-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.metaText}>Mon - Fri</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Ionicons name="person-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.metaText}>1 Seat</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => setShowRequestModal(false)}
              >
                <Text style={styles.declineText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => setShowRequestModal(false)}
              >
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  contentContainer: { paddingHorizontal: 16, paddingBottom: 24 },

  stateBar: { backgroundColor: "#F8FAFC", borderBottomWidth: 1, borderBottomColor: "#E2E8F0", paddingVertical: 8 },
  stateBarContent: { paddingHorizontal: 16, gap: 8 },
  stateChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: "#E2E8F0" },
  stateChipActive: { backgroundColor: "#2563EB" },
  stateChipText: { fontSize: 12, fontWeight: "600", color: "#475569" },
  stateChipTextActive: { color: "#FFFFFF" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  headerLeft: { flex: 1 },
  greetingTitle: { fontSize: 22, fontWeight: "700", color: "#0F172A" },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { fontSize: 13, color: "#64748B", fontWeight: "400" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  bellButton: { padding: 4 },
  avatarContainer: { width: 38, height: 38, borderRadius: 19, overflow: "hidden", backgroundColor: "#E2E8F0" },
  avatarImage: { width: "100%", height: "100%" },

  bannerCard: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  bannerText: { fontSize: 13, fontWeight: "600", color: "#2563EB", flex: 1, marginRight: 8 },

  statsGrid: { marginBottom: 20 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
  },
  statLabel: { fontSize: 12, color: "#64748B", marginBottom: 6, fontWeight: "400" },
  statValue: { fontSize: 20, fontWeight: "700", color: "#0F172A" },

  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 12 },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: "#64748B", textAlign: "center", marginBottom: 20, lineHeight: 18 },
  scheduleButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
  scheduleButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },

  queueContainer: { gap: 16 },
  tripCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 16,
  },
  badgeRow: { flexDirection: "row", marginBottom: 12 },
  readyBadge: { backgroundColor: "#EFF6FF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  readyBadgeText: { fontSize: 12, fontWeight: "600", color: "#2563EB" },
  upNextBadge: { backgroundColor: "#F1F5F9", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  upNextBadgeText: { fontSize: 12, fontWeight: "600", color: "#64748B" },

  timelineContainer: { marginBottom: 16 },
  timelineItem: { flexDirection: "row", alignItems: "center" },
  circleDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: "#64748B", marginRight: 12 },
  timelineLine: { width: 1, height: 16, backgroundColor: "#CBD5E1", marginLeft: 4, marginVertical: 2 },
  timelineTextContainer: { flex: 1 },
  timelineLabel: { fontSize: 11, color: "#94A3B8" },
  timelineLocation: { fontSize: 13, fontWeight: "600", color: "#0F172A" },

  tripInfoBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexDirection: "row",
    padding: 12,
    justifyContent: "space-between",
  },
  infoCol: { flex: 1, alignItems: "center" },
  infoLabel: { fontSize: 11, color: "#64748B", marginBottom: 4 },
  infoValue: { fontSize: 13, fontWeight: "600", color: "#0F172A" },

  startTripButton: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  startTripText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },

  /* Modal Styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCloseButton: { position: "absolute", top: 50, right: 24, zIndex: 10 },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: { flexDirection: "row", gap: 12 },
  passengerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#E2E8F0" },
  passengerInfo: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  passengerName: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginLeft: "auto", gap: 2 },
  ratingText: { fontSize: 13, fontWeight: "600", color: "#0F172A" },
  modalRoute: { fontSize: 12, color: "#64748B", marginTop: 4 },
  modalMetaRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  metaBadge: { flexDirection: "row", alignItems: "center" },
  metaText: { fontSize: 12, color: "#64748B" },

  modalActionsRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  declineButton: {
    flex: 1,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  declineText: { color: "#EF4444", fontSize: 14, fontWeight: "600" },
  acceptButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  acceptText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
});
