import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { FileFormatIconItem } from "../../../components/ProfileIcons";
import {
  AppBottomSheet,
  AppButton,
  AppCameraModal,
  AppDropdown,
  AppLoader,
  AppTextEditor,
  CheckIcon,
} from "../../../components/ui";
import { useCreateSupportTicketMutation } from "../../../hooks/useSupportTickets";
import { MainStackParamList } from "../../../navigation/types";
import { colors } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "ReportProblem">;

const UploadingStatusIcon = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 4C8.15913 4 8.31174 4.06321 8.42426 4.17574C8.53679 4.28826 8.6 4.44087 8.6 4.6V6.4C8.6 6.55913 8.53679 6.71174 8.42426 6.82426C8.31174 6.93679 8.15913 7 8 7C7.84087 7 7.68826 6.93679 7.57574 6.82426C7.46321 6.71174 7.4 6.55913 7.4 6.4V4.6C7.4 4.44087 7.46321 4.28826 7.57574 4.17574C7.68826 4.06321 7.84087 4 8 4ZM8 13C8.15913 13 8.31174 13.0632 8.42426 13.1757C8.53679 13.2883 8.6 13.4409 8.6 13.6V15.4C8.6 15.5591 8.53679 15.7117 8.42426 15.8243C8.31174 15.9368 8.15913 16 8 16C7.84087 16 7.68826 15.9368 7.57574 15.8243C7.46321 15.7117 7.4 15.5591 7.4 15.4V13.6C7.4 13.4409 7.46321 13.2883 7.57574 13.1757C7.68826 13.0632 7.84087 13 8 13ZM14 10C14 10.1591 13.9368 10.3117 13.8243 10.4243C13.7117 10.5368 13.5591 10.6 11.6 10.6H11.6C11.4409 10.6 11.2883 10.5368 11.1757 10.4243C11.0632 10.3117 11 10.1591 11 10C11 9.84087 11.0632 9.68826 11.1757 9.57574C11.2883 9.46321 11.4409 9.4 11.6 9.4H13.4C13.5591 9.4 13.7117 9.46321 13.8243 9.57574C13.9368 9.68826 14 9.84087 14 10ZM5 10C5 10.1591 4.93679 10.3117 4.82426 10.4243C4.71174 10.5368 4.55913 10.6 4.4 10.6H2.6C2.44087 10.6 2.28826 10.5368 2.17574 10.4243C2.06321 10.3117 2 10.1591 2 10C2 9.84087 2.06321 9.68826 2.17574 9.57574C2.28826 9.46321 2.44087 9.4 2.6 9.4H4.4C4.55913 9.4 4.71174 9.46321 4.82426 9.57574C4.93679 9.68826 5 9.84087 5 10ZM12.2426 14.2426C12.1301 14.3551 11.9775 14.4183 11.8184 14.4183C11.6593 14.4183 11.5067 14.3551 11.3942 14.2426L10.1216 12.97C10.0123 12.8568 9.95183 12.7053 9.9532 12.548C9.95456 12.3906 10.0177 12.2402 10.1289 12.1289C10.2402 12.0177 10.3906 11.9546 10.548 11.9532C10.7053 11.9518 10.8568 12.0123 10.97 12.1216L12.2426 13.3936C12.2984 13.4493 12.3426 13.5155 12.3728 13.5883C12.403 13.6612 12.4186 13.7393 12.4186 13.8181C12.4186 13.8969 12.403 13.975 12.3728 14.0479C12.3426 14.1207 12.2984 14.1869 12.2426 14.2426ZM5.8784 7.8784C5.76588 7.99088 5.6133 8.05407 5.4542 8.05407C5.2951 8.05407 5.14252 7.99088 5.03 7.8784L3.758 6.6064C3.64542 6.4939 3.58213 6.34127 3.58208 6.18211C3.58202 6.02295 3.6452 5.87028 3.7577 5.7577C3.8702 5.64512 4.02283 5.58183 4.18199 5.58178C4.34115 5.58172 4.49382 5.6449 4.6064 5.7574L5.8784 7.03C5.99088 7.14252 6.05407 7.2951 6.05407 7.4542C6.05407 7.6133 5.99088 7.76588 5.8784 7.8784ZM3.758 14.2426C3.64552 14.1301 3.58233 13.9775 3.58233 13.8184C3.58233 13.6593 3.64552 13.5067 3.758 13.3942L5.0306 12.1216C5.08595 12.0643 5.15216 12.0186 5.22536 11.9871C5.29856 11.9557 5.37729 11.9391 5.45696 11.9384C5.53663 11.9378 5.61563 11.9529 5.68937 11.9831C5.76311 12.0133 5.8301 12.0578 5.88644 12.1142C5.94277 12.1705 5.98732 12.2375 6.01749 12.3112C6.04766 12.385 6.06284 12.464 6.06215 12.5436C6.06146 12.6233 6.04491 12.702 6.01346 12.7752C5.98202 12.8484 5.93631 12.9147 5.879 12.97L4.607 14.2426C4.55128 14.2984 4.4851 14.3426 4.41226 14.3728C4.33943 14.403 4.26135 14.4186 4.1825 14.4186C4.10365 14.4186 4.02557 14.403 3.95274 14.3728C3.8799 14.3426 3.81372 14.2984 3.758 14.2426ZM10.1216 7.8784C10.0091 7.76588 9.94593 7.6133 9.94593 7.4542C9.94593 7.2951 10.0091 7.14252 10.1216 7.03L11.3936 5.7574C11.5061 5.64482 11.6587 5.58153 11.8179 5.58148C11.977 5.58142 12.1297 5.6446 12.2423 5.7571C12.3549 5.86961 12.4182 6.02223 12.4182 6.18139C12.4183 6.34055 12.3551 6.49322 12.2426 6.6058L10.97 7.8784C10.8575 7.99088 10.7049 8.05407 10.5458 8.05407C10.3867 8.05407 10.2341 7.99088 10.1216 7.8784Z"
      fill="#375DFB"
    />
  </Svg>
);

