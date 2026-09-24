import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
import { ActiveTripData, TripWaypoint } from "../../mock/activeTripMock";
import { CarIcon } from "./CarIcon";

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

// Clean daylight style JSON
const LIGHT_MAP_STYLE = [
  {
    elementType: "geometry",
    stylers: [{ color: "#F8FAFC" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748B" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#FFFFFF" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#CBD5E1" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#EEF2F6" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748B" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#FFFFFF" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#E2E8F0" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#E2E8F0" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#CBD5E1" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#E2E8F0" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#BAE6FD" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#0284C7" }],
  },
];

interface LiveRouteMapProps {
  tripData: ActiveTripData;
  activeWaypointIndex?: number;
  theme?: "light" | "dark" | "system";
  onSelectWaypoint?: (waypoint: TripWaypoint) => void;
  onReportIncident?: () => void;
  onSearchPress?: () => void;
}

export const LiveRouteMap: React.FC<LiveRouteMapProps> = ({
  tripData,
  activeWaypointIndex = 1,
  theme = "system",
  onSelectWaypoint,
  onReportIncident,
  onSearchPress,
}) => {
  const systemScheme = useColorScheme();
  const isDark = theme === "system" ? systemScheme === "dark" : theme === "dark";

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
  }, [tripData.id, tripData.routeCoordinates.length]);

  const polylineGlowColor = isDark ? "rgba(0, 229, 255, 0.35)" : "rgba(48, 92, 255, 0.22)";
  const polylinePrimaryColor = isDark ? "#00E5FF" : "#305CFF";

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        customMapStyle={isDark ? NIGHT_MAP_STYLE : LIGHT_MAP_STYLE}
        showsCompass={false}
        showsTraffic={false}
        showsUserLocation={false}
      >
        {/* Glow / Casing Route Polyline */}
        <Polyline
          coordinates={tripData.routeCoordinates}
          strokeColor={polylineGlowColor}
          strokeWidth={8}
          lineCap="round"
          lineJoin="round"
        />

        {/* Primary Route Polyline following established corridor */}
        <Polyline
          coordinates={tripData.routeCoordinates}
          strokeColor={polylinePrimaryColor}
          strokeWidth={4.5}
          lineCap="round"
          lineJoin="round"
        />

        {/* Start / Origin Marker */}
        <Marker
          coordinate={tripData.originCoordinates}
          title="Trip Origin"
          description={tripData.origin}
        >
          <View style={styles.originMarkerBadge}>
            <View style={styles.originInnerCircle} />
          </View>
        </Marker>

        {/* All Passenger Pickups */}
        {tripData.passengers.map((passenger, index) => (
          <Marker
            key={`pickup-${passenger.id || index}`}
            coordinate={passenger.pickupCoordinates}
            title={`Pickup: ${passenger.name}`}
            description={passenger.pickupLocation}
          >
            <View style={styles.pickupMarkerContainer}>
              <View style={styles.pickupMarkerPin}>
                <Ionicons name="person" size={12} color="#FFFFFF" />
              </View>
              <View style={styles.pickupMarkerCallout}>
                <Text style={styles.pickupMarkerText} numberOfLines={1}>
                  {passenger.name.split(" ")[0]}
                </Text>
              </View>
            </View>
          </Marker>
        ))}

        {/* Intermediate Route Stops */}
        {tripData.waypoints
          .filter((wp) => wp.type !== "origin" && wp.type !== "destination" && !wp.passengerId)
          .map((stop, index) => (
            <Marker
              key={`stop-${stop.id || index}`}
              coordinate={stop.coordinates}
              title={stop.title}
              description={stop.subtitle}
            >
              <View style={styles.stopMarkerPin}>
                <Text style={styles.stopMarkerNumber}>{index + 1}</Text>
              </View>
            </Marker>
          ))}

        {/* Target Destination Marker */}
        <Marker coordinate={tripData.destinationCoordinates} title="Destination" description={tripData.destination}>
          <View style={[styles.targetDestinationPin, !isDark && styles.targetDestinationPinLight]}>
            <View style={[styles.targetInnerDot, !isDark && styles.targetInnerDotLight]} />
          </View>
        </Marker>

        {/* Moving Car Vehicle Marker */}
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
          <View style={styles.carMarkerWrapper}>
            {/* Front Headlight Projection Beam */}
            <View
              style={[
                styles.headlightCone,
                isDark ? styles.headlightConeDark : styles.headlightConeLight,
              ]}
            />

            {/* Soft Shadow / Halo for Contrast */}
            <View
              style={[
                styles.carShadowHalo,
                isDark ? styles.carShadowHaloDark : styles.carShadowHaloLight,
              ]}
            />

            {/* Exact SVG Car Graphic from assets/icons/car_icon.svg */}
            <CarIcon size={44} />
          </View>
        </Marker>
      </MapView>

      {/* Floating Right Map Controls */}
      <View style={styles.rightControlsContainer}>
        {/* Compass Widget */}
        <TouchableOpacity
          style={[styles.circleBtn, isDark ? styles.circleBtnDark : styles.circleBtnLight]}
          onPress={recenterDriver}
          activeOpacity={0.8}
        >
          <View style={styles.compassNeedleNorth} />
          <View style={[styles.compassNeedleSouth, !isDark && styles.compassNeedleSouthLight]} />
        </TouchableOpacity>

        {/* Search / Fit Route Bounds Button */}
        <TouchableOpacity
          style={[styles.circleBtn, isDark ? styles.circleBtnDark : styles.circleBtnLight]}
          onPress={onSearchPress || fitRouteBounds}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={20} color={isDark ? "#FFFFFF" : "#0F172A"} />
        </TouchableOpacity>

        {/* Mute Audio Toggle */}
        <TouchableOpacity
          style={[styles.circleBtn, isDark ? styles.circleBtnDark : styles.circleBtnLight]}
          onPress={() => setIsMuted((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isMuted ? "volume-mute" : "volume-mute-outline"}
            size={20}
            color={isMuted ? "#EF4444" : isDark ? "#FFFFFF" : "#0F172A"}
          />
        </TouchableOpacity>

        {/* Report Hazard Pill Button */}
        <TouchableOpacity
          style={[styles.reportPillBtn, isDark ? styles.reportPillBtnDark : styles.reportPillBtnLight]}
          onPress={onReportIncident}
          activeOpacity={0.8}
        >
          <Ionicons name="warning" size={16} color="#F59E0B" />
          <Text style={[styles.reportBtnText, isDark ? styles.reportBtnTextDark : styles.reportBtnTextLight]}>
            Report
          </Text>
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
  originMarkerBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#10B981",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  originInnerCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  pickupMarkerContainer: {
    alignItems: "center",
  },
  pickupMarkerPin: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  pickupMarkerCallout: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
    maxWidth: 80,
  },
  pickupMarkerText: {
    fontFamily: "DM Sans Bold",
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  stopMarkerPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#3B82F6",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  stopMarkerNumber: {
    fontFamily: "DM Sans Bold",
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  targetDestinationPin: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0, 229, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00E5FF",
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  targetDestinationPinLight: {
    backgroundColor: "rgba(48, 92, 255, 0.25)",
    borderColor: "#305CFF",
    shadowColor: "#305CFF",
  },
  targetInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00E5FF",
  },
  targetInnerDotLight: {
    backgroundColor: "#305CFF",
  },

  // Vehicle Car Marker
  carMarkerWrapper: {
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  headlightCone: {
    position: "absolute",
    top: 0,
    width: 28,
    height: 20,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  headlightConeDark: {
    backgroundColor: "rgba(0, 229, 255, 0.25)",
  },
  headlightConeLight: {
    backgroundColor: "rgba(48, 92, 255, 0.2)",
  },
  carShadowHalo: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  carShadowHaloDark: {
    backgroundColor: "rgba(0, 229, 255, 0.12)",
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  carShadowHaloLight: {
    backgroundColor: "rgba(15, 23, 42, 0.08)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  // Right Floating Controls Stack
  rightControlsContainer: {
    position: "absolute",
    right: 16,
    bottom: 230,
    alignItems: "center",
    gap: 12,
  },
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  circleBtnDark: {
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  circleBtnLight: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
  compassNeedleSouthLight: {
    borderTopColor: "#64748B",
  },
  reportPillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  reportPillBtnDark: {
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  reportPillBtnLight: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  reportBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "700",
  },
  reportBtnTextDark: {
    color: "#FFFFFF",
  },
  reportBtnTextLight: {
    color: "#0F172A",
  },
});
