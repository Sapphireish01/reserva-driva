import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "ProfileDetails">;

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400";

const GALLERY_PHOTOS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
];

export const ProfileDetailsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  // Profile States
  const [profileImage, setProfileImage] = useState(DEFAULT_AVATAR);
  const [name, setName] = useState("Prosper Edward");
  const [email, setEmail] = useState("Prosper.Edward@hotmail.com");
  const [phone, setPhone] = useState("(555) 000-0000");
  const [address, setAddress] = useState("42 Montgomery Road, Houston");

  // Modals & Sheets
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [cameraPhoto, setCameraPhoto] = useState<string | null>(null);

  // Edit Field Modals
  const [editingField, setEditingField] = useState<"name" | "email" | "phone" | "address" | null>(null);
  const [tempValue, setTempValue] = useState("");

  // OTP Verification States
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpFocusedIdx, setOtpFocusedIdx] = useState<number | null>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const otpInputs = useRef<Array<TextInput | null>>([]);

  const openEditModal = (field: "name" | "email" | "phone" | "address") => {
    setEditingField(field);
    setOtpStep(false);
    setOtpCode(["", "", "", "", "", ""]);
    setIsSuccess(false);
    if (field === "name") setTempValue(name);
    if (field === "email") setTempValue(email);
    if (field === "phone") setTempValue(phone);
    if (field === "address") setTempValue(address);
  };

  const handleSaveField = () => {
    if (editingField === "name") {
      setName(tempValue);
      setEditingField(null);
    } else if (editingField === "address") {
      setAddress(tempValue);
      setEditingField(null);
    } else if (editingField === "email" || editingField === "phone") {
      setOtpStep(true);
    }
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        if (editingField === "email") setEmail(tempValue);
        if (editingField === "phone") setPhone(tempValue);
        setEditingField(null);
        setOtpStep(false);
      }, 1000);
    }, 1200);
  };

  const handleOtpChange = (text: string, index: number) => {
    const newCode = [...otpCode];
    newCode[index] = text;
    setOtpCode(newCode);
    if (text && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setShowPhotoOptions(true)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color="#475569" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Profile Details List */}
        <View style={styles.fieldsContainer}>
          {/* Name Field */}
          <Text style={styles.fieldLabel}>Name</Text>
          <TouchableOpacity style={styles.fieldCard} onPress={() => openEditModal("name")} activeOpacity={0.7}>
            <Text style={styles.fieldValue}>{name}</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Email Address Field */}
          <Text style={styles.fieldLabel}>Email Address</Text>
          <TouchableOpacity style={styles.fieldCard} onPress={() => openEditModal("email")} activeOpacity={0.7}>
            <Text style={styles.fieldValue}>{email}</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Phone Number Field */}
          <Text style={styles.fieldLabel}>Phone Number</Text>
          <TouchableOpacity style={styles.fieldCard} onPress={() => openEditModal("phone")} activeOpacity={0.7}>
            <View style={styles.phoneValueRow}>
              <Text style={styles.flagEmoji}>🇺🇸</Text>
              <Text style={styles.fieldValue}>{phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* House Address Field */}
          <Text style={styles.fieldLabel}>House Address</Text>
          <TouchableOpacity style={styles.fieldCard} onPress={() => openEditModal("address")} activeOpacity={0.7}>
            <Text style={styles.fieldValue}>{address}</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Password Field */}
          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.fieldCard}>
            <Text style={styles.fieldValue}>•••••••••</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate("ForgotPassword")} activeOpacity={0.7}>
              <Ionicons name="create-outline" size={18} color="#475569" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 1. Edit Profile Picture Bottom Sheet Modal */}
      <Modal visible={showPhotoOptions} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} onPress={() => setShowPhotoOptions(false)} />
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Edit profile picture</Text>
              <TouchableOpacity onPress={() => setShowPhotoOptions(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.sheetOption}
              onPress={() => {
                setShowPhotoOptions(false);
                setCameraPhoto(null);
                setShowCamera(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <Ionicons name="camera-outline" size={20} color="#475569" style={{ marginRight: 12 }} />
                <Text style={styles.optionText}>Take Photo</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetOption}
              onPress={() => {
                setShowPhotoOptions(false);
                setShowGallery(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <Ionicons name="images-outline" size={20} color="#475569" style={{ marginRight: 12 }} />
                <Text style={styles.optionText}>Choose from gallery</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. Gallery Picker Grid Modal */}
      <Modal visible={showGallery} animationType="slide">
        <View style={[styles.galleryContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowGallery(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Select Photo</Text>
            <View style={{ width: 60 }} />
          </View>

          <FlatList
            data={GALLERY_PHOTOS}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.galleryGrid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.galleryThumbContainer}
                onPress={() => {
                  setProfileImage(item);
                  setShowGallery(false);
                }}
                activeOpacity={0.8}
              >
                <Image source={{ uri: item }} style={styles.galleryThumb} />
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* 3. Camera Viewfinder Modal */}
      <Modal visible={showCamera} animationType="slide">
        <View style={styles.cameraScreenContainer}>
          {cameraPhoto ? (
            <Image source={{ uri: cameraPhoto }} style={styles.fullCameraPreview} />
          ) : (
            <View style={styles.cameraPlaceholderView}>
              <Text style={styles.cameraPlaceholderText}>Camera Viewfinder</Text>
            </View>
          )}

          {/* Camera Bottom Bar */}
          <View style={[styles.cameraBottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            {cameraPhoto ? (
              <View style={styles.cameraActionRow}>
                <TouchableOpacity onPress={() => setCameraPhoto(null)}>
                  <Text style={styles.cameraActionText}>Retake Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setProfileImage(cameraPhoto);
                    setShowCamera(false);
                    setCameraPhoto(null);
                  }}
                >
                  <Text style={styles.cameraActionText}>Use Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.cameraShutterRow}>
                <TouchableOpacity onPress={() => setShowCamera(false)}>
                  <Text style={styles.cameraActionText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.shutterRing}
                  onPress={() => setCameraPhoto(DEFAULT_AVATAR)}
                  activeOpacity={0.8}
                >
                  <View style={styles.shutterDot} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cameraFlipBtn}
                  onPress={() => {
                    // Camera flip trigger
                  }}
                >
                  <Ionicons name="sync-outline" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* 4. Edit Field Modal (Name / Email / Phone / Address) */}
      <Modal visible={!!editingField} animationType="slide">
        <View style={[styles.editModalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditingField(null)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>
              {otpStep
                ? "OTP Verification"
                : editingField === "name"
                ? "Name"
                : editingField === "email"
                ? "Email Address"
                : editingField === "phone"
                ? "Phone Number"
                : "House Address"}
            </Text>
            {!otpStep ? (
              <TouchableOpacity onPress={handleSaveField}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 40 }} />
            )}
          </View>

          {!otpStep ? (
            <View style={styles.editModalBody}>
              {editingField === "phone" ? (
                <View style={styles.inputCard}>
                  <Text style={styles.phoneInputPrefix}>🇺🇸 +1</Text>
                  <TextInput
                    style={styles.inputFieldText}
                    value={tempValue}
                    onChangeText={setTempValue}
                    keyboardType="phone-pad"
                    autoFocus
                  />
                </View>
              ) : (
                <View style={styles.inputCard}>
                  <TextInput
                    style={styles.inputFieldText}
                    value={tempValue}
                    onChangeText={setTempValue}
                    autoCapitalize={editingField === "name" ? "words" : "none"}
                    keyboardType={editingField === "email" ? "email-address" : "default"}
                    autoFocus
                  />
                </View>
              )}
            </View>
          ) : (
            <View style={styles.editModalBody}>
              <Text style={styles.otpSubtitle}>
                We sent a six digit code to your email address and phone number
              </Text>

              <View style={styles.otpRow}>
                {otpCode.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(ref) => {
                      otpInputs.current[idx] = ref;
                    }}
                    style={[styles.otpBox, otpFocusedIdx === idx && styles.otpBoxFocused]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(t) => handleOtpChange(t, idx)}
                    onFocus={() => setOtpFocusedIdx(idx)}
                    selectTextOnFocus
                  />
                ))}
              </View>

              <Text style={styles.timerText}>
                Code expires in <Text style={styles.timerBold}>1:24s</Text>
              </Text>

              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  isSuccess && styles.verifyButtonSuccess,
                ]}
                onPress={handleVerifyOtp}
                activeOpacity={0.85}
              >
                {isVerifying ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : isSuccess ? (
                  <View style={styles.verifyRow}>
                    <Text style={styles.verifyBtnText}>Updated Successfully</Text>
                    <Ionicons name="checkmark-circle" size={18} color="#22C55E" style={{ marginLeft: 6 }} />
                  </View>
                ) : (
                  <Text style={styles.verifyBtnText}>Verify Code</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
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
    color: "#0F172A",
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E2E8F0",
  },
  editBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  fieldsContainer: {
    marginTop: spacing.md,
  },
  fieldLabel: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
    marginLeft: 2,
  },
  fieldCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginBottom: spacing.lg,
    backgroundColor: "#FFFFFF",
  },
  phoneValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flagEmoji: {
    fontSize: 18,
  },
  fieldValue: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: "#0F172A",
  },

  /* Bottom Sheet Styles */
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    paddingBottom: spacing.xl * 1.5,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  sheetTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  /* Gallery Modal Styles */
  galleryContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  galleryGrid: { padding: 4 },
  galleryThumbContainer: { flex: 1 / 3, aspectRatio: 1, padding: 3 },
  galleryThumb: { width: "100%", height: "100%", borderRadius: 6 },

  /* Camera Modal Styles */
  cameraScreenContainer: { flex: 1, backgroundColor: "#000000" },
  fullCameraPreview: { flex: 1, width: "100%" },
  cameraPlaceholderView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#292524",
  },
  cameraPlaceholderText: { color: "#E2E8F0", fontFamily: "DM Sans", fontSize: 16 },
  cameraBottomBar: {
    backgroundColor: "rgba(100, 116, 139, 0.9)",
    paddingVertical: 24,
    paddingHorizontal: spacing.lg,
  },
  cameraActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cameraShutterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cameraActionText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  shutterRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterDot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
  },
  cameraFlipBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Edit Modal Styles */
  editModalContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalHeaderTitle: { fontFamily: "DM Sans Bold", fontSize: 16, fontWeight: "700", color: "#0F172A" },
  modalCancelText: { fontFamily: "DM Sans", fontSize: 15, color: "#94A3B8" },
  modalSaveText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#0F172A" },
  editModalBody: { padding: spacing.lg },
  inputCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  phoneInputPrefix: { fontFamily: "DM Sans Bold", fontSize: 15, marginRight: 8, color: "#0F172A" },
  inputFieldText: { flex: 1, fontFamily: "DM Sans", fontSize: 15, color: "#0F172A" },

  /* OTP Edit Styles */
  otpSubtitle: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#868C98",
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  otpRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: spacing.md,
  },
  otpBox: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    textAlign: "center",
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    color: "#0F172A",
  },
  otpBoxFocused: { borderColor: "#0F172A" },
  timerText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#868C98",
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  timerBold: { fontFamily: "DM Sans Bold", fontWeight: "700", color: "#0F172A" },
  verifyButton: {
    backgroundColor: "#375DFB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyButtonSuccess: { backgroundColor: "#375DFB" },
  verifyRow: { flexDirection: "row", alignItems: "center" },
  verifyBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
});
