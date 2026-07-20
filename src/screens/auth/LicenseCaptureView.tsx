import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { colors, spacing, typography } from "../../theme/colors";

interface Props {
  step: "Step 1 of 2" | "Step 2 of 2";
  instruction: string;
  onCapture: (uri: string) => void;
  onCancel: () => void;
}

// Shared by LicenseFrontCaptureScreen and LicenseBackCaptureScreen —
// both just render this with different copy/callbacks.
export const LicenseCaptureView = ({ step, instruction, onCapture, onCancel }: Props) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is needed to scan your license.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShutter = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.85 });
    if (photo) setPhotoUri(photo.uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.step}>{step}</Text>
      <Text style={styles.instruction}>{instruction}</Text>

      <View style={styles.frame}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
      </View>

      {photoUri ? (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setPhotoUri(null)}>
            <Text style={styles.secondaryButtonText}>Retake Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onCapture(photoUri)}>
            <Text style={styles.buttonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shutter} onPress={handleShutter} />
          <View style={{ width: 60 }} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy, padding: spacing.lg },
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.lg },
  permissionText: { color: "#fff", textAlign: "center", marginBottom: spacing.md },
  step: { color: "#fff", textAlign: "center", opacity: 0.7 },
  instruction: { color: "#fff", textAlign: "center", ...typography.h2, marginBottom: spacing.lg },
  frame: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  cancel: { color: "#fff" },
  shutter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondaryButton: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  secondaryButtonText: { color: "#fff" },
});
