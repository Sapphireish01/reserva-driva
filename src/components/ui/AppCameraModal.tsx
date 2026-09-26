import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AppCameraModalProps {
  visible: boolean;
  onClose: () => void;
  onPhotoCaptured: (uri: string) => void;
  initialFacing?: "front" | "back";
}

export const AppCameraModal: React.FC<AppCameraModalProps> = ({
  visible,
  onClose,
  onPhotoCaptured,
  initialFacing = "front",
}) => {
  const insets = useSafeAreaInsets();
  const [cameraPermission, requestCameraPermission, getCameraPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">(initialFacing);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // Sync permissions when app comes back to foreground
  useEffect(() => {
    if (!visible) return;
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        getCameraPermission();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [visible, getCameraPermission]);

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const handleShutter = async () => {
    try {
      const currentPerm = await getCameraPermission();
      if (!currentPerm?.granted) {
        if (currentPerm?.canAskAgain) {
          const res = await requestCameraPermission();
          if (!res.granted) return;
        } else {
          Alert.alert(
            "Camera Access Needed",
            "Please enable camera access in your device settings to take a photo.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
      }
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
          shutterSound: false,
        });
        if (photo?.uri) {
          setCapturedPhoto(photo.uri);
        }
      }
    } catch (e) {
      console.warn("Error taking picture:", e);
    }
  };

  const handleUsePhoto = () => {
    if (capturedPhoto) {
      onPhotoCaptured(capturedPhoto);
      setCapturedPhoto(null);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleCloseModal = () => {
    setCapturedPhoto(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.cameraScreenContainer}>
          {capturedPhoto ? (
            <Image
              source={{ uri: capturedPhoto }}
              style={[
                styles.fullCameraPreview,
                facing === "front" && styles.mirroredPreview,
              ]}
            />
          ) : (
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFillObject}
              facing={facing}
            />
          )}

          <View
            style={[
              styles.cameraBottomBar,
              { paddingBottom: Math.max(insets.bottom + 16, 38) },
            ]}
          >
            {capturedPhoto ? (
              <View style={styles.cameraActionRow}>
                <TouchableOpacity style={styles.textActionBtn} onPress={handleRetake} activeOpacity={0.7}>
                  <Text style={styles.cameraActionText}>Retake Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.textActionBtn} onPress={handleUsePhoto} activeOpacity={0.7}>
                  <Text style={styles.cameraActionText}>Use Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.cameraShutterRow}>
                <TouchableOpacity style={styles.cameraTextBtn} onPress={handleCloseModal} activeOpacity={0.7}>
                  <Text style={styles.cameraCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shutterOuter} onPress={handleShutter} activeOpacity={0.8}>
                  <View style={styles.shutterInner} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.cameraFlipBtn} onPress={toggleFacing} activeOpacity={0.7}>
                  <Ionicons name="sync-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  cameraScreenContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  fullCameraPreview: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  mirroredPreview: {
    transform: [{ scaleX: -1 }],
  },
  cameraBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(135, 112, 88, 1)",
    paddingTop: 44,
    paddingHorizontal: 24,
    height: 150,

  },
  cameraActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  textActionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  cameraActionText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cameraShutterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  cameraTextBtn: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    minWidth: 60,
  },
  cameraCancelText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFFFFF",
  },
  cameraFlipBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});
