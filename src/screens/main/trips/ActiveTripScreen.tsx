import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LiveRouteMap } from "../../../components/map/LiveRouteMap";
import {
  ActiveTripData,
  MOCK_ACTIVE_TRIP,
} from "../../../mock/activeTripMock";
import { MainStackParamList } from "../../../navigation/types";
import { colors, palette } from "../../../theme/colors";
import { RatePassengersModal } from "./components/RatePassengersModal";

type Props = NativeStackScreenProps<MainStackParamList, "ActiveTrip">;

type NavState =
  | "driving_to_pickup"
  | "arrived_waiting"
  | "leave_passenger"
  | "driving_to_dropoff"
  | "driving_to_destination";

function calculateBearing(
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number }
): number {
  const startLat = (start.latitude * Math.PI) / 180;
  const startLng = (start.longitude * Math.PI) / 180;
  const endLat = (end.latitude * Math.PI) / 180;
  const endLng = (end.longitude * Math.PI) / 180;
  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

export const ActiveTripScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [tripData, setTripData] = useState<ActiveTripData>(MOCK_ACTIVE_TRIP);
  const [navState, setNavState] = useState<NavState>("driving_to_pickup");
  const [countdownSeconds, setCountdownSeconds] = useState(270); // 4 mins 30s
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const activePassenger = tripData.passengers[0]; // Prosper Edward

  // Moving driver along route coordinates simulation
  const segmentRef = useRef(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const isMoving =
      navState === "driving_to_pickup" ||
      navState === "leave_passenger" ||
      navState === "driving_to_dropoff" ||
      navState === "driving_to_destination";

    if (!isMoving) return;

    const interval = setInterval(() => {
      const coords = tripData.routeCoordinates;
      if (!coords || coords.length < 2) return;

      const maxSegment =
        navState === "driving_to_pickup"
          ? 1
          : coords.length - 2;

      let seg = segmentRef.current;
      let prog = progressRef.current + 0.05;

      if (prog >= 1) {
        if (seg < maxSegment) {
          seg += 1;
          prog = 0;
        } else {
          prog = 1;
        }
      }

      segmentRef.current = seg;
      progressRef.current = prog;

      const p1 = coords[seg];
      const p2 = coords[Math.min(seg + 1, coords.length - 1)];

      const lat = p1.latitude + (p2.latitude - p1.latitude) * prog;
      const lng = p1.longitude + (p2.longitude - p1.longitude) * prog;
      const heading = calculateBearing(p1, p2);

      setTripData((prev) => ({
        ...prev,
        driverLocation: {
          ...prev.driverLocation,
          latitude: lat,
          longitude: lng,
          heading: Math.round(heading),
          speedKmH: 38,
        },
      }));
    }, 700);

    return () => clearInterval(interval);
  }, [navState, tripData.routeCoordinates]);

  // Countdown simulation
  useEffect(() => {
    let interval: any;
    if (navState === "arrived_waiting") {
      interval = setInterval(() => {
        setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [navState]);

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}s`;
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`);
  };

  const handleMessage = (phone: string) => {
    Linking.openURL(`sms:${phone.replace(/\s+/g, "")}`);
  };

  const handleReportIncident = () => {
    Alert.alert(
      "Report Incident",
      "Report traffic, road hazard, or passenger issue to dispatch.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Heavy Traffic / Roadblock",
          onPress: () => Alert.alert("Reported", "Traffic status updated for other drivers."),
        },
        {
          text: "Passenger No-Show",
          onPress: () => setNavState("leave_passenger"),
        },
      ]
    );
  };

  const handlePrimaryButtonPress = () => {
    if (navState === "driving_to_pickup") {
      setNavState("arrived_waiting");
    } else if (navState === "arrived_waiting") {
      setNavState("leave_passenger");
    } else if (navState === "leave_passenger") {
      setNavState("driving_to_dropoff");
    } else if (navState === "driving_to_dropoff") {
      setNavState("driving_to_destination");
    } else if (navState === "driving_to_destination") {
      setShowRatingModal(true);
    }
  };

  const getPrimaryButtonLabel = () => {
    switch (navState) {
      case "driving_to_pickup":
        return "Arrived";
      case "arrived_waiting":
        return `Leaving in ${formatCountdown(countdownSeconds)}`;
      case "leave_passenger":
        return "Leave Passenger";
      case "driving_to_dropoff":
        return "Drop-Off";
      case "driving_to_destination":
        return "Complete Trip";
      default:
        return "Complete Trip";
    }
  };

  const getStateTitle = () => {
    switch (navState) {
      case "driving_to_pickup":
      case "arrived_waiting":
      case "leave_passenger":
        return "Driving to pickup Prosper";
      case "driving_to_dropoff":
        return "Driving to drop-off Prosper";
      case "driving_to_destination":
        return "Driving to destination";
      default:
        return "Driving to destination";
    }
  };

  const getStateAddress = () => {
    if (navState === "driving_to_destination") {
      return "CMS Bustop Alagomedji";
    }
    return "10 Obe Street";
  };

  const isDestinationState = navState === "driving_to_destination";
  const isLeavingCountdown = navState === "arrived_waiting";

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0B192C" : "#F8FAFC" }]}>
      {/* Dynamic Themed Map Layer */}
      <LiveRouteMap
        tripData={tripData}
        onReportIncident={handleReportIncident}
      />

      {/* Top Turn-By-Turn Guidance Card (Screenshot Match) */}
      <View style={[styles.topGuidanceContainer, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.guidanceCard}>
          {/* Main Turn Direction Row */}
          <View style={styles.guidanceMainRow}>
            <View style={styles.maneuverIconBox}>
              <Ionicons name="arrow-up" size={28} color="#FFFFFF" />
            </View>

            <View style={styles.guidanceTextBox}>
              <Text style={styles.towardLabel}>toward</Text>
              <Text style={styles.streetNameText} numberOfLines={1}>
                {tripData.nextStreet}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.starCircleBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert("Route AI", "Optimal fast route via expressway is active.")}
            >
              <Ionicons name="sparkles" size={18} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {/* Sub Maneuver Pill */}
          <View style={styles.subManeuverPill}>
            <Text style={styles.subManeuverLabel}>Then</Text>
            <Ionicons name="arrow-undo" size={14} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Bottom Floating Action Card / Sheet (Exact Screenshot Match) */}
      <View
        style={[
          styles.bottomCard,
          sheetExpanded && styles.bottomCardExpanded,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        {/* Top Drag Handle */}
        <TouchableOpacity
          style={styles.handleTouchArea}
          onPress={() => setSheetExpanded((prev) => !prev)}
          activeOpacity={0.8}
        >
          <View style={styles.dragHandle} />
        </TouchableOpacity>

        {/* Scrollable Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.sheetScrollContent}
        >
          {/* Header Row: Title & 26min ETA */}
          <View style={styles.headerRow}>
            <Text style={styles.stateTitleText}>{getStateTitle()}</Text>
            <Text style={styles.etaBlueText}>26min</Text>
          </View>

          {/* Location Pin Row */}
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color="#64748B" />
            <Text style={styles.locationAddressText} numberOfLines={1}>
              {getStateAddress()}
            </Text>
          </View>

          {/* Action Button Row */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                isDestinationState && styles.primaryBtnFullWidth,
                isLeavingCountdown && styles.primaryBtnLeaving,
              ]}
              onPress={handlePrimaryButtonPress}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  isLeavingCountdown && styles.primaryBtnTextLeaving,
                ]}
              >
                {getPrimaryButtonLabel()}
              </Text>
            </TouchableOpacity>

            {!isDestinationState && (
              <>
                {/* Secondary Call Button: White background with crisp blue border */}
                <TouchableOpacity
                  style={styles.callSquareBtn}
                  onPress={() => handleCall(activePassenger.phone)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="call-outline" size={22} color="#305CFF" />
                </TouchableOpacity>

                {/* Secondary Message Button: Light ice-blue background with NO border */}
                <TouchableOpacity
                  style={styles.messageSquareBtn}
                  onPress={() => handleMessage(activePassenger.phone)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="mail-outline" size={22} color="#305CFF" />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Expanded Section: Trip Queue & Trip Timeline (Exact Match) */}
          {sheetExpanded && (
            <View style={styles.expandedContent}>
              {/* 1. Trip Queue Section Header Strip */}
              <View style={styles.sectionHeaderStrip}>
                <Text style={styles.sectionHeaderText}>Trip Queue</Text>
              </View>

              <View style={styles.queueContainer}>
                {/* Prosper Edward */}
                <View style={styles.queueItem}>
                  <View style={styles.timelineDotFilled} />
                  <View style={styles.queueItemBody}>
                    <View style={styles.queueItemHeader}>
                      <Text style={styles.passengerTitle}>Prosper Edward</Text>
                      <View style={styles.checkedInPill}>
                        <Text style={styles.checkedInText}>Checked-In</Text>
                      </View>
                    </View>
                    <Text style={styles.landmarkText}>Drop Off Landmark : Underbridge</Text>
                  </View>
                </View>
                <View style={styles.dashedConnector} />

                {/* Claire Olo */}
                <View style={styles.queueItem}>
                  <View style={styles.timelineDotEmpty} />
                  <View style={styles.queueItemBody}>
                    <Text style={styles.passengerTitle}>Claire Olo</Text>
                    <Text style={styles.landmarkText}>Pickup Landmark : Underbridge</Text>
                  </View>
                </View>
                <View style={styles.dashedConnector} />

                {/* Juniper Lee */}
                <View style={styles.queueItem}>
                  <View style={styles.timelineDotEmpty} />
                  <View style={styles.queueItemBody}>
                    <Text style={styles.passengerTitle}>Juniper Lee</Text>
                    <Text style={styles.landmarkText}>Pickup Landmark : Underbridge</Text>
                  </View>
                </View>
                <View style={styles.dashedConnector} />

                {/* Jesse Nwachukwu */}
                <View style={styles.queueItem}>
                  <View style={styles.timelineDotEmpty} />
                  <View style={styles.queueItemBody}>
                    <Text style={styles.passengerTitle}>Jesse Nwachukwu</Text>
                    <Text style={styles.landmarkText}>Pickup Landmark : Underbridge</Text>
                  </View>
                </View>
              </View>

              {/* 2. Trip Timeline Section Header Strip */}
              <View style={styles.sectionHeaderStrip}>
                <Text style={styles.sectionHeaderText}>Trip Timeline</Text>
              </View>

              <View style={styles.timelineContainer}>
                <View style={styles.timelineRow}>
                  <View style={styles.timelineDotFilled} />
                  <Text style={styles.timelineStepName}>Trip Started</Text>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#22C55E"
                    style={{ marginLeft: "auto" }}
                  />
                </View>
                <View style={styles.dashedConnectorShort} />

                <View style={styles.timelineRow}>
                  <View style={styles.timelineDotEmpty} />
                  <Text style={styles.timelineStepNameInactive}>Pickup</Text>
                </View>
                <View style={styles.dashedConnectorShort} />

                <View style={styles.timelineRow}>
                  <View style={styles.timelineDotEmpty} />
                  <Text style={styles.timelineStepNameInactive}>Destination</Text>
                </View>
                <View style={styles.dashedConnectorShort} />

                <View style={styles.timelineRow}>
                  <View style={styles.timelineDotEmpty} />
                  <Text style={styles.timelineStepNameInactive}>Complete Trip</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Post-Trip Passenger Rating Flow Modal */}
      <RatePassengersModal
        visible={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          navigation.navigate("MainTabs");
        }}
        passengers={tripData.passengers}
        origin={tripData.origin}
        destination={tripData.destination}
        onFinishAllRatings={() => {
          setShowRatingModal(false);
          navigation.navigate("MainTabs");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B192C",
  },

  // Top Turn-by-Turn Guidance Banner
  topGuidanceContainer: {
    position: "absolute",
    top: 0,
    left: 14,
    right: 14,
  },
  guidanceCard: {
    backgroundColor: "#00382E",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  guidanceMainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  maneuverIconBox: {
    width: 34,
    alignItems: "center",
    marginRight: 10,
  },
  guidanceTextBox: {
    flex: 1,
  },
  towardLabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#A7F3D0",
  },
  streetNameText: {
    fontFamily: "DM Sans Bold",
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 1,
  },
  starCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  subManeuverPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  subManeuverLabel: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Bottom Control Card
  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 8,
    maxHeight: "52%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
  },
  bottomCardExpanded: {
    maxHeight: "84%",
  },
  handleTouchArea: {
    paddingVertical: 8,
    alignItems: "center",
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
  },
  sheetScrollContent: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    marginTop: 4,
  },
  stateTitleText: {
    fontFamily: "DM Sans Bold",
    fontSize: 19,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
  },
  etaBlueText: {
    fontFamily: "DM Sans Bold",
    fontSize: 19,
    fontWeight: "700",
    color: "#2F60FF",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  locationAddressText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
    flex: 1,
  },

  // Action Button Row
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  primaryBtn: {
    flex: 1,
    height: 54,
    backgroundColor: "#305CFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#305CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryBtnFullWidth: {
    flex: 1,
  },
  primaryBtnLeaving: {
    backgroundColor: "#EBF2FF",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  primaryBtnTextLeaving: {
    color: "#305CFF",
  },
  callSquareBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#305CFF",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  messageSquareBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#EBF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  // Expanded Sections
  expandedContent: {
    marginTop: 8,
    marginHorizontal: -18,
  },
  sectionHeaderStrip: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    fontWeight: "500",
    color: "#71717A",
  },
  queueContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  queueItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineDotFilled: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#64748B",
    marginTop: 4,
    marginRight: 14,
  },
  timelineDotEmpty: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    backgroundColor: "#FFFFFF",
    marginTop: 4,
    marginRight: 14,
  },
  dashedConnector: {
    width: 1,
    height: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    marginLeft: 4,
    marginVertical: 2,
  },
  dashedConnectorShort: {
    width: 1,
    height: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    marginLeft: 4,
    marginVertical: 2,
  },
  queueItemBody: {
    flex: 1,
  },
  queueItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passengerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  checkedInPill: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#86EFAC",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  checkedInText: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    fontWeight: "600",
    color: "#16A34A",
  },
  landmarkText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },

  // Timeline Container Styles
  timelineContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timelineStepName: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  timelineStepNameInactive: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
  },
});
