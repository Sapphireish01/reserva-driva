import { BlurView } from "expo-blur";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, Mask, Path, Rect } from "react-native-svg";
import { colors, spacing } from "../../theme/colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CUTOUT_WIDTH = Math.min(SCREEN_WIDTH - 48, 360);
const CUTOUT_HEIGHT = CUTOUT_WIDTH / 1.58;
const CORNER_RADIUS = 16;
const CUTOUT_X = (SCREEN_WIDTH - CUTOUT_WIDTH) / 2;
const CUTOUT_Y = (SCREEN_HEIGHT - CUTOUT_HEIGHT) / 2 - 30;

interface Props {
  step: "Step 1 of 2" | "Step 2 of 2";
  instruction: string;
  onCapture: (uri: string) => void;
  onCancel: () => void;
}

const FlashIcon = ({ active }: { active: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    {active ? (
      <Path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#FACC15" stroke="#FACC15" strokeWidth="1.5" strokeLinejoin="round" />
    ) : (
      <Path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
    )}
  </Svg>
);

export const LicenseCaptureView = ({ step, instruction, onCapture, onCancel }: Props) => {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission?.granted) {
    return (
      <View style={[styles.permissionContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          Camera permission is required to capture your driver's license for identity verification.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission} activeOpacity={0.8}>
          <Text style={styles.permissionButtonText}>Grant Access</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelLink} onPress={onCancel}>
          <Text style={styles.cancelLinkText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleFlash = () => {
    setFlashOn((prev) => !prev);
  };

  const handleShutter = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.85,
        shutterSound: false,
      });
      if (photo?.uri) {
        setPhotoUri(photo.uri);
      } else {
        setPhotoUri("placeholder_license_uri");
      }
    } catch (e) {
      console.warn("Error taking picture:", e);
      setPhotoUri("placeholder_license_uri");
    }
  };

  const handleUsePhoto = () => {
    onCapture(photoUri || "placeholder_license_uri");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. Full Height Camera Stream / Image Preview */}
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      ) : (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={flashOn}
          flash={flashOn ? "on" : "off"}
        />
      )}

      {/* 2. SVG Cutout Mask for ID Card Viewfinder */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH} style={StyleSheet.absoluteFill}>
          <Defs>
            <Mask id="cutoutMask">
              <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="#FFFFFF" />
              <Rect
                x={CUTOUT_X}
                y={CUTOUT_Y}
                width={CUTOUT_WIDTH}
                height={CUTOUT_HEIGHT}
                rx={CORNER_RADIUS}
                ry={CORNER_RADIUS}
                fill="#000000"
              />
            </Mask>
          </Defs>

          <Rect
            x="0"
            y="0"
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
            fill="rgba(15, 23, 42, 0.72)"
            mask="url(#cutoutMask)"
          />

          <Rect
            x={CUTOUT_X}
            y={CUTOUT_Y}
            width={CUTOUT_WIDTH}
            height={CUTOUT_HEIGHT}
            rx={CORNER_RADIUS}
            ry={CORNER_RADIUS}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={2}
          />
        </Svg>
      </View>

      {/* 3. Floating Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={{ width: 40 }} />
        <View style={styles.headerTextContainer}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>{step}</Text>
          </View>
          <Text style={styles.instruction}>{instruction}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* 4. Frame Hint Text */}
      {!photoUri && (
        <View style={[styles.hintContainer, { top: CUTOUT_Y + CUTOUT_HEIGHT + 18 }]} pointerEvents="none">
          <Text style={styles.frameHint}>Align license within frame</Text>
        </View>
      )}

      {/* 5. Floating Bottom Controls Bar with Blur Container */}
      <View style={styles.controlsWrapper}>
        <BlurView intensity={65} tint="dark" style={[styles.controlsBlurContainer, { paddingBottom: insets.bottom }]}>
          {photoUri ? (
            <View style={styles.previewActions}>
              <TouchableOpacity
                style={styles.textActionButton}
                onPress={() => setPhotoUri(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryText}>Retake Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.textActionButton}
                onPress={handleUsePhoto}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryText}>Use Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.shutterActions}>
              <TouchableOpacity onPress={onCancel} activeOpacity={0.7} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shutterOuterRing} onPress={handleShutter} activeOpacity={0.8}>
                <View style={styles.shutterInnerCircle} />
              </TouchableOpacity>

              <View style={styles.flashControlContainer}>
                <TouchableOpacity
                  style={[styles.flashControlButton, flashOn && styles.flashControlButtonActive]}
                  onPress={toggleFlash}
                  activeOpacity={0.7}
                >
                  <FlashIcon active={flashOn} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </BlurView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  permissionTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  permissionText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  permissionButtonText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cancelLink: {
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  cancelLinkText: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: "#94A3B8",
  },

  /* Header Bar */
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    zIndex: 10,
  },
  headerTextContainer: {
    marginTop: 24,
    alignItems: "center",
    flex: 1,
  },
  stepBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  stepText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  instruction: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /* Hint Text */
  hintContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  frameHint: {
    fontFamily: "DM Sans",
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: -0.3,
    color: "#E2E8F0",
    backgroundColor: "#31353F",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    overflow: "hidden",
  },

  /* Bottom Controls Bar */
  controlsWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.2,
    zIndex: 10,
  },
  controlsBlurContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "rgba(15, 23, 42, 0.32)",
    // borderTopWidth: 1,
    // borderTopColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: spacing.lg,
  },
  shutterActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelButton: {
    width: 90,
    justifyContent: "center",
  },
  cancelText: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  shutterOuterRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  shutterInnerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
  },
  flashControlContainer: {
    width: 90,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  flashControlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#999999",
    justifyContent: "center",
    alignItems: "center",
  },
  flashControlButtonActive: {
    backgroundColor: "rgba(250, 204, 21, 0.3)",
    borderColor: "#FACC15",
    borderWidth: 1,
  },
  previewActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  textActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  secondaryText: {
    fontFamily: "DM Sans Bold",
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  primaryText: {
    fontFamily: "DM Sans Bold",
    fontSize: 17,
    fontWeight: "700",
    color: "#38BDF8",
  },
});



