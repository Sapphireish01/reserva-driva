import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  Clipboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CopyIconItem } from "../../../components/ProfileIcons";
import { MainStackParamList } from "../../../navigation/types";
import { colors, palette } from "../../../theme/colors";
import { RaiseDisputeModal } from "./components/RaiseDisputeModal";

type Props = NativeStackScreenProps<MainStackParamList, "TransactionDetails">;

export const TransactionDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { transaction } = route.params;

  const [showDisputeModal, setShowDisputeModal] = useState(false);

  const handleCopyTransactionId = () => {
    Clipboard.setString(transaction.transactionId);
    Alert.alert("Copied!", "Transaction ID copied to clipboard.");
  };

  const handleDownloadReceipt = () => {
    Alert.alert("Receipt Download", "Downloading receipt PDF...");
  };

  const statusBadgeStyle =
    transaction.status === "Completed"
      ? styles.badgeCompleted
      : transaction.status === "Pending"
      ? styles.badgePending
      : styles.badgeFailed;

  const statusTextStyle =
    transaction.status === "Completed"
      ? styles.badgeTextCompleted
      : transaction.status === "Pending"
      ? styles.badgeTextPending
      : styles.badgeTextFailed;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {transaction.pickup}
          </Text>
          <View style={[styles.badge, statusBadgeStyle]}>
            <Text style={[styles.badgeText, statusTextStyle]}>{transaction.status}</Text>
          </View>
        </View>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Earnings Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Earnings</Text>
          <Text style={styles.heroAmount}>{transaction.amount}</Text>
        </View>

        {/* Transaction Detail Rows */}
        <View style={styles.detailsGroup}>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Pickup Location</Text>
            <Text style={styles.detailValue}>{transaction.pickup}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Destination</Text>
            <Text style={styles.detailValue}>{transaction.destination}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Transaction ID</Text>
            <TouchableOpacity
              style={styles.copyValueRow}
              onPress={handleCopyTransactionId}
              activeOpacity={0.7}
            >
              <Text style={styles.detailValue}>{transaction.transactionId}</Text>
              <CopyIconItem color={colors.grey} size={18} />
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Booking Dates</Text>
            <Text style={styles.detailValue}>{transaction.bookingDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Customer Name</Text>
            <Text style={styles.detailValue}>{transaction.customerName}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {transaction.status === "Completed" ? (
          <>
            <TouchableOpacity
              style={styles.disputeOutlinedBtn}
              onPress={() => setShowDisputeModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.disputeOutlinedText}>Raise Dispute</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleDownloadReceipt}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>Download Receipt</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setShowDisputeModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>Raise Dispute</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Raise Dispute Modal */}
      <RaiseDisputeModal
        visible={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        onSubmit={(reason) => {
          console.log("Dispute raised for transaction:", transaction.id, reason);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.slate[100],
  },
  backBtn: {
    padding: 4,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: "75%",
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: colors.dark,
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeCompleted: {
    backgroundColor: "#DCFCE7",
  },
  badgePending: {
    backgroundColor: "#F1F5F9",
  },
  badgeFailed: {
    backgroundColor: "#FEF2F2",
  },
  badgeText: {
    fontFamily: "DM Sans Bold",
    fontSize: 11,
    fontWeight: "600",
  },
  badgeTextCompleted: {
    color: "#00A63E",
  },
  badgeTextPending: {
    color: colors.grey,
  },
  badgeTextFailed: {
    color: colors.error,
  },
  content: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 28,
  },
  heroLabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: colors.grey,
    marginBottom: 6,
  },
  heroAmount: {
    fontFamily: "DM Sans Bold",
    fontSize: 32,
    fontWeight: "700",
    color: colors.dark,
  },
  detailsGroup: {
    gap: 22,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailKey: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: colors.grey,
  },
  detailValue: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: colors.dark,
  },
  copyValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: palette.slate[100],
  },
  disputeOutlinedBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: colors.background,
  },
  disputeOutlinedText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: colors.grey,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