const SUPPORT_TICKET_CATEGORIES = [
  "Payment Issue",
  "Account Issue",
  "Security Concern",
  "Other",
  "Bug",
] as const;

interface AttachmentFile {
  uri?: string;
  name: string;
  sizeKb: number;
  progress: number;
  status: "uploading" | "completed";
}

export const ReportProblemScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const createTicketMutation = useCreateSupportTicketMutation();

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<AttachmentFile | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Modals state
  const [showAttachmentSheet, setShowAttachmentSheet] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Submission state
  const [isSent, setIsSent] = useState(false);

  const isFormValid = category.trim().length > 0 && description.trim().length > 0;
  const isSubmitting = createTicketMutation.isPending;

  // Spin animation for uploading status icon
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (attachment?.status === "uploading") {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [attachment?.status]);

  const startUploadProgress = (uri: string, filename: string, sizeKb: number) => {
    setAttachment({
      uri,
      name: filename,
      sizeKb,
      progress: 15,
      status: "uploading",
    });

    const interval = setInterval(() => {
      setAttachment((prev) => {
        if (!prev || prev.status === "completed") {
          clearInterval(interval);
          return prev;
        }
        const nextProgress = prev.progress + 25;
        if (nextProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            progress: 100,
            status: "completed",
          };
        }
        return {
          ...prev,
          progress: nextProgress,
        };
      });
    }, 350);
  };

  const handlePickFromGallery = async () => {
    setShowAttachmentSheet(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const filename = asset.fileName || "Issue.png";
      const sizeKb = asset.fileSize ? Math.round(asset.fileSize / 1024) : 120;
      startUploadProgress(asset.uri, filename, sizeKb);
    }
  };

  const handlePhotoCaptured = (uri: string) => {
    setShowCamera(false);
    const filename = "ScannedDoc.png";
    startUploadProgress(uri, filename, 120);
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setApiError(null);
    try {
      console.log("🌐 [API Call] Submitting support ticket:", {
        category,
        description,
        attachment: attachment?.name,
      });

      await createTicketMutation.mutateAsync({
        category: category.trim(),
        description: description.trim(),
        attachments: attachment?.uri
          ? { uri: attachment.uri, name: attachment.name, type: "image/jpeg" }
          : undefined,
      });

      setIsSent(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1200);
    } catch (err: any) {
      console.error("❌ [API Error] Failed to submit support ticket:", err?.response?.data || err?.message);
      const backendData = err?.response?.data;
      let msg = "Failed to submit report. Please try again.";
      if (typeof backendData === "string") {
        msg = backendData;
      } else if (backendData && typeof backendData === "object") {
        msg = backendData.detail || backendData.message || backendData.category?.[0] || backendData.description?.[0] || msg;
      } else if (err?.message) {
        msg = err.message;
      }
      setApiError(msg);
    }
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
        style={styles.content}
        contentContainerStyle={{
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          {/* Category Dropdown */}
          <AppDropdown
            label="Category *"
            placeholder="Select category e.g Payment Issue"
            options={SUPPORT_TICKET_CATEGORIES as unknown as string[]}
            value={category}
            onSelect={(val) => {
              setCategory(val);
              if (apiError) setApiError(null);
            }}
            enableSearch={false}
          />

          {/* Description Text Editor */}
          <AppTextEditor
            label="Description *"
            placeholder="Type your message here..."
            value={description}
            onChangeText={(val) => {
              setDescription(val);
              if (apiError) setApiError(null);
            }}
            maxLength={200}
            autoFocus={true}
            onInsertImage={() => setShowAttachmentSheet(true)}
          />

          {/* Attachment Card */}
          {attachment && (
            <View style={styles.attachmentCard}>
              <View style={styles.attachmentTopRow}>
                <View style={styles.attachmentLeft}>
                  <View style={{ marginRight: 12 }}>
                    <FileFormatIconItem filename={attachment.name} size={40} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.attachmentName} numberOfLines={1}>
                      {attachment.name}
                    </Text>
                    <View style={styles.attachmentStatusRow}>
                      <Text style={styles.attachmentSizeText}>
                        {`${Math.round((attachment.progress / 100) * attachment.sizeKb)} KB of ${attachment.sizeKb} KB`}
                      </Text>
                      {attachment.status === "uploading" ? (
                        <View style={styles.uploadingContainer}>
                          <Text style={styles.dotSeparator}> • </Text>
                          <AppLoader size={16} color="#375DFB" />
                          <Text style={styles.uploadingText}>Uploading...</Text>
                        </View>
                      ) : (
                        <View style={styles.uploadingContainer}>
                          <Text style={styles.dotSeparator}> • </Text>
                          <CheckIcon
                            size={13}
                            style={{ marginRight: 2 }}
                          />
                          <Text style={styles.completedText}>Completed</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setAttachment(null)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={20} color="#0F172A" />
                </TouchableOpacity>
              </View>

              {/* Progress Bar Track */}
              {attachment.status === "uploading" && (
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${attachment.progress}%` },
                    ]}
                  />
                </View>
              )}
            </View>
          )}

          {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}
        </View>
      </ScrollView>

      {/* Fixed Bottom Submit Button Footer */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <AppButton
          title={isSent ? "Sent" : "Submit Report"}
          onPress={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          loading={isSubmitting}
          variant={isSent ? "secondary" : "primary"}
          size="lg"
          rightIcon={
            isSent ? (
              <CheckIcon size={18} />
            ) : undefined
          }
        />
      </View>

      {/* Attachment Options Bottom Sheet Modal */}
      <AppBottomSheet
        visible={showAttachmentSheet}
        onClose={() => setShowAttachmentSheet(false)}
        title="Choose Attachment"
      >
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
          onPress={() => {
            setShowAttachmentSheet(false);
            setShowCamera(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.optionRowText}>Scan document</Text>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </AppBottomSheet>

      {/* Camera Viewfinder Modal */}
      <AppCameraModal
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onPhotoCaptured={handlePhotoCaptured}
        initialFacing="back"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: colors.dark,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mainContent: {
    flex: 1,
  },
  attachTriggerBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  attachTriggerText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
  attachmentCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
  },
  attachmentTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  attachmentLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  attachmentName: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  attachmentStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  attachmentSizeText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#868C98",
  },
  dotSeparator: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#868C98",
  },
  uploadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  uploadingText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#0F172A",
  },
  completedText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: colors.dark,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#F6F8FA",
    borderRadius: 3,
    marginTop: 14,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0A0D14",
    borderRadius: 3,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  optionRowText: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: "#0F172A",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: colors.error || "#EF4444",
    marginTop: 8,
  },
});
