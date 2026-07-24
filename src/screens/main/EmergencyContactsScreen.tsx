import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Clipboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

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
      {/* Copied Tooltip Toast */}
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
            <Text style={styles.contactName}>{contact.name}</Text>
            <View style={styles.phoneRow}>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
              <TouchableOpacity
                onPress={() => handleCopyPhone(contact.phone)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="copy-outline" size={16} color="#94A3B8" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 1. Contact Details Bottom Sheet Modal */}
      <Modal visible={showDetailsSheet} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.sheetBackdrop}
            onPress={() => setShowDetailsSheet(false)}
          />
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Contact Details</Text>
              <TouchableOpacity onPress={() => setShowDetailsSheet(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.sheetOption} onPress={openEditContact} activeOpacity={0.7}>
              <View style={styles.optionLeft}>
                <Ionicons name="create-outline" size={20} color="#475569" style={{ marginRight: 12 }} />
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
          </View>
        </View>
      </Modal>

      {/* 2. Add / Edit Contact Modal */}
      <Modal visible={showAddEditModal} animationType="slide">
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddEditModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>
              {isEditing ? "Edit Contact" : "Add Contact"}
            </Text>
            <TouchableOpacity onPress={handleSaveContact}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputCard}>
              <TextInput
                style={styles.inputField}
                placeholder="e.g Prosper Edward"
                placeholderTextColor="#94A3B8"
                value={contactName}
                onChangeText={setContactName}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputCard, { marginTop: spacing.md }]}>
              <Text style={styles.countryPrefix}>🇳🇬 +234</Text>
              <TextInput
                style={styles.inputField}
                placeholder="(000) 000-0000"
                placeholderTextColor="#94A3B8"
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* 3. Delete Contact Confirmation Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteDialog}>
            <View style={styles.deleteHeader}>
              <Text style={styles.deleteTitle}>Delete Contact?</Text>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.deleteSubtitle}>
              Are you sure you want to delete this contact?
            </Text>

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteContact} activeOpacity={0.8}>
              <Text style={styles.deleteBtnText}>Delete Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowDeleteModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
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
  toastContainer: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#0F172A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 999,
  },
  toastText: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700",
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
  addButton: {
    width: 40,
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginBottom: spacing.sm,
  },
  contactName: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#475569",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactPhone: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "700",
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

  /* Add/Edit Modal Styles */
  modalContainer: { flex: 1, backgroundColor: "#FFFFFF" },
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
  modalBody: { padding: spacing.lg },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  countryPrefix: { fontFamily: "DM Sans Bold", fontSize: 14, marginRight: 8, color: "#0F172A" },
  inputField: { flex: 1, fontFamily: "DM Sans", fontSize: 15, color: "#0F172A" },

  /* Delete Confirmation Modal Styles */
  deleteOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  deleteDialog: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: spacing.lg,
  },
  deleteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  deleteTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  deleteSubtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", marginBottom: spacing.lg },
  deleteBtn: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  deleteBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "600", color: "#475569" },
});
