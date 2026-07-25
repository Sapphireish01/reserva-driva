import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainStackParamList } from "../../../navigation/types";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "Preferences">;

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (val: number) => void;
}

const InteractiveSlider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 5,
  step = 0.1,
  onValueChange,
}) => {
  const [trackWidth, setTrackWidth] = useState(0);

  const updateValueFromX = (x: number) => {
    if (trackWidth <= 0) return;
    const ratio = Math.max(0, Math.min(1, x / trackWidth));
    const rawValue = min + ratio * (max - min);
    const stepped = Math.round(rawValue / step) * step;
    const clamped = Math.max(min, Math.min(max, Number(stepped.toFixed(1))));
    onValueChange(clamped);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateValueFromX(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        updateValueFromX(evt.nativeEvent.locationX);
      },
    })
  ).current;

  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <View
      style={styles.trackBackground}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
    >
      <View style={[styles.trackActive, { width: `${pct}%` }]} />
      <View style={styles.startDot} />
      <View style={[styles.thumb, { left: `${Math.min(Math.max(pct, 2), 96)}%` }]} />
    </View>
  );
};

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
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
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
              style={styles.genderCard}
              onPress={() => setGenderPref("everyone")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  genderPref === "everyone" ? styles.checkboxActive : styles.checkboxInactive,
                ]}
              >
                {genderPref === "everyone" && (
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                )}
              </View>
              <Text
                style={[
                  styles.genderText,
                  genderPref !== "everyone" && styles.genderTextInactive,
                ]}
              >
                Everyone
              </Text>
            </TouchableOpacity>

            {/* Female Only */}
            <TouchableOpacity
              style={styles.genderCard}
              onPress={() => setGenderPref("female")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  genderPref === "female" ? styles.checkboxActive : styles.checkboxInactive,
                ]}
              >
                {genderPref === "female" && (
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                )}
              </View>
              <Text
                style={[
                  styles.genderText,
                  genderPref !== "female" && styles.genderTextInactive,
                ]}
              >
                Female Only
              </Text>
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
              {/* <Text style={styles.scaleValueText}>{pickupRadius.toFixed(1)} km</Text> */}
              <Text style={styles.scaleText}>5km</Text>
            </View>
            <InteractiveSlider
              value={pickupRadius}
              min={0}
              max={5}
              step={0.1}
              onValueChange={setPickupRadius}
            />
            {/* Quick Chips */}
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
              {/* <Text style={styles.scaleValueText}>{distanceThreshold.toFixed(1)} km</Text> */}
              <Text style={styles.scaleText}>5km</Text>
            </View>
            <InteractiveSlider
              value={distanceThreshold}
              min={0}
              max={5}
              step={0.1}
              onValueChange={setDistanceThreshold}
            />

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
              {/* <Text style={styles.scaleValueText}>{deviationRadius.toFixed(1)} km</Text> */}
              <Text style={styles.scaleText}>5km</Text>
            </View>
            <InteractiveSlider
              value={deviationRadius}
              min={0}
              max={5}
              step={0.1}
              onValueChange={setDeviationRadius}
            />

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
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 20, fontWeight: "700", color: colors.dark },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl * 2 },
  introText: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  sectionGroup: { marginBottom: spacing.xl },
  sectionHeader: { fontFamily: "DM Sans", fontSize: 13, color: "#868C98", marginBottom: 10 },

  genderRow: { flexDirection: "row", gap: 12 },
  genderCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    shadowColor: "rgba(15, 23, 42, 0.12)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxActive: { backgroundColor: "#375DFB" },
  checkboxInactive: { borderWidth: 1.5, borderColor: "#CBD5E1", backgroundColor: "#FFFFFF" },
  genderText: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "600", color: colors.dark },
  genderTextInactive: { fontFamily: "DM Sans", fontWeight: "400", color: "#868C98" },

  explanationText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: colors.dark, marginBottom: 4 },
  labelHeader: { fontFamily: "DM Sans", fontSize: 13, color: "#868C98", marginBottom: 12 },

  sliderContainer: { marginTop: 4 },
  sliderScaleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  scaleText: { fontFamily: "DM Sans", fontSize: 13, color: "#868C98" },
  scaleValueText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#375DFB", fontWeight: "700" },

  trackBackground: {
    height: 24,
    justifyContent: "center",
    position: "relative",
  },
  trackActive: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#375DFB",
    position: "absolute",
    left: 0,
  },
  startDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "#375DFB",
    position: "absolute",
    left: 0,
    zIndex: 2,
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#1C398E",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    position: "absolute",
    marginLeft: -9,
    zIndex: 3,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
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
    backgroundColor: "#EBF1FF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: spacing.md,
  },
  saveButtonText: { fontFamily: "DM Sans Bold", fontSize: 16, fontWeight: "700", color: "#375DFB" },
});
