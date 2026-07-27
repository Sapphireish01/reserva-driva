import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EditIconItem } from "../../../components/ProfileIcons";
import {
  AppDropdown,
  AppFullScreenModal,
  AppTextInput
} from "../../../components/ui";
import { MainStackParamList } from "../../../navigation/types";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "BankDetails">;

const SUPPORTED_BANKS = [
  "Zenith Bank",
  "Access Bank",
  "Polaris Bank",
  "Opay",
  "Guaranty Trust Bank (GTBank)",
  "Kuda Microfinance Bank",
  "First Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Stanbic IBTC Bank",
  "Moniepoint MFB",
  "Fidelity Bank",
  "Union Bank",
  "Sterling Bank",
  "Wema Bank (ALAT)",
  "Palmpay",
  "Ecobank",
  "FCMB",
  "Heritage Bank",
  "Keystone Bank",
  "Providus Bank",
];

export const BankDetailsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const [bankName, setBankName] = useState("Zenith Bank");
  const [accountNumber, setAccountNumber] = useState("*******0000");
  const [accountName, setAccountName] = useState("Drifully");

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBank, setEditBank] = useState("Zenith Bank");
  const [editAccNo, setEditAccNo] = useState("");
  const [resolvedAccountName, setResolvedAccountName] = useState("");
  const [isResolving, setIsResolving] = useState(false);

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
        setResolvedAccountName("Onyekele Salamu");
      }, 600);
    } else {
      setResolvedAccountName("");
    }
  };

  const handleSave = () => {
    if (!editBank || !editAccNo || !resolvedAccountName) return;
    setBankName(editBank);
    const masked = editAccNo.length >= 4 ? `*******${editAccNo.slice(-4)}` : editAccNo;
    setAccountNumber(masked);
    setAccountName(resolvedAccountName);
    setShowEditModal(false);
  };

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
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Details</Text>
        <TouchableOpacity
          style={styles.editIconButton}
          onPress={handleOpenEdit}
          activeOpacity={0.7}
        >
          <EditIconItem color="#868C98" size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Details */}
        <View style={styles.infoContainer}>
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

          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Account Name</Text>
            <Text style={styles.infoValue}>{accountName}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit Bank Details Full-Screen Modal */}
      <AppFullScreenModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Bank Details"
        rightActionText="Save"
        onRightAction={handleSave}
        rightActionDisabled={!isFormValid}
      >
        <View style={styles.modalBody}>
          {/* Bank Dropdown with Search */}
          <AppDropdown
            label="Bank Name *"
            placeholder="Select Bank"
            options={SUPPORTED_BANKS}
            value={editBank}
            onSelect={(val) => setEditBank(val)}
            enableSearch={true}
            searchPlaceholder="Search banks..."
          />

          {/* Account Number Input with autoFocus */}
          <AppTextInput
            label="Account Number *"
            placeholder="e.g 0000000000"
            value={editAccNo}
            onChangeText={handleAccNoChange}
            keyboardType="number-pad"
            maxLength={10}
            autoFocus={true}
          />

          {/* Resolved Account Name */}
          {resolvedAccountName.length > 0 && (
            <View style={styles.resolvedNameCard}>
              {/* <Text style={styles.resolvedLabel}>Account Name</Text> */}
              <Text style={styles.resolvedValue}>{resolvedAccountName}</Text>
            </View>
          )}

          {/* <AppButton
            title="Save Details"
            onPress={handleSave}
            disabled={!isFormValid}
            size="lg"
            style={{ marginTop: 24 }}
          /> */}
        </View>
      </AppFullScreenModal>
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
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 20, fontWeight: "700", color: "#0F172A" },
  editIconButton: { width: 40, height: 40, justifyContent: "center", alignItems: "flex-end" },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  infoContainer: {
    gap: 24,
    paddingTop: 12,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoCol: { gap: 6 },
  infoLabel: { fontFamily: "DM Sans", fontSize: 14, color: "#868C98" },
  infoValue: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  modalBody: { padding: 20 },
  resolvedNameCard: {
    marginTop: 4,
  },
  resolvedLabel: { fontFamily: "DM Sans", fontSize: 12, color: "#166534" },
  resolvedValue: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: colors.dark },
});
