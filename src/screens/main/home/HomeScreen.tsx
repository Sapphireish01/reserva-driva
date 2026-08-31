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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckIcon, StatsGridSkeleton } from "../../../components/ui";
import {
  getUserAddress,
  getUserAvatar,
  getUserFirstName,
  useAuthStore,
} from "../../../state/authStore";
import { useDriverMetricsQuery } from "../../../hooks/useDriverMetrics";

type Props = any;

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

type ScreenState =
  | "queue"
  | "empty"
  | "banner"
  | "requestModal"
  | "navigation"
  | "tripExpanded"
  | "ratePassengers";

type NavStep = "arrived" | "leaving" | "leavePassenger" | "dropOff" | "completeTrip";

export const HomeScreen = ({ navigation }: Props) => {
  const user = useAuthStore((s) => s.user);
  const firstName = getUserFirstName(user) || "Prosper";
  const address = getUserAddress(user) || "42 Montgomery Road, Yaba";
  const avatarUri = getUserAvatar(user) || DEFAULT_AVATAR;
  const isVerified = user?.is_verified ?? true;

  // Live Driver Metrics Query
  const { data: metrics, isLoading: isLoadingMetrics } = useDriverMetricsQuery();

  // Active Screen & Navigation States
  const [activeState, setActiveState] = useState<ScreenState>("queue");
  const [showBanner, setShowBanner] = useState<boolean>(!isVerified);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [navStep, setNavStep] = useState<NavStep>("arrived");

  // Rating Modal States
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [selectedPassenger, setSelectedPassenger] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [ratingStatus, setRatingStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  const handleStateChange = (state: ScreenState) => {
    setActiveState(state);
    if (state === "banner") {
      setShowBanner(true);
      setShowRequestModal(false);
      setShowRatingModal(false);
    } else if (state === "requestModal") {
      setShowBanner(false);
      setShowRequestModal(true);
      setShowRatingModal(false);
    } else if (state === "ratePassengers") {
      setShowBanner(false);
      setShowRequestModal(false);
      setShowRatingModal(true);
      setSelectedPassenger(null);
      setRating(0);
      setFeedbackText("");
      setRatingStatus("idle");
    } else {
      setShowBanner(false);
      setShowRequestModal(false);
      setShowRatingModal(false);
    }
  };

  const handleRatingSubmit = () => {
    setRatingStatus("submitting");
    setTimeout(() => {
      setRatingStatus("submitted");
      setTimeout(() => {
        setShowRatingModal(false);
        setRatingStatus("idle");
        setActiveState("queue");
      }, 1200);
    }, 1000);
  };

  const isQueueEmpty = activeState === "empty" || activeState === "banner";
  const isNavMode = activeState === "navigation" || activeState === "tripExpanded";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Interactive Demo State Bar */}
      <View style={styles.stateBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stateBarContent}>
          {(["queue", "empty", "banner", "requestModal", "navigation", "tripExpanded", "ratePassengers"] as ScreenState[]).map((st) => (
            <TouchableOpacity
              key={st}
              style={[styles.stateChip, activeState === st && styles.stateChipActive]}
              onPress={() => handleStateChange(st)}
              activeOpacity={0.7}
            >
              <Text style={[styles.stateChipText, activeState === st && styles.stateChipTextActive]}>
                {st === "queue"
                  ? "Trip Queue"
                  : st === "empty"
                  ? "Empty State"
                  : st === "banner"
                  ? "Alert Banner"
                  : st === "requestModal"
                  ? "Request Popup"
                  : st === "navigation"
                  ? "Navigation Bar"
                  : st === "tripExpanded"
                  ? "Trip Details"
                  : "Rate Passengers"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isNavMode ? (
        /* ================= IN-TRIP NAVIGATION VIEW (SCREENSHOT 5 & 6) ================= */
        <View style={styles.navContainer}>
          {/* Top Direction Banner */}
          <View style={styles.navTopBanner}>
            <View style={styles.navDirectionRow}>
              <Ionicons name="arrow-up" size={26} color="#FFFFFF" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.navDirectionSub}>toward Gbade</Text>
                <Text style={styles.navDirectionMain}>Olayode Cl</Text>
              </View>
              <View style={styles.navSparkleCircle}>
                <Ionicons name="sparkles" size={18} color="#375DFB" />
              </View>
            </View>
            <View style={styles.navThenChip}>
              <Text style={styles.navThenText}>Then ↰</Text>
            </View>
          </View>

          {/* Map Canvas Mock Background */}
          <View style={styles.mapCanvas}>
            {/* Simulated Route Line */}
            <View style={styles.mapRouteLine} />
            <View style={styles.mapCarIcon}>
              <Ionicons name="car" size={20} color="#375DFB" />
            </View>

            {/* Floating Action Controls */}
            <View style={styles.mapFloatingControls}>
              <TouchableOpacity style={styles.mapFabButton}>
                <Ionicons name="compass-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapFabButton}>
                <Ionicons name="search" size={20} color="#0F172A" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapFabButton}>
                <Ionicons name="volume-mute" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapReportButton}>
                <Ionicons name="warning" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                <Text style={styles.mapReportText}>Report</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Active Trip Action Sheet */}
          <View style={styles.navBottomSheet}>
            <View style={styles.sheetDragHandle} />

            {/* Interactive Step Switcher for In-Trip Navigation */}
            <View style={styles.stepSwitcherRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {(["arrived", "leaving", "leavePassenger", "dropOff", "completeTrip"] as NavStep[]).map((step) => (
                  <TouchableOpacity
                    key={step}
                    style={[styles.stepMiniChip, navStep === step && styles.stepMiniChipActive]}
                    onPress={() => setNavStep(step)}
                  >
                    <Text style={[styles.stepMiniText, navStep === step && styles.stepMiniTextActive]}>
                      {step === "arrived"
                        ? "Arrived"
                        : step === "leaving"
                        ? "Leaving in 4:30s"
                        : step === "leavePassenger"
                        ? "Leave Passenger"
                        : step === "dropOff"
                        ? "Drop-Off"
                        : "Complete Trip"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Trip Status Title & Subtitle */}
            <View style={styles.navSheetHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.navSheetTitle}>
                  {navStep === "dropOff"
                    ? "Driving to drop-off Prosper"
                    : navStep === "completeTrip"
                    ? "Driving to destination"
                    : "Driving to pickup Prosper"}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <Ionicons name="location-outline" size={14} color="#94A3B8" style={{ marginRight: 4 }} />
                  <Text style={styles.navSheetAddress}>
                    {navStep === "completeTrip" ? "CMS Bustop Alagomedji" : "10 Obe Street"}
                  </Text>
                </View>
              </View>
              <Text style={styles.navEtaText}>26min</Text>
            </View>

            {/* Action Button Row */}
            <View style={styles.navActionRow}>
              {navStep === "arrived" && (
                <TouchableOpacity style={styles.navPrimaryBtn} onPress={() => setNavStep("leaving")}>
                  <Text style={styles.navPrimaryBtnText}>Arrived</Text>
                </TouchableOpacity>
              )}
              {navStep === "leaving" && (
                <TouchableOpacity style={styles.navSecondaryBtn} onPress={() => setNavStep("leavePassenger")}>
                  <Text style={styles.navSecondaryBtnText}>Leaving in 4:30s</Text>
                </TouchableOpacity>
              )}
              {navStep === "leavePassenger" && (
                <TouchableOpacity style={styles.navPrimaryBtn} onPress={() => setNavStep("dropOff")}>
                  <Text style={styles.navPrimaryBtnText}>Leave Passenger</Text>
                </TouchableOpacity>
              )}
              {navStep === "dropOff" && (
                <TouchableOpacity style={styles.navPrimaryBtn} onPress={() => setNavStep("completeTrip")}>
                  <Text style={styles.navPrimaryBtnText}>Drop-Off</Text>
                </TouchableOpacity>
              )}
              {navStep === "completeTrip" && (
                <TouchableOpacity style={styles.navPrimaryBtn} onPress={() => handleStateChange("ratePassengers")}>
                  <Text style={styles.navPrimaryBtnText}>Complete Trip</Text>
                </TouchableOpacity>
              )}

              {/* Call & Message Buttons */}
              <TouchableOpacity style={styles.navIconBtn}>
                <Ionicons name="call-outline" size={20} color="#375DFB" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navIconBtn}>
                <Ionicons name="mail-outline" size={20} color="#375DFB" />
              </TouchableOpacity>
            </View>

            {/* Expanded Details View (Screenshot 6 Left) */}
            {activeState === "tripExpanded" && (
              <ScrollView style={{ maxHeight: 220, marginTop: 16 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.expandedSectionHeader}>Trip Queue</Text>
                {[
                  { name: "Prosper Edward", landmark: "Underbridge", checkedIn: true },
                  { name: "Claire Olo", landmark: "Underbridge", checkedIn: false },
                  { name: "Juniper Lee", landmark: "Underbridge", checkedIn: false },
                  { name: "Jesse Nwachukwu", landmark: "Underbridge", checkedIn: false },
                ].map((item, idx) => (
                  <View key={idx} style={styles.expandedPassengerRow}>
                    <View style={styles.expandedDot} />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.expandedPassengerName}>{item.name}</Text>
                      <Text style={styles.expandedLandmark}>Drop Off Landmark : {item.landmark}</Text>
                    </View>
                    {item.checkedIn && (
                      <View style={styles.checkedInBadge}>
                        <Text style={styles.checkedInText}>Checked-In</Text>
                      </View>
                    )}
                  </View>
                ))}

                <Text style={[styles.expandedSectionHeader, { marginTop: 16 }]}>Trip Timeline</Text>
                <View style={styles.timelineRowItem}>
                  <Text style={styles.timelineItemTitle}>• Trip Started</Text>
                  <CheckIcon size={16} />
                </View>
                <View style={styles.timelineRowItem}>
                  <Text style={styles.timelineItemTitleInactive}>◦ Pickup</Text>
                </View>
                <View style={styles.timelineRowItem}>
                  <Text style={styles.timelineItemTitleInactive}>◦ Destination</Text>
                </View>
                <View style={styles.timelineRowItem}>
                  <Text style={styles.timelineItemTitleInactive}>◦ Complete Trip</Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      ) : (
        /* ================= HOME DASHBOARD VIEW (SCREENSHOTS 1, 2, 4) ================= */
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {/* Top Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greetingTitle}>Hello {firstName},</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                <Text style={styles.locationText} numberOfLines={1}>{address}</Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
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
                  <Text style={styles.statValue}>{metrics?.total_earnings ?? 0}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Active Bookings</Text>
                  <Text style={styles.statValue}>{metrics?.active_bookings ?? 0}</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Upcoming Trips</Text>
                  <Text style={styles.statValue}>{metrics?.upcoming_trips ?? (isQueueEmpty ? 0 : 2)}</Text>
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

          {isQueueEmpty ? (
            /* Empty Queue State */
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Upcoming Trips</Text>
              <Text style={styles.emptySubtitle}>
                Schedule a trip to start receiving bookings from passengers travelling your route.
              </Text>

              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={() => navigation.navigate("CreateTrip")}
                activeOpacity={0.8}
              >
                <Text style={styles.scheduleButtonText}>Schedule Trip</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Populated Trip Queue State */
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
                    <Ionicons name="location" size={16} color="#0F172A" style={{ marginLeft: -3, marginRight: 10 }} />
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
                <TouchableOpacity
                  style={styles.startTripButton}
                  activeOpacity={0.8}
                  onPress={() => setActiveState("navigation")}
                >
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
                    <Ionicons name="location" size={16} color="#0F172A" style={{ marginLeft: -3, marginRight: 10 }} />
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
      )}

      {/* Incoming Ride Request Modal */}
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
            activeOpacity={0.7}
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
                  <CheckIcon size={16} style={{ marginLeft: 4 }} />
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.ratingText}>4.9</Text>
                  </View>
                </View>

                <Text style={styles.modalRoute}>Frebson Fitness Gym → CMS Bus Stop</Text>

                <View style={styles.modalMetaRow}>
                  <View style={styles.metaBadge}>
                    <Ionicons name="calendar-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.metaText}>Mon, Fri</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Ionicons name="person-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
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
                activeOpacity={0.8}
              >
                <Text style={styles.declineText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => setShowRequestModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rate Your Passengers Modal (Screenshots 7 & 8) */}
      <Modal
        visible={showRatingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.ratingModalBackdrop}>
          <View style={styles.ratingModalCard}>
            {/* Header */}
            <View style={styles.ratingHeaderRow}>
              {selectedPassenger ? (
                <TouchableOpacity onPress={() => setSelectedPassenger(null)} style={{ paddingRight: 8 }}>
                  <Ionicons name="arrow-back" size={20} color="#0F172A" />
                </TouchableOpacity>
              ) : null}
              <Text style={styles.ratingHeaderTitle}>Rate Your Passengers</Text>
              <TouchableOpacity onPress={() => setShowRatingModal(false)}>
                <Text style={styles.ratingCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {!selectedPassenger ? (
              /* Step 1: Passenger Selection List */
              <View style={{ marginTop: 12 }}>
                {[
                  { name: "Edward Prosper", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
                  { name: "Bessie Cooper", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
                  { name: "Darlene Robertson", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" },
                  { name: "Cody Fisher", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" },
                ].map((pass, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.passengerListItem}
                    onPress={() => setSelectedPassenger(pass.name)}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: pass.avatar }} style={styles.passengerListAvatar} />
                    <Text style={styles.passengerListName}>{pass.name}</Text>
                    <CheckIcon size={16} style={{ marginLeft: 4 }} />
                    <Ionicons name="chevron-forward" size={18} color="#94A3B8" style={{ marginLeft: "auto" }} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              /* Step 2: Rating & Feedback Form */
              <View style={{ marginTop: 16, alignItems: "center" }}>
                {/* 5 Interactive Stars */}
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <TouchableOpacity key={starIndex} onPress={() => setRating(starIndex)} activeOpacity={0.7}>
                      <Ionicons
                        name={starIndex <= rating ? "star" : "star-outline"}
                        size={32}
                        color={starIndex <= rating ? "#F59E0B" : "#CBD5E1"}
                        style={{ marginHorizontal: 4 }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.feedbackLabel}>We would love your feedback</Text>
                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={styles.textAreaInput}
                    placeholder="Tell us about your passenger"
                    placeholderTextColor="#94A3B8"
                    multiline
                    maxLength={200}
                    value={feedbackText}
                    onChangeText={setFeedbackText}
                  />
                  <Text style={styles.charCounterText}>{feedbackText.length}/200</Text>
                </View>

                {/* Submit Button with Loading & Success States */}
                <TouchableOpacity
                  style={[
                    styles.submitRatingBtn,
                    rating === 0 && styles.submitRatingBtnDisabled,
                    ratingStatus === "submitted" && styles.submitRatingBtnSuccess,
                  ]}
                  onPress={handleRatingSubmit}
                  disabled={rating === 0 || ratingStatus !== "idle"}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitRatingBtnText}>
                    {ratingStatus === "submitting"
                      ? "Submit "
                      : ratingStatus === "submitted"
                      ? "Submitted "
                      : "Submit"}
                  </Text>
                  {ratingStatus === "submitted" && (
                    <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  )}
                </TouchableOpacity>
              </View>
            )}
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

  stateBar: { backgroundColor: "#F8FAFC", borderBottomWidth: 1, borderBottomColor: "#F1F5F9", paddingVertical: 8 },
  stateBarContent: { paddingHorizontal: 16, gap: 8 },
  stateChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: "#F1F5F9" },
  stateChipActive: { backgroundColor: "#375DFB" },
  stateChipText: { fontFamily: "DM Sans Bold", fontSize: 12, fontWeight: "600", color: "#64748B" },
  stateChipTextActive: { color: "#FFFFFF" },

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
  avatarContainer: { width: 40, height: 40, borderRadius: 20, overflow: "hidden", backgroundColor: "#E2E8F0", borderWidth: 1, borderColor: "#E2E8F0" },
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
  emptySubtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", textAlign: "center", marginBottom: 24, lineHeight: 20, maxWidth: 320 },
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

  /* Navigation / Map Styles */
  navContainer: { flex: 1, backgroundColor: "#064E3B" },
  navTopBanner: { backgroundColor: "#064E3B", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  navDirectionRow: { flexDirection: "row", alignItems: "center" },
  navDirectionSub: { fontFamily: "DM Sans", fontSize: 14, color: "#A7F3D0" },
  navDirectionMain: { fontFamily: "DM Sans Bold", fontSize: 22, fontWeight: "700", color: "#FFFFFF" },
  navSparkleCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" },
  navThenChip: { backgroundColor: "rgba(255, 255, 255, 0.15)", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 10 },
  navThenText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#FFFFFF" },
  mapCanvas: { flex: 1, backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center", position: "relative" },
  mapRouteLine: { width: "80%", height: 6, backgroundColor: "#38BDF8", borderRadius: 3 },
  mapCarIcon: { position: "absolute", top: "45%", left: "55%", width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" },
  mapFloatingControls: { position: "absolute", right: 16, bottom: 20, gap: 10, alignItems: "center" },
  mapFabButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#334155" },
  mapReportButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#0F172A", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#334155" },
  mapReportText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#FFFFFF" },
  navBottomSheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  sheetDragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#CBD5E1", alignSelf: "center", marginBottom: 12 },
  stepSwitcherRow: { marginBottom: 14 },
  stepMiniChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: "#F1F5F9" },
  stepMiniChipActive: { backgroundColor: "#375DFB" },
  stepMiniText: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B" },
  stepMiniTextActive: { fontFamily: "DM Sans Bold", color: "#FFFFFF" },
  navSheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  navSheetTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  navSheetAddress: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },
  navEtaText: { fontFamily: "DM Sans Bold", fontSize: 16, color: "#375DFB" },
  navActionRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  navPrimaryBtn: { flex: 1, backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  navPrimaryBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
  navSecondaryBtn: { flex: 1, backgroundColor: "#EFF6FF", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  navSecondaryBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#375DFB", fontWeight: "700" },
  navIconBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#DBEAFE" },

  /* Expanded Sheet Styles */
  expandedSectionHeader: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#0F172A", marginBottom: 10 },
  expandedPassengerRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  expandedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#94A3B8" },
  expandedPassengerName: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A" },
  expandedLandmark: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B" },
  checkedInBadge: { backgroundColor: "#DCFCE7", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  checkedInText: { fontFamily: "DM Sans Bold", fontSize: 11, color: "#16A34A" },
  timelineRowItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  timelineItemTitle: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A" },
  timelineItemTitleInactive: { fontFamily: "DM Sans", fontSize: 13, color: "#94A3B8" },

  /* Modal Styles */
  modalBackdrop: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.65)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  modalCloseButton: { position: "absolute", top: 54, right: 24, zIndex: 10 },
  modalCard: { width: "100%", backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 10 },
  modalHeader: { flexDirection: "row", gap: 14 },
  passengerAvatar: { width: 56, height: 56, borderRadius: 12, backgroundColor: "#E2E8F0" },
  passengerInfo: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  passengerName: { fontFamily: "DM Sans Bold", fontSize: 16, fontWeight: "700", color: "#0F172A" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginLeft: "auto", gap: 3 },
  ratingText: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#0F172A" },
  modalRoute: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B", marginTop: 4 },
  modalMetaRow: { flexDirection: "row", gap: 12, marginTop: 10 },
  metaBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  metaText: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B" },
  modalActionsRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  declineButton: { flex: 1, backgroundColor: "#FEF2F2", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  declineText: { fontFamily: "DM Sans Bold", color: "#EF4444", fontSize: 15, fontWeight: "700" },
  acceptButton: { flex: 1, backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  acceptText: { fontFamily: "DM Sans Bold", color: "#FFFFFF", fontSize: 15, fontWeight: "700" },

  /* Rating Modal Styles (Screenshots 7 & 8) */
  ratingModalBackdrop: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.65)", justifyContent: "flex-end" },
  ratingModalCard: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, minHeight: 380 },
  ratingHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#F1F5F9", paddingBottom: 16 },
  ratingHeaderTitle: { fontFamily: "DM Sans Bold", fontSize: 18, color: "#0F172A", flex: 1 },
  ratingCancelText: { fontFamily: "DM Sans", fontSize: 15, color: "#64748B" },
  passengerListItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 14, backgroundColor: "#F8FAFC", borderRadius: 14, marginBottom: 10 },
  passengerListAvatar: { width: 44, height: 44, borderRadius: 10, marginRight: 12 },
  passengerListName: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#0F172A" },
  starsRow: { flexDirection: "row", marginBottom: 16, marginTop: 8 },
  feedbackLabel: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#0F172A", alignSelf: "flex-start", marginBottom: 10 },
  textAreaContainer: { width: "100%", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 14, padding: 14, backgroundColor: "#FFFFFF", marginBottom: 20 },
  textAreaInput: { fontFamily: "DM Sans", fontSize: 14, color: "#0F172A", minHeight: 90, textAlignVertical: "top" },
  charCounterText: { fontFamily: "DM Sans", fontSize: 12, color: "#94A3B8", alignSelf: "flex-end", marginTop: 4 },
  submitRatingBtn: { width: "100%", backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  submitRatingBtnDisabled: { backgroundColor: "#F1F5F9" },
  submitRatingBtnSuccess: { backgroundColor: "#375DFB" },
  submitRatingBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
});
