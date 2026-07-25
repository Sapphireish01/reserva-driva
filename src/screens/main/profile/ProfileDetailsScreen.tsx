import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraIconItem, EditIconItem, GalleryIconItem } from "../../../components/ProfileIcons";
import { MainStackParamList } from "../../../navigation/types";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "ProfileDetails">;

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400";

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
  const [name, setName] = useState("Sapphire Simi");
  const [email, setEmail] = useState("Sapphire.Edward@hotmail.com");
  const [phone, setPhone] = useState("(555) 000-0000");
  const [address, setAddress] = useState("42 Montgomery Road, Houston");

  // Modals & Sheets
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [cameraPhoto, setCameraPhoto] = useState<string | null>(null);

  // Camera state & permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("front");
  const cameraRef = useRef<CameraView>(null);

  const handleTakePhoto = async () => {
    setShowPhotoOptions(false);
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
      setCameraPhoto(DEFAULT_AVATAR);
    } catch (e) {
      console.warn("Error taking picture:", e);
      setCameraPhoto(DEFAULT_AVATAR);
    }
  };

  const handleChooseFromGallery = async () => {
    setShowPhotoOptions(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Edit Field Modals
  const [editingField, setEditingField] = useState<"name" | "email" | "phone" | "address" | "password" | null>(null);
  const [tempValue, setTempValue] = useState("");

  // Password Edit States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation criteria for Password
  const has8Chars = newPassword.length >= 8;
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword !== "" && newPassword === confirmPassword;
  const isPasswordValid = has8Chars && hasLowerCase && hasUpperCase && hasNumber && hasSpecial && passwordsMatch;

  // OTP Verification States
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpFocusedIdx, setOtpFocusedIdx] = useState<number | null>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const otpInputs = useRef<Array<TextInput | null>>([]);

  const isOtpComplete = otpCode.every((digit) => digit.trim().length > 0);

  const openEditModal = (field: "name" | "email" | "phone" | "address" | "password") => {
    setEditingField(field);
    setOtpStep(false);
    setOtpCode(["", "", "", "", "", ""]);
    setIsSuccess(false);
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
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
    } else if (editingField === "email" || editingField === "phone" || editingField === "password") {
      setOtpStep(true);
    }
  };

  const handleVerifyOtp = () => {
    if (!isOtpComplete || isVerifying || isSuccess) return;
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
              <EditIconItem color="#FFFFFF" size={16} />
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
          <TouchableOpacity style={styles.fieldCard} onPress={() => openEditModal("password")} activeOpacity={0.7}>
            <Text style={styles.fieldValue}>•••••••••</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 1. Edit Profile Picture Bottom Sheet Modal (55% Height) */}
      <Modal visible={showPhotoOptions} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} onPress={() => setShowPhotoOptions(false)} activeOpacity={1} />
          <View style={[styles.sheetContainer, { height: "55%", paddingBottom: Math.max(insets.bottom + 16, 24) }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Edit profile picture</Text>
              <TouchableOpacity onPress={() => setShowPhotoOptions(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.sheetOption}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={{ marginRight: 12 }}>
                  <CameraIconItem color="#868C98" size={20} />
                </View>
                <Text style={styles.optionText}>Take Photo</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetOption}
              onPress={handleChooseFromGallery}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={{ marginRight: 12 }}>
                  <GalleryIconItem color="#868C98" size={20} />
                </View>
                <Text style={styles.optionText}>Choose from gallery</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. Gallery Picker Grid Modal (70% Height) */}
      <Modal visible={showGallery} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} onPress={() => setShowGallery(false)} activeOpacity={1} />
          <View style={[styles.gallerySheetContainer, { height: "70%", paddingBottom: Math.max(insets.bottom + 12, 16) }]}>
            <View style={styles.sheetHandle} />
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
        </View>
      </Modal>

      {/* 3. Camera Viewfinder Modal (80% Height) */}
      <Modal visible={showCamera} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} onPress={() => setShowCamera(false)} activeOpacity={1} />
          <View style={[styles.cameraSheetContainer, { height: "80%" }]}>
            <View style={styles.sheetHandleDark} />
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

                    <View style={styles.shutterSideColRight}>
                      <TouchableOpacity
                        style={styles.cameraFlipBtn}
                        onPress={toggleFacing}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="sync-outline" size={30} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* 4. Edit Field Modal (Name / Email / Phone / Address / Password) (85% Height Sheet) */}
      <Modal visible={!!editingField} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} onPress={() => setEditingField(null)} activeOpacity={1} />
          <View style={[styles.editSheetContainer, { height: "85%", paddingBottom: Math.max(insets.bottom + 16, 24) }]}>
            <View style={styles.sheetHandle} />
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
                        : editingField === "password"
                          ? "Password"
                          : "House Address"}
              </Text>
              {!otpStep ? (
                <TouchableOpacity
                  onPress={handleSaveField}
                  disabled={editingField === "password" && !isPasswordValid}
                >
                  <Text
                    style={[
                      styles.modalSaveText,
                      editingField === "password" && !isPasswordValid && styles.modalSaveTextDisabled,
                    ]}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={{ width: 45 }} />
              )}
            </View>

            {!otpStep ? (
              <View style={[styles.editModalBody, { flex: 1, justifyContent: "space-between" }]}>
                <View>
                  {editingField === "password" ? (
                    <View>
                      <Text style={styles.inputFieldLabel}>Password</Text>
                      <View style={styles.passwordInputCard}>
                        <TextInput
                          style={styles.inputFieldText}
                          value={newPassword}
                          onChangeText={setNewPassword}
                          secureTextEntry={!showNewPassword}
                          placeholder="•••••••••"
                          placeholderTextColor="#94A3B8"
                          autoFocus
                        />
                        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                          <Ionicons name={showNewPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#868C98" />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.requirementHint}>Password must contain at least:</Text>
                      <View style={styles.badgeWrap}>
                        <View style={[styles.reqBadge, has8Chars && styles.reqBadgeSuccess]}>
                          <Text style={[styles.reqBadgeText, has8Chars && styles.reqBadgeTextSuccess]}>8 characters</Text>
                          <Ionicons name="checkmark-circle" size={14} color={has8Chars ? "#22C55E" : "#94A3B8"} style={{ marginLeft: 4 }} />
                        </View>
                        <View style={[styles.reqBadge, hasLowerCase && styles.reqBadgeSuccess]}>
                          <Text style={[styles.reqBadgeText, hasLowerCase && styles.reqBadgeTextSuccess]}>Lower case</Text>
                          <Ionicons name="checkmark-circle" size={14} color={hasLowerCase ? "#22C55E" : "#94A3B8"} style={{ marginLeft: 4 }} />
                        </View>
                        <View style={[styles.reqBadge, hasUpperCase && styles.reqBadgeSuccess]}>
                          <Text style={[styles.reqBadgeText, hasUpperCase && styles.reqBadgeTextSuccess]}>Upper case</Text>
                          <Ionicons name="checkmark-circle" size={14} color={hasUpperCase ? "#22C55E" : "#94A3B8"} style={{ marginLeft: 4 }} />
                        </View>
                        <View style={[styles.reqBadge, hasNumber && styles.reqBadgeSuccess]}>
                          <Text style={[styles.reqBadgeText, hasNumber && styles.reqBadgeTextSuccess]}>Number</Text>
                          <Ionicons name="checkmark-circle" size={14} color={hasNumber ? "#22C55E" : "#94A3B8"} style={{ marginLeft: 4 }} />
                        </View>
                        <View style={[styles.reqBadge, hasSpecial && styles.reqBadgeSuccess]}>
                          <Text style={[styles.reqBadgeText, hasSpecial && styles.reqBadgeTextSuccess]}>Special character</Text>
                          <Ionicons name="checkmark-circle" size={14} color={hasSpecial ? "#22C55E" : "#94A3B8"} style={{ marginLeft: 4 }} />
                        </View>
                      </View>

                      <Text style={[styles.inputFieldLabel, { marginTop: spacing.md }]}>Confirm Password</Text>
                      <View style={styles.passwordInputCard}>
                        <TextInput
                          style={styles.inputFieldText}
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          secureTextEntry={!showConfirmPassword}
                          placeholder="•••••••••"
                          placeholderTextColor="#94A3B8"
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                          <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#868C98" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : editingField === "phone" ? (
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

                <View style={styles.sheetFooterNote}>
                  <Text style={styles.footerNoteText}>For your security, we verify every account.</Text>
                </View>
              </View>
            ) : (
              <View style={[styles.editModalBody, { flex: 1, justifyContent: "space-between" }]}>
                <View>
                  <Text style={styles.otpTitle}>OTP Verification</Text>
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
                      !isOtpComplete && styles.verifyButtonDisabled,
                      isSuccess && styles.verifyButtonSuccess,
                    ]}
                    onPress={handleVerifyOtp}
                    disabled={!isOtpComplete || isVerifying || isSuccess}
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
                      <Text style={[styles.verifyBtnText, !isOtpComplete && styles.verifyBtnTextDisabled]}>
                        Verify Code
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.sheetFooterNote}>
                  <Text style={styles.footerNoteText}>For your security, we verify every account.</Text>
                </View>
              </View>
            )}
          </View>
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
    fontSize: 20,
    fontWeight: "700",
    color: colors.dark,
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
    backgroundColor: "#868C98",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
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
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
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
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
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
  sheetHandle: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  sheetHandleDark: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    alignSelf: "center",
    position: "absolute",
    top: 8,
    zIndex: 10,
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: 4,
  },
  gallerySheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: 4,
  },
  cameraSheetContainer: {
    backgroundColor: "#000000",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  editSheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: 4,
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
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
  },

  /* Gallery Modal Styles */
  galleryContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  galleryGrid: { padding: 4 },
  galleryThumbContainer: { flex: 1 / 3, aspectRatio: 1, padding: 3 },
  galleryThumb: { width: "100%", height: "100%", borderRadius: 6 },

  /* Camera Modal Styles */
  cameraScreenContainer: { flex: 1, backgroundColor: "#000000" },
  fullCameraPreview: { flex: 1, width: "100%", resizeMode: "cover" },
  cameraBottomBar: {
    backgroundColor: "rgba(135, 126, 112, 0.5)",
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
  modalSaveTextDisabled: { color: "#CBD5E1" },
  editModalBody: { padding: spacing.lg },
  inputFieldLabel: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#0F172A", marginBottom: 6 },
  inputCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInputCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  phoneInputPrefix: { fontFamily: "DM Sans Bold", fontSize: 15, marginRight: 8, color: "#0F172A" },
  inputFieldText: { flex: 1, fontFamily: "DM Sans", fontSize: 15, color: "#0F172A" },
  requirementHint: { fontFamily: "DM Sans", fontSize: 13, color: "#868C98", marginTop: 8, marginBottom: 6 },
  badgeWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  reqBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#F8FAFC",
  },
  reqBadgeSuccess: { borderColor: "#22C55E", backgroundColor: "#F0FDF4" },
  reqBadgeText: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B" },
  reqBadgeTextSuccess: { color: "#166534", fontFamily: "DM Sans Bold", fontWeight: "600" },

  /* OTP Edit Styles */
  otpTitle: { fontFamily: "DM Sans Bold", fontSize: 22, fontWeight: "700", color: "#0F172A", marginBottom: 6 },
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
  verifyButtonDisabled: { backgroundColor: "#F1F5F9" },
  verifyButtonSuccess: { backgroundColor: "#375DFB" },
  verifyRow: { flexDirection: "row", alignItems: "center" },
  verifyBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  verifyBtnTextDisabled: { color: "#94A3B8" },
  sheetFooterNote: { alignItems: "center", paddingVertical: 16, marginTop: "auto" },
  footerNoteText: { fontFamily: "DM Sans", fontSize: 13, color: "#94A3B8", textAlign: "center" },
});
