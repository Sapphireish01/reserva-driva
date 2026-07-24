import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainStackParamList } from "../../navigation/types";
import { spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "Preferences">;

export const PreferencesScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const [genderPref, setGenderPref] = useState<"everyone" | "female">("everyone");
  const [pickupRadius, setPickupRadius] = useState<number>(1.5);
  const [distanceThreshold, setDistanceThreshold] = useState<number>(2.0);
  const [deviationRadius, setDeviationRadius] = useState<number>(1.0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Intro Subtitle */}
        <Text style={styles.introText}>
          Customize your ride experience with your travel preferences.
        </Text>

        {/* Gender Preferences Section */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionHeader}>Gender Preferences</Text>
          <View style={styles.genderRow}>
            {/* Everyone */}
            <TouchableOpacity
              style={[
                styles.genderCard,
                genderPref === "everyone" && styles.genderCardActive,
              ]}
              onPress={() => setGenderPref("everyone")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  genderPref === "everyone" && styles.checkboxActive,
                ]}
              >
                {genderPref === "everyone" && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.genderText}>Everyone</Text>
            </TouchableOpacity>

            {/* Female Only */}
            <TouchableOpacity
              style={[
                styles.genderCard,
                genderPref === "female" && styles.genderCardActive,
              ]}
              onPress={() => setGenderPref("female")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  genderPref === "female" && styles.checkboxActive,
                ]}
              >
                {genderPref === "female" && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.genderText}>Female Only</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 1. Pickup Radius */}
        <View style={styles.sectionGroup}>
          <Text style={styles.explanationText}>
            How far passengers can be from your route.
          </Text>
          <Text style={styles.labelHeader}>Pickup Radius</Text>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderScaleRow}>
              <Text style={styles.scaleText}>0km</Text>
              <Text style={styles.scaleValueText}>{pickupRadius.toFixed(1)} km</Text>
              <Text style={styles.scaleText}>5km</Text>
            </View>
            <View style={styles.trackBackground}>
              <View
                style={[
                  styles.trackActive,
                  { width: `${(pickupRadius / 5) * 100}%` },
                ]}
              />
              <TouchableOpacity
                style={[
                  styles.thumb,
                  { left: `${Math.min(Math.max((pickupRadius / 5) * 100, 2), 96)}%` },
                ]}
                activeOpacity={0.9}
              />
            </View>
            {/* Touch Adjust Buttons */}
            <View style={styles.adjustRow}>
              {[1.0, 1.5, 2.5, 3.5, 5.0].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.chipBtn,
                    pickupRadius === val && styles.chipBtnActive,
                  ]}
                  onPress={() => setPickupRadius(val)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      pickupRadius === val && styles.chipTextActive,
                    ]}
                  >
                    {val}km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 2. Distance Threshold */}
        <View style={styles.sectionGroup}>
          <Text style={styles.explanationText}>
            How far drop-offs can be from your route
          </Text>
          <Text style={styles.labelHeader}>Distance Threshold</Text>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderScaleRow}>
              <Text style={styles.scaleText}>0km</Text>
              <Text style={styles.scaleValueText}>{distanceThreshold.toFixed(1)} km</Text>
              <Text style={styles.scaleText}>5km</Text>
            </View>
            <View style={styles.trackBackground}>
              <View
                style={[
                  styles.trackActive,
                  { width: `${(distanceThreshold / 5) * 100}%` },
                ]}
              />
              <TouchableOpacity
                style={[
                  styles.thumb,
                  { left: `${Math.min(Math.max((distanceThreshold / 5) * 100, 2), 96)}%` },
                ]}
                activeOpacity={0.9}
              />
            </View>

            <View style={styles.adjustRow}>
              {[1.0, 2.0, 3.0, 4.0, 5.0].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.chipBtn,
                    distanceThreshold === val && styles.chipBtnActive,
                  ]}
                  onPress={() => setDistanceThreshold(val)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      distanceThreshold === val && styles.chipTextActive,
                    ]}
                  >
                    {val}km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 3. Deviation Radius */}
        <View style={styles.sectionGroup}>
          <Text style={styles.explanationText}>
            Maximum route deviation you’ll accept
          </Text>
          <Text style={styles.labelHeader}>Deviation Radius</Text>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderScaleRow}>
              <Text style={styles.scaleText}>0km</Text>
              <Text style={styles.scaleValueText}>{deviationRadius.toFixed(1)} km</Text>
              <Text style={styles.scaleText}>5km</Text>
            </View>
            <View style={styles.trackBackground}>
              <View
                style={[
                  styles.trackActive,
                  { width: `${(deviationRadius / 5) * 100}%` },
                ]}
              />
              <TouchableOpacity
                style={[
                  styles.thumb,
                  { left: `${Math.min(Math.max((deviationRadius / 5) * 100, 2), 96)}%` },
                ]}
                activeOpacity={0.9}
              />
            </View>

            <View style={styles.adjustRow}>
              {[0.5, 1.0, 1.5, 2.0, 3.0].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.chipBtn,
                    deviationRadius === val && styles.chipBtnActive,
                  ]}
                  onPress={() => setDeviationRadius(val)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      deviationRadius === val && styles.chipTextActive,
                    ]}
                  >
                    {val}km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Success Toast */}
        {savedSuccess && (
          <View style={styles.toastCard}>
            <Ionicons name="checkmark-circle" size={18} color="#22C55E" style={{ marginRight: 6 }} />
            <Text style={styles.toastText}>Preferences saved successfully!</Text>
          </View>
        )}

        {/* Save Changes Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl * 2 },
  introText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  sectionGroup: { marginBottom: spacing.xl },
  sectionHeader: { fontFamily: "DM Sans", fontSize: 12, color: "#94A3B8", marginBottom: spacing.sm },

  genderRow: { flexDirection: "row", gap: 12 },
  genderCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: spacing.md,
  },
  genderCardActive: { backgroundColor: "#F8FAFC" },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#FFFFFF",
  },
  checkboxActive: { backgroundColor: "#375DFB", borderColor: "#375DFB" },
  genderText: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "600", color: "#0F172A" },

  explanationText: { fontFamily: "DM Sans", fontSize: 14, color: "#0F172A", marginBottom: 6 },
  labelHeader: { fontFamily: "DM Sans", fontSize: 12, color: "#94A3B8", marginBottom: spacing.sm },

  sliderContainer: { marginTop: 4 },
  sliderScaleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  scaleText: { fontFamily: "DM Sans", fontSize: 12, color: "#94A3B8" },
  scaleValueText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#375DFB", fontWeight: "700" },

  trackBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F1F5F9",
    position: "relative",
    justifyContent: "center",
  },
  trackActive: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#375DFB",
    position: "absolute",
    left: 0,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#375DFB",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    position: "absolute",
    marginLeft: -10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  adjustRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  chipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },
  chipBtnActive: { backgroundColor: "#EEF2FF" },
  chipText: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B" },
  chipTextActive: { fontFamily: "DM Sans Bold", color: "#375DFB", fontWeight: "700" },

  toastCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  toastText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#166534" },

  saveButton: {
    backgroundColor: "#EBF0FF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: spacing.md,
  },
  saveButtonText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#375DFB" },
});
