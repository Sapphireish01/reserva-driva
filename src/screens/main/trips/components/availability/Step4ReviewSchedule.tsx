import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Step4ReviewScheduleProps {
  price: string;
  pickup: string;
  destination: string;
  time: string;
  dateFormatted: string;
  frequency: string;
  isRecurring: boolean;
  endDateFormatted: string;
  availableSeats: string;
  vehicleLabel?: string;
  publishStatus: "idle" | "publishing" | "published";
  onPublish: () => void;
}

export const Step4ReviewSchedule: React.FC<Step4ReviewScheduleProps> = ({
  price,
  pickup,
  destination,
  time,
  dateFormatted,
  frequency,
  isRecurring,
  endDateFormatted,
  availableSeats,
  vehicleLabel,
  publishStatus,
  onPublish,
}) => {
  const cleanPriceVal = price.replace(/[^0-9.]/g, "");
  const formattedPrice = cleanPriceVal ? parseFloat(cleanPriceVal).toFixed(2) : "0.00";
  const numSeats = parseInt(availableSeats, 10) || 1;

  return (
    <>
      {/* Price Per Seat Card */}
      <View style={styles.reviewPriceCard}>
        <Text style={styles.reviewPriceLabel}>Price Per Seat</Text>
        <Text style={styles.reviewPriceValue}>${formattedPrice}</Text>
      </View>

      {/* Route Information */}
      <View style={styles.routeContainer}>
        {/* Pickup Row */}
        <View style={styles.routeRow}>
          <View style={styles.dotIconCol}>
            <View style={styles.pickupDot} />
            <View style={styles.dottedLine} />
          </View>
          <Text style={styles.routeLabel}>Pickup Location</Text>
          <Text style={styles.routeValue} numberOfLines={1}>
            {pickup}
          </Text>
        </View>

        {/* Destination Row */}
        <View style={styles.routeRow}>
          <View style={styles.dotIconCol}>
            <View style={styles.destinationDot} />
          </View>
          <Text style={styles.routeLabel}>Destination</Text>
          <Text style={styles.routeValue} numberOfLines={1}>
            {destination}
          </Text>
        </View>
      </View>

      {/* Summary Details */}
      <View style={styles.summaryList}>
        {Boolean(vehicleLabel) && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Vehicle</Text>
            <Text style={styles.summaryValue} numberOfLines={1}>
              {vehicleLabel}
            </Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Time</Text>
          <Text style={styles.summaryValue}>{time}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Start Date</Text>
          <Text style={styles.summaryValue}>{dateFormatted}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Frequency</Text>
          <Text style={styles.summaryValue}>{frequency}</Text>
        </View>

        {isRecurring && endDateFormatted ? (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>End Date</Text>
            <Text style={styles.summaryValue}>{endDateFormatted}</Text>
          </View>
        ) : null}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Available Seats</Text>
          <Text style={styles.summaryValue}>
            {availableSeats} {numSeats === 1 ? "seat" : "seats"}
          </Text>
        </View>
      </View>

      {/* Publish Button with Animated States */}
      <TouchableOpacity
        style={[
          styles.continueBtn,
          publishStatus !== "idle" && styles.publishBtnActive,
          { marginTop: 24 },
        ]}
        disabled={publishStatus !== "idle"}
        onPress={onPublish}
        activeOpacity={0.8}
      >
        <View style={styles.publishBtnContent}>
          <Text style={styles.continueBtnText}>
            {publishStatus === "publishing"
              ? "Publishing"
              : publishStatus === "published"
              ? "Published"
              : "Publish"}
          </Text>
          {publishStatus === "publishing" && (
            <ActivityIndicator size="small" color="#FFFFFF" style={{ marginLeft: 8 }} />
          )}
          {publishStatus === "published" && (
            <View style={styles.publishedBadge}>
              <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  reviewPriceCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  reviewPriceLabel: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#64748B",
    marginBottom: 4,
  },
  reviewPriceValue: {
    fontFamily: "DM Sans Bold",
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },
  routeContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dotIconCol: {
    width: 20,
    alignItems: "center",
    marginRight: 10,
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#94A3B8",
    backgroundColor: "#FFFFFF",
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#64748B",
  },
  dottedLine: {
    width: 1,
    height: 16,
    backgroundColor: "#CBD5E1",
    marginVertical: 2,
  },
  routeLabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#94A3B8",
    width: 120,
  },
  routeValue: {
    flex: 1,
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    textAlign: "right",
  },
  summaryList: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  summaryLabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#94A3B8",
  },
  summaryValue: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  continueBtn: {
    backgroundColor: "#375DFB",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  continueBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  publishBtnActive: {
    backgroundColor: "#375DFB",
  },
  publishBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  publishedBadge: {
    marginLeft: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
});
