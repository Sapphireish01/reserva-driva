import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
import { ActiveTripData, TripWaypoint } from "../../mock/activeTripMock";
import { colors } from "../../theme/colors";

// Dark night mode style JSON matching the design screenshot
const NIGHT_MAP_STYLE = [
  {
    elementType: "geometry",
    stylers: [{ color: "#0D1B2A" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#8E9EB5" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#0D1B2A" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#1B2A4A" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#122338" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7085A0" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#162E4D" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0F2036" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8E9EB5" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#1F3E68" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#152C4A" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#172A42" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#091420" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#455E7A" }],
  },
];

interface LiveRouteMapProps {
  tripData: ActiveTripData;
  activeWaypointIndex?: number;
  onSelectWaypoint?: (waypoint: TripWaypoint) => void;
  onReportIncident?: () => void;
  onSearchPress?: () => void;
}

export const LiveRouteMap: React.FC<LiveRouteMapProps> = ({
  tripData,
  activeWaypointIndex = 1,
  onSelectWaypoint,
  onReportIncident,
  onSearchPress,
}) => {
  const mapRef = useRef<MapView | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const initialRegion = {
    latitude: tripData.driverLocation.latitude,
    longitude: tripData.driverLocation.longitude,
    latitudeDelta: 0.045,
    longitudeDelta: 0.045,
  };

  const fitRouteBounds = () => {
    if (!mapRef.current || !tripData.routeCoordinates.length) return;
    mapRef.current.fitToCoordinates(tripData.routeCoordinates, {
      edgePadding: {
        top: 140,
        right: 50,
        bottom: 280,
        left: 50,
      },
      animated: true,
    });
  };

  const recenterDriver = () => {
    if (!mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: tripData.driverLocation.latitude,
        longitude: tripData.driverLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      600
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fitRouteBounds();
    }, 500);
    return () => clearTimeout(timer);
  }, [tripData.id]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        customMapStyle={NIGHT_MAP_STYLE}
        showsCompass={false}
        showsTraffic={false}
        showsUserLocation={false}
      >
        {/* Glow / Casing Route Polyline */}
        <Polyline
          coordinates={tripData.routeCoordinates}
          strokeColor="rgba(0, 229, 255, 0.35)"
          strokeWidth={8}
          lineCap="round"
          lineJoin="round"
        />

        {/* Primary Neon Cyan Route Polyline */}
        <Polyline
          coordinates={tripData.routeCoordinates}
          strokeColor="#00E5FF"
          strokeWidth={4.5}
          lineCap="round"
          lineJoin="round"
        />

        {/* Target Destination Marker */}
        <Marker coordinate={tripData.destinationCoordinates} title="Destination">
          <View style={styles.targetDestinationPin}>
            <View style={styles.targetInnerDot} />
          </View>
        </Marker>

        {/* Current Pickup Marker */}
        <Marker
          coordinate={tripData.passengers[0].pickupCoordinates}
          title={tripData.passengers[0].pickupLocation}
        >
          <View style={styles.targetPickupPin}>
            <View style={styles.targetPickupInnerDot} />
          </View>
        </Marker>

        {/* 3D Car Vehicle Marker with Headlights */}
        <Marker
          coordinate={{
            latitude: tripData.driverLocation.latitude,
            longitude: tripData.driverLocation.longitude,
          }}
          anchor={{ x: 0.5, y: 0.5 }}
          flat
          rotation={tripData.driverLocation.heading}
          title="Vehicle"
        >
          <View style={styles.carMarkerContainer}>
            <View style={styles.headlightBeam} />
            <View style={styles.carBody}>
              {/* Windshield & Roof */}
              <View style={styles.windshield} />
              <View style={styles.tailLightsRow}>
                <View style={styles.tailLight} />
                <View style={styles.tailLight} />
              </View>
            </View>
          </View>
        </Marker>
      </MapView>

      {/* Floating Right Map Controls (Screenshot Match) */}
      <View style={styles.rightControlsContainer}>
        {/* Compass Widget */}
        <TouchableOpacity
          style={styles.circleDarkBtn}
          onPress={recenterDriver}
          activeOpacity={0.8}
        >
          <View style={styles.compassNeedleNorth} />
          <View style={styles.compassNeedleSouth} />
        </TouchableOpacity>

        {/* Search / Zoom Button */}
        <TouchableOpacity
          style={styles.circleDarkBtn}
          onPress={onSearchPress || fitRouteBounds}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Mute Audio Toggle */}
        <TouchableOpacity
          style={styles.circleDarkBtn}
          onPress={() => setIsMuted((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isMuted ? "volume-mute" : "volume-mute-outline"}
            size={20}
            color={isMuted ? "#EF4444" : "#FFFFFF"}
          />
        </TouchableOpacity>

        {/* Report Hazard Pill Button */}
        <TouchableOpacity
          style={styles.reportPillBtn}
          onPress={onReportIncident}
          activeOpacity={0.8}
        >
          <Ionicons name="warning" size={16} color="#F59E0B" />
          <Text style={styles.reportBtnText}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  targetDestinationPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0, 229, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#00E5FF",
  },
  targetInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00E5FF",
  },
  targetPickupPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  targetPickupInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0F172A",
  },

  // 3D Styled Vehicle Marker
  carMarkerContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  headlightBeam: {
    position: "absolute",
    top: 2,
    width: 24,
    height: 16,
    backgroundColor: "rgba(0, 229, 255, 0.25)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  carBody: {
    width: 22,
    height: 34,
    borderRadius: 6,
    backgroundColor: "#0F172A",
    borderWidth: 1.5,
    borderColor: "#38BDF8",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  windshield: {
    width: 14,
    height: 8,
    borderRadius: 2,
    backgroundColor: "#38BDF8",
    opacity: 0.8,
  },
  tailLightsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 16,
    paddingHorizontal: 1,
  },
  tailLight: {
    width: 4,
    height: 2.5,
    borderRadius: 1,
    backgroundColor: "#EF4444",
  },

  // Right Floating Controls Stack
  rightControlsContainer: {
    position: "absolute",
    right: 16,
    bottom: 230,
    alignItems: "center",
    gap: 12,
  },
  circleDarkBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  compassNeedleNorth: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 11,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#EF4444",
  },
  compassNeedleSouth: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 11,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFFFFF",
  },
  reportPillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1E293B",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  reportBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
