import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "LicenseIntro">;

const GUIDELINES = [
  "Make sure your license is valid and not expired.",
  "Ensure all four corners of the license are visible and clearly captured.",
  "Avoid blurry or dark images—your details should be easy to read.",
  "The name on your license must match your driver details.",
];

const BackArrowIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19L5 12L12 5"
      stroke="#1E293B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LicenseCardIllustration = () => (
  <Image
    source={require("../../../assets/onboarding/drivers-lin.png")}
    style={styles.illustrationImage}
    resizeMode="contain"
  />
);

export const LicenseIntroScreen = ({ route, navigation }: Props) => {
  const { driverId } = route.params;

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <BackArrowIcon />
      </TouchableOpacity> */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Upload Valid Drivers License</Text>
        <Text style={styles.subtitle}>
          Upload a valid license to continue with your self–drive booking.
        </Text>

        <View style={styles.illustrationContainer}>
          <LicenseCardIllustration />
        </View>

        <Text style={styles.guidelinesTitle}>Capture guidelines:</Text>

        {GUIDELINES.map((g, idx) => (
          <View key={idx} style={styles.guidelineRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.guidelineText}>{g}</Text>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.note}>
        Your information is secure and only used for verification
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("LicenseFrontCapture", { driverId })}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Scan License</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.md,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: "DM Sans Bold",
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  illustrationContainer: {
    backgroundColor: "#F6F8FA",
    borderRadius: 16,
    padding: 18,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  illustrationImage: {
    width: 260,
    height: 160,
  },
  guidelinesTitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 16,
  },
  guidelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  bullet: {
    fontSize: 14,
    color: "#1E293B",
    marginRight: 10,
    lineHeight: 20,
  },
  guidelineText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark,
    lineHeight: 20,
    flex: 1,
  },
  note: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "DM Sans",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
