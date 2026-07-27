import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
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
  AppTextInput,
} from "../../../components/ui";
import { MainStackParamList } from "../../../navigation/types";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "EmergencyContacts">;

interface Contact {
  id: string;
  name: string;
  phone: string;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: "1", name: "Prosper Edward", phone: "+23428495069" },
  { id: "2", name: "Edward Prosper", phone: "+23428495069" },
];

export const EmergencyContactsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);

  // Active state modals
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Toast copied notification
  const [showCopiedToast, setShowCopiedToast] = useState(false);

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
    setShowAddEditModal(true);
  };

  const openEditContact = () => {
    if (!selectedContact) return;
    setIsEditing(true);
    setContactName(selectedContact.name);
    setContactPhone(selectedContact.phone);
    setShowDetailsSheet(false);
    setShowAddEditModal(true);
  };

  const handleSaveContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) return;
    if (isEditing && selectedContact) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id
            ? { ...c, name: contactName.trim(), phone: contactPhone.trim() }
            : c
        )
      );
    } else {
      const newContact: Contact = {
        id: Date.now().toString(),
        name: contactName.trim(),
        phone: contactPhone.trim(),
      };
      setContacts((prev) => [...prev, newContact]);
    }
    setShowAddEditModal(false);
  };

  const handleDeleteContact = () => {
    if (!selectedContact) return;
    setContacts((prev) => prev.filter((c) => c.id !== selectedContact.id));
    setShowDeleteModal(false);
    setShowDetailsSheet(false);
    setSelectedContact(null);
  };

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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {contacts.map((contact) => (
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
              <Text style={styles.contactPhone}>{contact.phone}</Text>
              <TouchableOpacity
                onPress={() => handleCopyPhone(contact.phone)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={{ marginLeft: 8 }}>
                  <CopyIconItem color="#94A3B8" size={18} />
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
            onChangeText={setContactName}
            autoCapitalize="words"
            autoFocus={true}
          />

          <AppTextInput
            label="Phone Number *"
            placeholder="(000) 000-0000"
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
          />

          <AppButton
            title="Save Contact"
            onPress={handleSaveContact}
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
            title="Delete Contact"
            onPress={handleDeleteContact}
            variant="destructive"
            size="lg"
            style={{ borderRadius: 14 }}
          />
          <AppButton
            title="Cancel"
            onPress={() => setShowDeleteModal(false)}
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
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
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
});
