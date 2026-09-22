import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PassengerToRate } from "../../../../api/services/trips";
import {
  usePassengersToRateQuery,
  useRatePassengerMutation,
} from "../../../../hooks/useDriverTrips";
import { TripPassenger } from "../../../../mock/activeTripMock";
import { colors, palette } from "../../../../theme/colors";

interface RatePassengersModalProps {
  visible: boolean;
  onClose: () => void;
  tripId?: number | string;
  passengers?: TripPassenger[];
  origin?: string;
  destination?: string;
  onFinishAllRatings: () => void;
}

type SubmitStatus = "idle" | "loading" | "submitted";

export const RatePassengersModal: React.FC<RatePassengersModalProps> = ({
  visible,
  onClose,
  tripId,
  passengers: fallbackPassengers = [],
  origin = "Origin",
  destination = "Destination",
  onFinishAllRatings,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedPassenger, setSelectedPassenger] = useState<PassengerToRate | null>(null);
  const [ratedPassengerIds, setRatedPassengerIds] = useState<Record<string, boolean>>({});
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  // Live Query for Passengers to Rate
  const { data: serverPassengers, isLoading } = usePassengersToRateQuery(
    tripId || "",
    visible && Boolean(tripId)
  );

  // Mutation for Rating Passenger
  const rateMutation = useRatePassengerMutation();

  // Normalize passengers from server or fallback
  const passengersList: PassengerToRate[] = useMemo(() => {
    if (serverPassengers && serverPassengers.length > 0) {
      return serverPassengers;
    }
    return fallbackPassengers.map((p) => ({
      booking_id: String(p.id),
      full_name: p.name,
      is_verified: true,
      profile_picture: p.avatar || null,
    }));
  }, [serverPassengers, fallbackPassengers]);

  const handleSelectPassenger = (p: PassengerToRate) => {
    setSelectedPassenger(p);
    setRating(5);
    setFeedback("");
    setSubmitStatus("idle");
  };

  const handleBackToList = () => {
    setSelectedPassenger(null);
    setSubmitStatus("idle");
  };

  const handleSubmitRating = async () => {
    if (!selectedPassenger || rating === 0 || submitStatus === "loading") return;

    setSubmitStatus("loading");
    try {
      await rateMutation.mutateAsync({
        booking_id: selectedPassenger.booking_id,
        stars: rating,
        feedback: feedback.trim() || undefined,
      });

      setSubmitStatus("submitted");
      const nextRated = { ...ratedPassengerIds, [selectedPassenger.booking_id]: true };
      setRatedPassengerIds(nextRated);

      setTimeout(() => {
        setSelectedPassenger(null);
        setSubmitStatus("idle");

        // If all passengers are rated, auto-complete the flow
        if (passengersList.every((p) => nextRated[p.booking_id])) {
          onFinishAllRatings();
        }
      }, 1000);
    } catch (err) {
      console.warn("❌ Failed to rate passenger:", err);
      setSubmitStatus("idle");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheetContainer,
            { paddingBottom: Math.max(insets.bottom, 24), paddingTop: Math.max(insets.top, 16) },
          ]}
        >
          {/* Top Sheet Drag Handle */}
          <View style={styles.sheetHandle} />

          {/* Header Row */}
          <View style={styles.headerRow}>
            {selectedPassenger ? (
              <TouchableOpacity
                style={styles.backArrowBtn}
                onPress={handleBackToList}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={22} color={colors.dark} />
              </TouchableOpacity>
            ) : null}

            <Text style={styles.headerTitle}>Rate Your Passengers</Text>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* View 1: Passenger Selection List */}
          {!selectedPassenger ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
              {/* Route Pill */}
              <View style={styles.routePill}>
                <Text style={styles.routePillText} numberOfLines={1}>
                  {origin}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#94A3B8" />
                <Text style={styles.routePillText} numberOfLines={1}>
                  {destination}
                </Text>
              </View>

              {/* Loading indicator */}
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#3B66FF" />
                  <Text style={styles.loadingText}>Loading passengers...</Text>
                </View>
              ) : passengersList.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={40} color="#94A3B8" />
                  <Text style={styles.emptyText}>No passengers to rate for this trip.</Text>
                </View>
              ) : (
                passengersList.map((passenger) => {
                  const isRated = ratedPassengerIds[passenger.booking_id];
                  const avatarUri =
                    passenger.profile_picture ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";

                  return (
                    <TouchableOpacity
                      key={passenger.booking_id}
                      style={[styles.passengerCard, isRated && styles.passengerCardRated]}
                      onPress={() => handleSelectPassenger(passenger)}
                      activeOpacity={0.7}
                    >
                      <Image source={{ uri: avatarUri }} style={styles.avatarImage} />

                      <View style={styles.nameRow}>
                        <Text style={styles.passengerName}>{passenger.full_name}</Text>
                        {passenger.is_verified && (
                          <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                        )}
                      </View>

                      {isRated ? (
                        <View style={styles.ratedPill}>
                          <Text style={styles.ratedText}>Rated</Text>
                        </View>
                      ) : (
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          ) : (
            /* View 2: Individual Rating & Feedback Screen */
            <View style={styles.ratingFormContent}>
              {/* Selected Passenger Info */}
              <View style={styles.selectedPassengerHeader}>
                <Image
                  source={{
                    uri:
                      selectedPassenger.profile_picture ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
                  }}
                  style={styles.selectedAvatar}
                />
                <Text style={styles.selectedName}>{selectedPassenger.full_name}</Text>
              </View>

              {/* 5-Star Rating Bar */}
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                  >
                    <Ionicons
                      name={rating >= star ? "star" : "star-outline"}
                      size={32}
                      color={rating >= star ? "#F59E0B" : "#CBD5E1"}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Feedback Section */}
              <Text style={styles.feedbackTitle}>We would love your feedback</Text>

              <View style={styles.textareaContainer}>
                <TextInput
                  style={styles.textareaInput}
                  placeholder="Tell us about your passenger (optional)"
                  placeholderTextColor="#94A3B8"
                  value={feedback}
                  onChangeText={(t) => setFeedback(t.slice(0, 200))}
                  multiline
                  maxLength={200}
                />
                <Text style={styles.charCountText}>{feedback.length}/200</Text>
              </View>

              {/* Dynamic Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  submitStatus === "submitted"
                    ? styles.submitBtnActive
                    : submitStatus === "loading"
                    ? styles.submitBtnActive
                    : rating > 0
                    ? styles.submitBtnActive
                    : styles.submitBtnDisabled,
                ]}
                disabled={submitStatus === "loading" || rating === 0}
                onPress={handleSubmitRating}
                activeOpacity={0.8}
              >
                {submitStatus === "loading" ? (
                  <View style={styles.submitLoadingRow}>
                    <Text style={styles.submitBtnTextActive}>Submitting...</Text>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  </View>
                ) : submitStatus === "submitted" ? (
                  <View style={styles.submitLoadingRow}>
                    <Text style={styles.submitBtnTextActive}>Submitted</Text>
                    <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                  </View>
                ) : (
                  <Text style={styles.submitBtnTextActive}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    maxHeight: "92%",
  },
  sheetHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.slate[300],
    alignSelf: "center",
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backArrowBtn: {
    paddingRight: 10,
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: colors.dark,
    flex: 1,
  },
  cancelText: {
    fontFamily: "DM Sans",
    fontSize: 16,
    color: "#64748B",
  },
  listContent: {
    paddingBottom: 24,
  },
  routePill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  routePillText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
    maxWidth: "42%",
  },
  loadingContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#64748B",
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
  },
  passengerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  passengerCardRated: {
    backgroundColor: "#F1F5F9",
    opacity: 0.85,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 14,
  },
  nameRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  passengerName: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
  },
  ratedPill: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratedText: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
  },

  // Rating Form Styles
  ratingFormContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  selectedPassengerHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  selectedAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  selectedName: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: colors.dark,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  feedbackTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 12,
  },
  textareaContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  textareaInput: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: colors.dark,
    textAlignVertical: "top",
    flex: 1,
  },
  charCountText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "right",
  },
  submitBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  submitBtnActive: {
    backgroundColor: "#3B66FF",
    shadowColor: "#3B66FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnTextActive: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  submitLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
