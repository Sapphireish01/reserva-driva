import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EditIconItem } from "../../../components/ProfileIcons";
import {
  AppButton,
  AppDropdown,
  AppFullScreenModal,
  AppLoader,
  AppTextInput,
} from "../../../components/ui";
import {
  useBankAccountQuery,
  useBanksQuery,
  useSetBankAccountMutation,
} from "../../../hooks/useBankAccounts";
import { MainStackParamList } from "../../../navigation/types";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "BankDetails">;

const FALLBACK_BANKS = [
  "Bank of America",
  "JPMorgan Chase",
  "Wells Fargo",
  "Citibank",
  "U.S. Bank",
  "PNC Bank",
  "Truist Bank",
  "Capital One",
  "TD Bank",
  "Fifth Third Bank",
];

export const BankDetailsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  // API Queries & Mutations
  const { data: bankAccount, isLoading: isLoadingAccount } = useBankAccountQuery();
  const { data: banksList = [], isLoading: isLoadingBanks } = useBanksQuery();
  const setBankAccountMutation = useSetBankAccountMutation();

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBankName, setEditBankName] = useState("");
  const [editAccNo, setEditAccNo] = useState("");
  const [resolvedAccountName, setResolvedAccountName] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  // Dynamic Bank Dropdown Options
  const bankOptions = useMemo(() => {
    if (banksList && banksList.length > 0) {
      return banksList.map((b) => b.name);
    }
    return FALLBACK_BANKS;
  }, [banksList]);

  // Derived Display Values for active Bank Account
  const displayBankName = useMemo(() => {
    if (bankAccount?.bank_name) return bankAccount.bank_name;
    if (typeof bankAccount?.bank === "object" && (bankAccount.bank as any)?.name) {
      return (bankAccount.bank as any).name;
    }
    if (bankAccount?.bank && banksList.length > 0) {
      const found = banksList.find((b) => String(b.id) === String(bankAccount.bank));
      if (found) return found.name;
    }
    return bankAccount?.bank_name || "Bank of America";
  }, [bankAccount, banksList]);

  const displayAccountNumber = useMemo(() => {
    if (!bankAccount?.account_number) return "*******0000";
    const acc = bankAccount.account_number;
    return acc.length >= 4 ? `*******${acc.slice(-4)}` : acc;
  }, [bankAccount]);

  const displayAccountName = bankAccount?.account_name || "Fade Bayo";

  const handleOpenEdit = () => {
    setEditBankName(displayBankName);
    setEditAccNo(bankAccount?.account_number || "0305455090");
    setResolvedAccountName(displayAccountName);
    setApiError(null);
    setShowEditModal(true);
  };

  const handleAccNoChange = (text: string) => {
    setEditAccNo(text);
    if (apiError) setApiError(null);
  };

  const handleSave = async () => {
    if (!editBankName || !editAccNo || !resolvedAccountName) return;

    setApiError(null);

    // Resolve Bank ID from selection
    const selectedBankObj = banksList.find(
      (b) => b.name.toLowerCase() === editBankName.toLowerCase()
    );
    const bankId = selectedBankObj ? selectedBankObj.id : 1;

    try {
      console.log("🌐 [API Action] Saving bank details:", {
        bank: bankId,
        account_number: editAccNo,
        account_name: resolvedAccountName,
      });

      await setBankAccountMutation.mutateAsync({
        bank: bankId,
        account_number: editAccNo.trim(),
        account_name: resolvedAccountName.trim(),
      });

      setShowEditModal(false);
    } catch (err: any) {
      console.error("❌ [API Error] Failed to save bank account:", err?.response?.data || err?.message);
      const backendData = err?.response?.data;
      let msg = "Failed to save bank details. Please try again.";
      if (typeof backendData === "string") {
        msg = backendData;
      } else if (backendData && typeof backendData === "object") {
        msg = backendData.detail || backendData.message || backendData.bank?.[0] || backendData.account_number?.[0] || msg;
      } else if (err?.message) {
        msg = err.message;
      }
      setApiError(msg);
    }
  };

  const isFormValid = editBankName.length > 0 && editAccNo.length >= 8 && resolvedAccountName.trim().length > 0;
  const isSaving = setBankAccountMutation.isPending;

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

      {isLoadingAccount ? (
        <View style={styles.loadingContainer}>
          <AppLoader size={36} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info Details */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Bank Name</Text>
                <Text style={styles.infoValue}>{displayBankName}</Text>
              </View>
              <View style={[styles.infoCol, { alignItems: "flex-end" }]}>
                <Text style={styles.infoLabel}>Account Number</Text>
                <Text style={styles.infoValue}>{displayAccountNumber}</Text>
              </View>
            </View>

            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Account Name</Text>
              <Text style={styles.infoValue}>{displayAccountName}</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Edit Bank Details Full-Screen Modal */}
      <AppFullScreenModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Bank Details"
        rightActionText="Save"
        onRightAction={handleSave}
        rightActionDisabled={!isFormValid || isSaving}
      >
        <View style={styles.modalBody}>
          {/* Bank Dropdown with Search */}
          <AppDropdown
            label="Bank Name *"
            placeholder={isLoadingBanks ? "Loading banks..." : "Select Bank"}
            options={bankOptions}
            value={editBankName}
            onSelect={(val) => {
              setEditBankName(val);
              if (apiError) setApiError(null);
            }}
            enableSearch={true}
            searchPlaceholder="Search banks..."
          />

          {/* Account Number Input */}
          <AppTextInput
            label="Account Number *"
            placeholder="e.g 0305455090"
            value={editAccNo}
            onChangeText={handleAccNoChange}
            keyboardType="number-pad"
            maxLength={16}
            autoFocus={true}
          />

          {/* Account Name Input */}
          <AppTextInput
            label="Account Name *"
            placeholder="e.g Fade Bayo"
            value={resolvedAccountName}
            onChangeText={(val) => {
              setResolvedAccountName(val);
              if (apiError) setApiError(null);
            }}
            autoCapitalize="words"
          />

          {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

          <AppButton
            title={isSaving ? "Saving..." : "Save Details"}
            onPress={handleSave}
            loading={isSaving}
            disabled={!isFormValid || isSaving}
            size="lg"
            style={{ marginTop: 24 }}
          />
        </View>
      </AppFullScreenModal>
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
  errorText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: colors.error || "#EF4444",
    marginTop: 4,
  },
});
