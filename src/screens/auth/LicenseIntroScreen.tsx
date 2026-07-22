import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path, Rect, Text as SvgText } from "react-native-svg";
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
  <Svg width={260} height={160} viewBox="0 0 260 160" fill="none">
    {/* Frame Brackets */}
    <Path
      d="M 32 44 L 32 30 Q 32 24 38 24 L 52 24"
      stroke="#CBD5E1"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M 228 24 L 242 24 Q 248 24 248 30 L 248 44"
      stroke="#CBD5E1"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M 32 116 L 32 130 Q 32 136 38 136 L 52 136"
      stroke="#CBD5E1"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M 228 136 L 242 136 Q 248 136 248 130 L 248 116"
      stroke="#CBD5E1"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />

    {/* Main License Card Base */}
    <Rect x="44" y="32" width="172" height="96" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />

    {/* Top Header Band */}
    <Rect x="44" y="32" width="172" height="18" rx="8" fill="#1E293B" />
    <Rect x="44" y="42" width="172" height="8" fill="#1E293B" />
    <SvgText
      x="130"
      y="44"
      fill="#FFFFFF"
      fontSize="8"
      fontWeight="bold"
      fontStyle="italic"
      textAnchor="middle"
    >
      DRIVING LICENSE
    </SvgText>

    {/* Driver Avatar Photo */}
    <Rect x="52" y="56" width="36" height="46" rx="3" fill="#E2E8F0" />
    <Circle cx="70" cy="69" r="8" fill="#64748B" />
    <Path d="M 58 98 C 58 87 82 87 82 98 Z" fill="#64748B" />

    {/* Text Fields */}
    <SvgText x="96" y="59" fill="#94A3B8" fontSize="4.5">SURNAME</SvgText>
    <SvgText x="96" y="67" fill="#1E293B" fontSize="7" fontWeight="bold">LOREM</SvgText>

    <SvgText x="96" y="74" fill="#94A3B8" fontSize="4.5">NAME</SvgText>
    <SvgText x="96" y="81" fill="#1E293B" fontSize="6" fontWeight="bold">IPSUM</SvgText>

    <SvgText x="96" y="87" fill="#94A3B8" fontSize="4">DATE OF BIRTH</SvgText>
    <SvgText x="96" y="93" fill="#1E293B" fontSize="5.5" fontWeight="bold">DD/MM/YYYY</SvgText>

    <SvgText x="96" y="99" fill="#94A3B8" fontSize="4">NATIONALITY</SvgText>
    <SvgText x="96" y="105" fill="#1E293B" fontSize="5.5" fontWeight="bold">LOREM IPSUM</SvgText>

    <SvgText x="96" y="114" fill="#1E293B" fontSize="6.5" fontWeight="bold">CLASS: B</SvgText>

    {/* Signature & Donor Badge */}
    <Path d="M 166 68 Q 172 61 178 68 T 188 64 T 196 69" stroke="#334155" strokeWidth="1" fill="none" />
    <SvgText x="180" y="74" fill="#94A3B8" fontSize="3.5">DONOR</SvgText>
    <Circle cx="194" cy="73" r="2.5" fill="#EAB308" />

    {/* Bottom Left License ID */}
    <SvgText x="52" y="110" fill="#94A3B8" fontSize="4">LOREM / IPSUM</SvgText>
    <SvgText x="52" y="119" fill="#1E293B" fontSize="7.5" fontWeight="bold">01.234.567</SvgText>

    {/* Barcode */}
    <Rect x="148" y="106" width="1.5" height="12" fill="#1E293B" />
    <Rect x="151" y="106" width="3" height="12" fill="#1E293B" />
    <Rect x="155" y="106" width="1.5" height="12" fill="#1E293B" />
    <Rect x="158" y="106" width="4" height="12" fill="#1E293B" />
    <Rect x="163" y="106" width="2" height="12" fill="#1E293B" />
    <Rect x="166" y="106" width="1" height="12" fill="#1E293B" />
    <Rect x="168" y="106" width="3.5" height="12" fill="#1E293B" />
    <Rect x="173" y="106" width="1.5" height="12" fill="#1E293B" />
    <Rect x="176" y="106" width="4" height="12" fill="#1E293B" />
    <Rect x="181" y="106" width="2" height="12" fill="#1E293B" />

    {/* Scanner Overlay Line */}
    <Rect x="44" y="66" width="172" height="14" fill="rgba(148, 163, 184, 0.25)" />
    <Path d="M 44 66 L 216 66" stroke="rgba(148, 163, 184, 0.6)" strokeWidth="1" />
    <Path d="M 44 80 L 216 80" stroke="rgba(148, 163, 184, 0.6)" strokeWidth="1" />
  </Svg>
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
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  guidelinesTitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
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
    fontWeight: "600",
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
    marginBottom: spacing.sm,
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
