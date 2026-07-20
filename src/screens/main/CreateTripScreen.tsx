import React, { useState } from "react";
import {
  Alert,
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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MainStackParamList } from "../../navigation/types";
import { colors, spacing, typography } from "../../theme/colors";
import { tripsService } from "../../api/services/trips";

type Props = any;

export const CreateTripScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [seats, setSeats] = useState("3");
  const [price, setPrice] = useState("25");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createTripMutation = useMutation({
    mutationFn: tripsService.createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverTrips"] });
      navigation.goBack();
    },
    onError: (err: any) => {
      setErrorMessage(err?.message ?? "Failed to create trip. Please try again.");
    },
  });

  const handleSubmit = () => {
    setErrorMessage("");
    if (!origin.trim() || !destination.trim() || !departureTime.trim()) {
      setErrorMessage("Please fill out origin, destination, and departure time.");
      return;
    }

    const availableSeats = parseInt(seats, 10);
    const pricePerSeat = parseFloat(price);

    if (isNaN(availableSeats) || availableSeats <= 0) {
      setErrorMessage("Available seats must be at least 1.");
      return;
    }

    if (isNaN(pricePerSeat) || pricePerSeat <= 0) {
      setErrorMessage("Please enter a valid price per seat.");
      return;
    }

    createTripMutation.mutate({
      origin: origin.trim(),
      destination: destination.trim(),
      departureTime: departureTime.trim(),
      availableSeats,
      totalSeats: availableSeats,
      pricePerSeat,
      notes: notes.trim(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Post a New Route</Text>
        <Text style={styles.subtitle}>
          Offer empty seats to verified passengers travelling along your route.
        </Text>

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Origin / Pickup Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Downtown Terminal, NY"
            value={origin}
            onChangeText={setOrigin}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Uptown Plaza, NY"
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Departure Date & Time</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Today at 5:30 PM"
            value={departureTime}
            onChangeText={setDepartureTime}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>Available Seats</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={seats}
              onChangeText={setSeats}
            />
          </View>

          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>Price per Seat ($)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Trip Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="e.g. No large luggage, mask required..."
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, createTripMutation.isPending && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={createTripMutation.isPending}
        >
          <Text style={styles.submitButtonText}>
            {createTripMutation.isPending ? "Posting Trip..." : "Publish Trip"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 8 : 0,
  },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  title: { ...typography.h1, color: colors.text, marginBottom: 4 },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.md },

  errorBanner: {
    backgroundColor: "#FEE2E2",
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  errorText: { color: colors.error, fontWeight: "600", fontSize: 13 },

  fieldGroup: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: "600", color: colors.text, marginBottom: 6 },
  input: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  multilineInput: { height: 80, textAlignVertical: "top" },

  row: { flexDirection: "row", justifyContent: "space-between" },
  halfField: { width: "48%" },

  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: spacing.md,
  },
  submitButtonDisabled: { backgroundColor: colors.primaryDisabled },
  submitButtonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
});
