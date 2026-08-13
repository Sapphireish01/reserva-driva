import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import {
  Clipboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CopyIconItem, EditIconItem } from "../../../components/ProfileIcons";
import {
  AppBottomSheet,
  AppButton,
  AppFullScreenModal,
  AppPhoneInput,
  AppPhoneInputRef,
  AppTextInput,
  EmergencyContactCardSkeleton,
} from "../../../components/ui";
import { EmergencyContact } from "../../../api/services/emergency";
import {
  useCreateEmergencyContactMutation,
  useDeleteEmergencyContactMutation,
  useEmergencyContacts,
  useUpdateEmergencyContactMutation,
} from "../../../hooks/useEmergencyContacts";
import { MainStackParamList } from "../../../navigation/types";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "EmergencyContacts">;

export const EmergencyContactsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const phoneInputRef = useRef<AppPhoneInputRef>(null);

  // API Queries & Mutations
  const { data: contacts = [], isLoading } = useEmergencyContacts();
  const createContactMutation = useCreateEmergencyContactMutation();
  const updateContactMutation = useUpdateEmergencyContactMutation();
  const deleteContactMutation = useDeleteEmergencyContactMutation();

  // Active state modals
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("1");
  const [formError, setFormError] = useState<string | null>(null);

  // Toast copied notification
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const getFormattedPhone = (contact: EmergencyContact): string => {
    if (contact.full_phone_number) return contact.full_phone_number;
    if (contact.phone_code && contact.phone_number) {
      return `${contact.phone_code}${contact.phone_number}`;
    }
    return contact.phone_number || "";
  };

  const handleCopyPhone = (phone: string) => {
    Clipboard.setString(phone);
    setShowCopiedToast(true);
    setTimeout(() => {
      setShowCopiedToast(false);
    }, 1800);
  };

  const openAddContact = () => {
    setIsEditing(false);
    setContactName("");
    setContactPhone("");
    setFormError(null);
    setShowAddEditModal(true);
  };

  const openEditContact = () => {
    if (!selectedContact) return;
    setIsEditing(true);
    setContactName(selectedContact.name);
    setContactPhone(selectedContact.phone_number || "");
    setFormError(null);
    setShowDetailsSheet(false);
    setShowAddEditModal(true);
  };

  const handleSaveContact = async () => {
    if (!contactName.trim()) {
      setFormError("Contact name is required");
      return;
    }
    if (!contactPhone.trim()) {
      setFormError("Phone number is required");
      return;
    }

    setFormError(null);
    const selectedCountryObj = phoneInputRef.current?.getSelectedCountry();
    const countryId = selectedCountryObj?.id ?? selectedContact?.country ?? 1;

    try {
      if (isEditing && selectedContact) {
        await updateContactMutation.mutateAsync({
          id: selectedContact.id,
          name: contactName.trim(),
          country: countryId,
          phone_number: contactPhone.trim(),
        });
      } else {
        await createContactMutation.mutateAsync({
          name: contactName.trim(),
          country: countryId,
          phone_number: contactPhone.trim(),
        });
      }
      setShowAddEditModal(false);
    } catch (err: any) {
      console.error("❌ [API Error] Failed to save emergency contact:", err?.response?.data || err?.message);
      const backendData = err?.response?.data;
      let msg = "Failed to save contact. Please try again.";
      if (typeof backendData === "string") {
        msg = backendData;
      } else if (backendData && typeof backendData === "object") {
        msg = backendData.detail || backendData.message || backendData.name?.[0] || backendData.phone_number?.[0] || msg;
      } else if (err?.message) {
        msg = err.message;
      }
      setFormError(msg);
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    try {
      await deleteContactMutation.mutateAsync(selectedContact.id);
      setShowDeleteModal(false);
      setShowDetailsSheet(false);
      setSelectedContact(null);
    } catch (err: any) {
      console.error("❌ [API Error] Failed to delete emergency contact:", err?.response?.data || err?.message);
    }
  };

  const isSaving = createContactMutation.isPending || updateContactMutation.isPending;
  const isDeleting = deleteContactMutation.isPending;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Toast */}
      {showCopiedToast && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>Copied!</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddContact} activeOpacity={0.7}>
          <Ionicons name="add" size={26} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <EmergencyContactCardSkeleton />
          <EmergencyContactCardSkeleton />
          <EmergencyContactCardSkeleton />
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {contacts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Emergency Contacts</Text>
              <Text style={styles.emptySubtitle}>
                Tap the + button above to add a contact for your safety on the road.
              </Text>
              <AppButton
                title="Add Emergency Contact"
                onPress={openAddContact}
                style={{ marginTop: 16 }}
              />
            </View>
          ) : (
            contacts.map((contact) => {
              const formattedPhone = getFormattedPhone(contact);
              return (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.contactCard}
                  onPress={() => {
                    setSelectedContact(contact);
                    setShowDetailsSheet(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.contactName} numberOfLines={1}>
                    {contact.name}
                  </Text>
                  <View style={styles.phoneRow}>
                    <Text style={styles.contactPhone}>{formattedPhone}</Text>
                    <TouchableOpacity
                      onPress={() => handleCopyPhone(formattedPhone)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <View style={{ marginLeft: 8 }}>
                        <CopyIconItem color="#94A3B8" size={18} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Contact Details Bottom Sheet */}
      <AppBottomSheet
        visible={showDetailsSheet}
        onClose={() => setShowDetailsSheet(false)}
        title="Contact Details"
      >
        <TouchableOpacity style={styles.sheetOption} onPress={openEditContact} activeOpacity={0.7}>
          <View style={styles.optionLeft}>
            <View style={{ marginRight: 12 }}>
              <EditIconItem color="#475569" size={20} />
            </View>
            <Text style={styles.optionText}>Edit contact</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sheetOption}
          onPress={() => setShowDeleteModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="trash-outline" size={20} color="#475569" style={{ marginRight: 12 }} />
            <Text style={styles.optionText}>Delete contact</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </AppBottomSheet>

      {/* Add / Edit Contact Full Modal */}
      <AppFullScreenModal
        visible={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        title={isEditing ? "Edit Contact" : "Add Contact"}
        rightActionText="Save"
        onRightAction={handleSaveContact}
      >
        <View style={styles.modalBody}>
          <AppTextInput
            label="Contact Name *"
            placeholder="e.g Prosper Edward"
            value={contactName}
            onChangeText={(val) => {
              setContactName(val);
              if (formError) setFormError(null);
            }}
            autoCapitalize="words"
            autoFocus={true}
          />

          <AppPhoneInput
            ref={phoneInputRef}
            label="Phone Number *"
            value={contactPhone}
            onChangeText={(val) => {
              setContactPhone(val);
              if (formError) setFormError(null);
            }}
            onCountryCodeChange={setSelectedCountryCode}
            error={formError || undefined}
          />

          <AppButton
            title={isSaving ? "Saving..." : "Save Contact"}
            onPress={handleSaveContact}
            loading={isSaving}
            disabled={isSaving}
            size="lg"
            style={{ marginTop: 24 }}
          />
        </View>
      </AppFullScreenModal>

      {/* Delete Confirmation Bottom Sheet */}
      <AppBottomSheet
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contact?"
      >
        <Text style={styles.sheetSubtitle}>
          Are you sure you want to delete this contact?
        </Text>
        <View style={styles.deleteActionColumn}>
          <AppButton
            title={isDeleting ? "Deleting..." : "Delete Contact"}
            onPress={handleDeleteContact}
            loading={isDeleting}
            disabled={isDeleting}
            variant="destructive"
            size="lg"
            style={{ borderRadius: 14 }}
          />
          <AppButton
            title="Cancel"
            onPress={() => setShowDeleteModal(false)}
            disabled={isDeleting}
            size="lg"
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
      </AppBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  addButton: { width: 40, height: 40, justifyContent: "center", alignItems: "flex-end" },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, flexGrow: 1 },
  contactCard: {
    backgroundColor: "#F6F8FA",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactName: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: colors.grey,
    flex: 1,
    marginRight: 8,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactPhone: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  optionLeft: { flexDirection: "row", alignItems: "center" },
  optionText: { fontFamily: "DM Sans", fontSize: 15, color: "#0F172A" },
  modalBody: { padding: 20 },
  sheetSubtitle: { fontFamily: "DM Sans", fontSize: 15, color: colors.grey, marginBottom: 20 },
  deleteActionColumn: { flexDirection: "column", gap: 12, marginTop: 4 },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  cancelButtonText: {
    color: colors.grey,
    fontFamily: "DM Sans Bold",
  },
  toastContainer: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    backgroundColor: "#0F172A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 999,
  },
  toastText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#FFFFFF" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    color: "#0F172A",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  errorText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: colors.error || "#EF4444",
    marginTop: 4,
  },
});
