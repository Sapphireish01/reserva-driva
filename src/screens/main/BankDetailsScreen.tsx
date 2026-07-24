import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "BankDetails">;

const SUPPORTED_BANKS = [
  "Zenith",
  "Access",
  "Polaris",
  "Opay",
  "GTBank",
  "Kuda",
  "First Bank",
  "UBA",
  "Stanbic IBTC",
  "Moniepoint",
];

export const BankDetailsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const [bankName, setBankName] = useState("Zenith");
  const [accountNumber, setAccountNumber] = useState("********0000");
  const [accountName, setAccountName] = useState("Drifully");

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBank, setEditBank] = useState("Zenith");
  const [editAccNo, setEditAccNo] = useState("");
  const [resolvedAccountName, setResolvedAccountName] = useState("");
  const [isResolving, setIsResolving] = useState(false);

  // Bank Picker Sub-Sheet
  const [showBankPickerSheet, setShowBankPickerSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenEdit = () => {
    setEditBank(bankName);
    setEditAccNo("");
    setResolvedAccountName("");
    setShowEditModal(true);
  };

  const handleAccNoChange = (text: string) => {
    setEditAccNo(text);
    if (text.trim().length === 10) {
      setIsResolving(true);
      setTimeout(() => {
        setIsResolving(false);
        setResolvedAccountName("Onyekele Selemu");
      }, 600);
    } else {
      setResolvedAccountName("");
    }
  };

  const handleSave = () => {
    if (!editBank || !editAccNo || !resolvedAccountName) return;
    setBankName(editBank);
    const masked = editAccNo.length >= 4 ? `********${editAccNo.slice(-4)}` : editAccNo;
    setAccountNumber(masked);
    setAccountName(resolvedAccountName);
    setShowEditModal(false);
  };

  const filteredBanks = SUPPORTED_BANKS.filter((b) =>
    b.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const isFormValid = editBank.length > 0 && editAccNo.length === 10 && resolvedAccountName.length > 0;

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
        <Text style={styles.headerTitle}>Bank Details</Text>
        <TouchableOpacity
          style={styles.editIconButton}
          onPress={handleOpenEdit}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Bank Name</Text>
              <Text style={styles.infoValue}>{bankName}</Text>
            </View>
            <View style={[styles.infoCol, { alignItems: "flex-end" }]}>
              <Text style={styles.infoLabel}>Account Number</Text>
              <Text style={styles.infoValue}>{accountNumber}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Account Name</Text>
            <Text style={styles.infoValue}>{accountName}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit Bank Details Modal */}
      <Modal visible={showEditModal} animationType="slide">
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Edit Bank Details</Text>
            <TouchableOpacity onPress={handleSave} disabled={!isFormValid}>
              <Text style={[styles.modalSaveText, !isFormValid && styles.modalSaveTextDisabled]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Bank Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Bank</Text>
              <TouchableOpacity
                style={styles.dropdownCard}
                onPress={() => setShowBankPickerSheet(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownValue, !editBank && styles.placeholderText]}>
                  {editBank || "e.g Zenith"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Account Number Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Account Number</Text>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g 0000000000"
                  placeholderTextColor="#94A3B8"
                  value={editAccNo}
                  onChangeText={handleAccNoChange}
                  keyboardType="number-pad"
                  maxLength={10}
                />
                {isResolving && <ActivityIndicator size="small" color="#375DFB" />}
                {!isResolving && resolvedAccountName.length > 0 && (
                  <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                )}
              </View>

              {/* Resolved Account Name Banner */}
              {resolvedAccountName.length > 0 && (
                <View style={styles.resolvedNameRow}>
                  <Text style={styles.resolvedNameText}>{resolvedAccountName}</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Searchable Bank Picker Bottom Sheet */}
      <Modal visible={showBankPickerSheet} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} onPress={() => setShowBankPickerSheet(false)} />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Bank</Text>
              <TouchableOpacity onPress={() => setShowBankPickerSheet(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Banks List */}
            {filteredBanks.map((b) => (
              <TouchableOpacity
                key={b}
                style={styles.bankItem}
                onPress={() => {
                  setEditBank(b);
                  setShowBankPickerSheet(false);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.bankCircle} />
                <Text style={styles.bankItemText}>{b}</Text>
              </TouchableOpacity>
            ))}
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
  editIconButton: { width: 40, height: 40, justifyContent: "center", alignItems: "flex-end" },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },

  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl * 2 },
  infoCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: spacing.lg,
    backgroundColor: "#FFFFFF",
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
  infoCol: {},
  infoLabel: { fontFamily: "DM Sans", fontSize: 12, color: "#94A3B8", marginBottom: 4 },
  infoValue: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#0F172A" },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: spacing.md },

  /* Modal Form */
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
  modalCancelText: { fontFamily: "DM Sans", fontSize: 15, color: "#94A3B8" },
  modalHeaderTitle: { fontFamily: "DM Sans Bold", fontSize: 16, fontWeight: "700", color: "#0F172A" },
  modalSaveText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#375DFB" },
  modalSaveTextDisabled: { color: "#CBD5E1" },
  modalBody: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl * 2 },
  fieldGroup: { marginBottom: spacing.lg },
  label: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#0F172A", marginBottom: 6 },
  dropdownCard: {
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
  dropdownValue: { fontFamily: "DM Sans", fontSize: 14, color: "#0F172A" },
  placeholderText: { color: "#94A3B8" },
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
  inputField: { flex: 1, fontFamily: "DM Sans", fontSize: 14, color: "#0F172A" },
  resolvedNameRow: { marginTop: 6, paddingLeft: 4 },
  resolvedNameText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#475569", fontWeight: "600" },

  /* Bank Picker Sheet */
  sheetOverlay: { flex: 1, justifyContent: "flex-end" },
  sheetBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15, 23, 42, 0.4)" },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    maxHeight: "75%",
  },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sheetTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.md,
    backgroundColor: "#F8FAFC",
  },
  searchInput: { flex: 1, fontFamily: "DM Sans", fontSize: 14, color: "#0F172A" },
  bankItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  bankCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#E2E8F0", marginRight: 12 },
  bankItemText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "600", color: "#0F172A" },
});
