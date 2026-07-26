import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraIconItem, EditIconItem, GalleryIconItem } from "../../../components/ProfileIcons";
import {
  AppBottomSheet,
  AppCameraModal,
  AppFullScreenModal,
  AppTextInput,
  OTPForm
} from "../../../components/ui";
import { MainStackParamList } from "../../../navigation/types";
import { colors } from "../../../theme/colors";

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

  // Edit Field Modal
  const [editingField, setEditingField] = useState<"name" | "email" | "phone" | "address" | "password" | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP Verification Step
  const [otpStep, setOtpStep] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const openEditModal = (field: "name" | "email" | "phone" | "address" | "password") => {
    setEditingField(field);
    setOtpStep(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (editingField === "email") setEmail(tempValue);
      if (editingField === "phone") setPhone(tempValue);
      setEditingField(null);
      setOtpStep(false);
    }, 1200);
  };

  const handleChooseFromGallery = async () => {
    setShowPhotoOptions(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
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
          <Text style={styles.fieldLabel}>Name</Text>
          <TouchableOpacity style={styles.fieldCard} onPress={() => openEditModal("name")} activeOpacity={0.7}>
            <Text style={styles.fieldValue}>{name}</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>Email Address</Text>
          <TouchableOpacity style={styles.fieldCard} onPress={() => openEditModal("email")} activeOpacity={0.7}>
            <Text style={styles.fieldValue}>{email}</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>Phone Number</Text>
          <TouchableOpacity style={styles.fieldCard} onPress={() => openEditModal("phone")} activeOpacity={0.7}>
            <View style={styles.phoneValueRow}>
              <Text style={styles.flagEmoji}>🇺🇸</Text>
              <Text style={styles.fieldValue}>{phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>House Address</Text>
          <TouchableOpacity style={styles.fieldCard} onPress={() => openEditModal("address")} activeOpacity={0.7}>
            <Text style={styles.fieldValue}>{address}</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>Password</Text>
          <TouchableOpacity style={styles.fieldCard} onPress={() => openEditModal("password")} activeOpacity={0.7}>
            <Text style={styles.fieldValue}>•••••••••</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Photo Options Bottom Sheet */}
      <AppBottomSheet
        visible={showPhotoOptions}
        onClose={() => setShowPhotoOptions(false)}
        title="Edit profile picture"
      >
        <TouchableOpacity
          style={styles.sheetOption}
          onPress={() => {
            setShowPhotoOptions(false);
            setShowCamera(true);
          }}
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
      </AppBottomSheet>

      {/* Gallery Grid Bottom Sheet */}
      <AppBottomSheet
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        title="Select Photo"
        maxHeight="75%"
      >
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
      </AppBottomSheet>

      {/* Camera Viewfinder Modal */}
      <AppCameraModal
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onPhotoCaptured={(uri) => setProfileImage(uri)}
        initialFacing="front"
      />

      {/* Edit Field Modal */}
      <AppFullScreenModal
        visible={!!editingField}
        onClose={() => setEditingField(null)}
        title={
          otpStep
            ? "OTP Verification"
            : editingField === "name"
              ? "Name"
              : editingField === "email"
                ? "Email Address"
                : editingField === "phone"
                  ? "Phone Number"
                  : editingField === "password"
                    ? "Password"
                    : "House Address"
        }
        rightActionText={!otpStep ? "Save" : undefined}
        onRightAction={!otpStep ? handleSaveField : undefined}
      >
        <View style={styles.editModalContent}>
          {otpStep ? (
            <OTPForm
              onComplete={handleVerifyOtp}
              loading={isVerifying}
            />
          ) : editingField === "password" ? (
            <View style={{ width: "100%" }}>
              <AppTextInput
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                isPassword
                autoFocus={true}
              />
              <AppTextInput
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                isPassword
              />
              <AppTextInput
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
              />
            </View>
          ) : (
            <AppTextInput
              label={`Edit ${editingField}`}
              value={tempValue}
              onChangeText={setTempValue}
              autoFocus={true}
            />
          )}
        </View>
      </AppFullScreenModal>
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
    color: "#0F172A",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    width: 100,
    height: 100,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grey,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  fieldsContainer: {
    width: "100%",
  },
  fieldLabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: colors.dark,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 14,
  },
  fieldCard: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  fieldValue: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  phoneValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#F6F8FA",
    borderRadius: 16,
    marginVertical: 6,
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
  galleryGrid: {
    paddingVertical: 12,
  },
  galleryThumbContainer: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 4,
  },
  galleryThumb: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  editModalContent: {
    padding: 20,
  },
});
