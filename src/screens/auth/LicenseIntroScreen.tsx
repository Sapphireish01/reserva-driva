import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCameraPermissions } from "expo-camera";
import React, { useEffect } from "react";
import {
  Alert,
  AppState,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "LicenseIntro">;

const GUIDELINES = [
  "Make sure your license is valid and not expired.",
  "Ensure all four corners of the license are visible and clearly captured.",
  "Avoid blurry or dark images—your details should be easy to read.",
  "The name on your license must match your driver details.",
];

const LicenseCardIllustration = () => (
  <Image
    source={require("../../../assets/onboarding/drivers-lin.png")}
    style={styles.illustrationImage}
    resizeMode="contain"
  />
);

export const LicenseIntroScreen = ({ route, navigation }: Props) => {
  const { driverId, email } = route.params;
  const [permission, requestPermission, getPermission] = useCameraPermissions();

  // Re-check camera permission when returning to the app from phone Settings
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        getPermission();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [getPermission]);

  const handleScanPress = async () => {
    // 0. Always check fresh permission directly from OS
    const currentPermission = await getPermission();

    // 1. If already granted, navigate directly
    if (currentPermission?.granted) {
      navigation.navigate("LicenseFrontCapture", { driverId, email });
      return;
    }

    // 2. If can ask again, trigger native OS prompt directly
    if (!currentPermission || currentPermission.canAskAgain) {
      const res = await requestPermission();
      if (res?.granted) {
        navigation.navigate("LicenseFrontCapture", { driverId, email });
      }
      return;
    }

    // 3. If permanently denied in device settings, offer to open settings
    Alert.alert(
      "Camera Access Needed",
      "Rezarva requires camera access to capture your driver's license for verification. Please enable camera access in your device settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]
    );
  };

  return (
    <View style={styles.container}>
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
        onPress={handleScanPress}
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
    paddingTop: 0,
    paddingBottom: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: colors.grey,
    lineHeight: 23.8,
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
    fontWeight: "600",
    color: colors.grey,
    marginBottom: 12,
  },
  guidelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  bullet: {
    fontSize: 14,
    color: colors.dark,
    marginRight: 10,
    lineHeight: 20,
  },
  guidelineText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
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
