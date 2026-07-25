import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
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
import { FileFormatIconItem } from "../../../components/ProfileIcons";
import { MainStackParamList } from "../../../navigation/types";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "ReportProblem">;

const CATEGORIES = [
  "Passenger",
  "Account Issues",
  "Security Concern",
  "Other",
  "Bug",
];

interface AttachmentFile {
  name: string;
  size: string;
  status: "uploading" | "completed";
}

export const ReportProblemScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<AttachmentFile | null>(null);

  // Modals state
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showAttachmentSheet, setShowAttachmentSheet] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const isFormValid = category.trim().length > 0 && description.trim().length > 0;

  const handlePickFromGallery = async () => {
    setShowAttachmentSheet(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false, // NO cutout section
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const filename = asset.fileName || "Issue.png";
      const sizeKb = asset.fileSize ? Math.round(asset.fileSize / 1024) : 120;
      setAttachment({ name: filename, size: `0 KB of ${sizeKb} KB`, status: "uploading" });

      setTimeout(() => {
        setAttachment({ name: filename, size: `0 KB of ${sizeKb} KB`, status: "completed" });
      }, 1000);
    }
  };

  // Camera state & permissions
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPhoto, setCameraPhoto] = useState<string | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const cameraRef = useRef<CameraView>(null);

  const handlePickFromCamera = async () => {
    setShowAttachmentSheet(false);
    if (!cameraPermission?.granted) {
      const res = await requestCameraPermission();
      if (!res.granted) {
        alert("Permission to access camera is required!");
        return;
      }
    }
    setCameraPhoto(null);
    setShowCamera(true);
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const handleShutter = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
          shutterSound: false,
        });
        if (photo?.uri) {
          setCameraPhoto(photo.uri);
          return;
        }
      }
    } catch (e) {
      console.warn("Error taking picture:", e);
    }
  };

  const handleUseCameraPhoto = () => {
    if (cameraPhoto) {
      const filename = "ScannedDoc.png";
      setAttachment({ name: filename, size: "0 KB of 120 KB", status: "uploading" });
      setTimeout(() => {
        setAttachment({ name: filename, size: "0 KB of 120 KB", status: "completed" });
      }, 1000);
    }
    setShowCamera(false);
    setCameraPhoto(null);
  };

  const handleSubmit = () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1200);
    }, 1200);
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
        <Text style={styles.headerTitle}>Report a Problem</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          {/* Category Field */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.asterisk}> *</Text>
            </View>
            <TouchableOpacity
              style={styles.inputCard}
              onPress={() => setShowCategorySheet(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.inputField, !category && styles.placeholderText]}>
                {category || "e.g Payment Issue"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Description Field */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.asterisk}> *</Text>
            </View>
            <View style={styles.editorCard}>
              {/* Formatting Toolbar Header */}
              <View style={styles.toolbarHeader}>
                <TouchableOpacity style={styles.toolbarBtn}>
                  <Text style={styles.toolbarBold}>B</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarBtn}>
                  <Text style={styles.toolbarItalic}>I</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarBtn}>
                  <Text style={styles.toolbarUnderline}>U</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarBtn}>
                  <Ionicons name="options-outline" size={16} color="#64748B" />
                </TouchableOpacity>
                <View style={styles.toolbarDivider} />
                <TouchableOpacity style={styles.toolbarBtn}>
                  <Ionicons name="list" size={16} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarBtn}>
                  <Ionicons name="menu" size={16} color="#64748B" />
                </TouchableOpacity>
                <View style={styles.toolbarDivider} />
                <TouchableOpacity style={styles.toolbarBtn}>
                  <Ionicons name="link-outline" size={16} color="#64748B" />
                </TouchableOpacity>

                {/* Image / Attachment Icon */}
                <TouchableOpacity
                  style={styles.toolbarBtn}
                  onPress={() => setShowAttachmentSheet(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="image-outline" size={16} color="#375DFB" />
                </TouchableOpacity>
              </View>

              {/* Multiline Description Input */}
              <TextInput
                style={styles.editorInput}
                placeholder="Placeholder text..."
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                maxLength={200}
                value={description}
                onChangeText={setDescription}
              />

              {/* Character Counter Footer */}
              <View style={styles.editorFooter}>
                <Text style={styles.charCount}>{description.length}/200</Text>
                <Ionicons name="pencil" size={12} color="#94A3B8" style={{ marginLeft: 4 }} />
              </View>
            </View>
          </View>

          {/* Attachment Upload / Completed Card */}
          {attachment && (
            <View style={styles.attachmentCard}>
              <View style={styles.attachmentLeft}>
                <View style={{ marginRight: 12 }}>
                  <FileFormatIconItem filename={attachment.name} size={36} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.attachmentName}>{attachment.name}</Text>
                  <View style={styles.attachmentStatusRow}>
                    <Text style={styles.attachmentSizeText}>{attachment.size} • </Text>
                    {attachment.status === "uploading" ? (
                      <Text style={styles.uploadingText}>Uploading...</Text>
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle" size={12} color="#22C55E" style={{ marginRight: 2 }} />
                        <Text style={styles.completedText}>Completed</Text>
                      </>
                    )}
                  </View>
                </View>
              </View>

              {attachment.status === "uploading" ? (
                <TouchableOpacity onPress={() => setAttachment(null)}>
                  <Ionicons name="close" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setAttachment(null)}>
                  <Ionicons name="trash-outline" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Submit Report Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid && styles.submitButtonDisabled,
            isSent && styles.submitButtonSuccess,
          ]}
          disabled={!isFormValid || isSubmitting}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : isSent ? (
            <View style={styles.successRow}>
              <Text style={styles.submitBtnText}>Sent</Text>
              <Ionicons name="checkmark-circle" size={18} color="#22C55E" style={{ marginLeft: 6 }} />
            </View>
          ) : (
            <Text
              style={[
                styles.submitBtnText,
                !isFormValid && styles.submitBtnTextDisabled,
              ]}
            >
              Submit Report
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Category Bottom Sheet Modal */}
      <Modal visible={showCategorySheet} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.sheetBackdrop}
            onPress={() => setShowCategorySheet(false)}
          />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Choose Category</Text>
              <TouchableOpacity onPress={() => setShowCategorySheet(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.categoryItem}
                onPress={() => {
                  setCategory(cat);
                  setShowCategorySheet(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryItemText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Attachment Options Bottom Sheet Modal */}
      <Modal visible={showAttachmentSheet} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.sheetBackdrop}
            onPress={() => setShowAttachmentSheet(false)}
          />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Choose Attachment</Text>
              <TouchableOpacity onPress={() => setShowAttachmentSheet(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={handlePickFromGallery}
              activeOpacity={0.7}
            >
              <Text style={styles.optionRowText}>Choose from files</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={handlePickFromCamera}
              activeOpacity={0.7}
            >
              <Text style={styles.optionRowText}>Scan document</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Camera Viewfinder Modal */}
      <Modal visible={showCamera} animationType="slide">
        <View style={styles.cameraScreenContainer}>
          {cameraPhoto ? (
            <Image source={{ uri: cameraPhoto }} style={styles.fullCameraPreview} />
          ) : (
            <CameraView
              ref={cameraRef}
              style={styles.fullCameraPreview}
              facing={facing}
            />
          )}

          {/* Camera Bottom Bar */}
          <View style={[styles.cameraBottomBar, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
            {cameraPhoto ? (
              <View style={styles.cameraActionRow}>
                <TouchableOpacity onPress={() => setCameraPhoto(null)}>
                  <Text style={styles.cameraActionText}>Retake Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUseCameraPhoto}>
                  <Text style={styles.cameraActionText}>Use Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.cameraShutterRow}>
                <TouchableOpacity style={styles.shutterSideColLeft} onPress={() => setShowCamera(false)}>
                  <Text style={styles.cameraCancelText}>Cancel</Text>
                </TouchableOpacity>

                <View style={styles.shutterCenterCol}>
                  <TouchableOpacity
                    style={styles.shutterRing}
                    onPress={handleShutter}
                    activeOpacity={0.8}
                  >
                    <View style={styles.shutterDot} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.shutterSideColRight} onPress={toggleFacing}>
                  <View style={styles.cameraFlipBtn}>
                    <Ionicons name="camera-reverse-outline" size={24} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: colors.dark },

  content: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  mainContent: { flex: 1 },
  fieldGroup: { marginBottom: spacing.lg },
  labelRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  label: { fontFamily: "DM Sans Bold", fontSize: 16, fontWeight: "700", color: colors.dark },
  asterisk: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#EF4444", fontWeight: "700" },

  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  inputField: { flex: 1, fontFamily: "DM Sans", fontSize: 14, color: colors.dark, fontWeight: "700" },
  placeholderText: { color: "#94A3B8" },

  editorCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  toolbarHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    gap: 12,
  },
  toolbarBtn: { padding: 4, justifyContent: "center", alignItems: "center" },
  toolbarBold: { fontFamily: "DM Sans Bold", fontWeight: "900", fontSize: 14, color: "#475569" },
  toolbarItalic: { fontFamily: "DM Sans", fontStyle: "italic", fontSize: 14, color: "#475569" },
  toolbarUnderline: { fontFamily: "DM Sans", textDecorationLine: "underline", fontSize: 14, color: "#475569" },
  toolbarDivider: { width: 1, height: 16, backgroundColor: "#E2E8F0" },

  editorInput: {
    height: 120,
    fontFamily: "DM Sans",
    fontSize: 14,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    color: colors.dark,
  },
  editorFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.md,
    paddingBottom: 10,
  },
  charCount: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8" },

  /* Attachment Card */
  attachmentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: "#FFFFFF",
  },
  attachmentLeft: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 10 },
  pngBadge: { backgroundColor: "#3B82F6", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 4, marginRight: 10 },
  pngBadgeText: { fontFamily: "DM Sans Bold", fontSize: 10, color: "#FFFFFF", fontWeight: "800" },
  attachmentName: { fontFamily: "DM Sans Bold", fontSize: 13, fontWeight: "700", color: colors.dark },
  attachmentStatusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  attachmentSizeText: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8" },
  uploadingText: { fontFamily: "DM Sans", fontSize: 11, color: colors.dark, fontWeight: "600" },
  completedText: { fontFamily: "DM Sans", fontSize: 11, color: colors.dark, fontWeight: "600" },

  submitButton: {
    backgroundColor: "#375DFB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  submitButtonDisabled: { backgroundColor: "#F8FAFC" },
  submitButtonSuccess: { backgroundColor: "#375DFB" },
  successRow: { flexDirection: "row", alignItems: "center" },
  submitBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  submitBtnTextDisabled: { color: "#CBD5E1" },

  /* Bottom Sheets */
  sheetOverlay: { flex: 1, justifyContent: "flex-end" },
  sheetBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15, 23, 42, 0.4)" },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
  },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg },
  sheetTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: colors.dark },
  categoryItem: { backgroundColor: "#F8FAFC", borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm },
  categoryItemText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "600", color: colors.dark },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  optionRowText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "600", color: colors.dark },

  /* Camera Modal Styles */
  cameraScreenContainer: { flex: 1, backgroundColor: "#000000" },
  fullCameraPreview: { flex: 1, width: "100%", resizeMode: "cover" },
  cameraBottomBar: {
    backgroundColor: "#868C98",
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    height: 150,
  },
  cameraActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  cameraShutterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shutterSideColLeft: {
    width: 90,
    alignItems: "flex-start",
  },
  shutterCenterCol: {
    alignItems: "center",
    justifyContent: "center",
  },
  shutterSideColRight: {
    width: 90,
    alignItems: "flex-end",
  },
  cameraCancelText: {
    fontFamily: "DM Sans",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  cameraActionText: {
    fontFamily: "DM Sans",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  shutterRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  shutterDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
  },
  cameraFlipBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
});
