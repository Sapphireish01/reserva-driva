import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DottedConnectorLineItem,
  FilterIconItem,
  SearchIconItem,
  UsersIconItem,
} from "../../../components/ProfileIcons";
import { TransactionItem } from "../../../navigation/types";
import { colors, palette } from "../../../theme/colors";

type Props = any;

const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    id: "tx-1",
    pickup: "Frebson Fitness Gym",
    destination: "42, Montgomery Road Yaba",
    seatsBooked: 4,
    amount: "N12,500",
    status: "Pending",
    dateTime: "Jul 14 • 8:30AM",
    bookingDate: "30 Mar 2025",
    transactionId: "AB123-DRIX543-LLY",
    customerName: "Jane Doe",
  },
  {
    id: "tx-2",
    pickup: "Frebson Fitness Gym",
    destination: "42, Montgomery Road Yaba",
    seatsBooked: 4,
    amount: "N12,500",
    status: "Completed",
    dateTime: "Jul 14 • 8:30AM",
    bookingDate: "30 Mar 2025",
    transactionId: "AB123-DRIX543-LLY",
    customerName: "Jane Doe",
  },
  {
    id: "tx-3",
    pickup: "Frebson Fitness Gym",
    destination: "42, Montgomery Road Yaba",
    seatsBooked: 4,
    amount: "N12,500",
    status: "Failed",
    dateTime: "Jul 14 • 8:30AM",
    bookingDate: "30 Mar 2025",
    transactionId: "AB123-DRIX543-LLY",
    customerName: "Jane Doe",
  },
];

export const EarningsScreen = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState(false);

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const q = searchQuery.toLowerCase();
    return (
      tx.pickup.toLowerCase().includes(q) ||
      tx.destination.toLowerCase().includes(q) ||
      tx.dateTime.toLowerCase().includes(q) ||
      tx.status.toLowerCase().includes(q) ||
      tx.amount.toLowerCase().includes(q)
    );
  });

  const handleTransactionPress = (transaction: TransactionItem) => {
    navigation.navigate("TransactionDetails", { transaction });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.canGoBack() && navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bank Banner Alert */}
        <TouchableOpacity
          style={styles.bankBanner}
          onPress={() => navigation.navigate("BankDetails")}
          activeOpacity={0.8}
        >
          <Text style={styles.bankBannerText}>
            Add your bank details to start receiving earnings.
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#2563EB" />
        </TouchableOpacity>

        {/* Summary Cards Row */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
            <Text style={styles.summaryAmount}>$100.00</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Pending Payments</Text>
            <Text style={styles.summaryAmount}>$0.00</Text>
          </View>
        </View>

        {/* Search & Filter Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <SearchIconItem size={20} color={colors.grey} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor={colors.grey}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color={colors.grey} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.filterBtn, filterActive && styles.filterBtnActive]}
            onPress={() => setFilterActive((prev) => !prev)}
            activeOpacity={0.8}
          >
            <FilterIconItem size={20} color={filterActive ? colors.primary : "#868C98"} />
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          {filteredTransactions.map((tx) => {
            const badgeStyle =
              tx.status === "Completed"
                ? styles.badgeCompleted
                : tx.status === "Pending"
                  ? styles.badgePending
                  : styles.badgeFailed;

            const badgeTextStyle =
              tx.status === "Completed"
                ? styles.badgeTextCompleted
                : tx.status === "Pending"
                  ? styles.badgeTextPending
                  : styles.badgeTextFailed;

            return (
              <TouchableOpacity
                key={tx.id}
                style={styles.txCard}
                onPress={() => handleTransactionPress(tx)}
                activeOpacity={0.85}
              >
                {/* Header line: Date & Status */}
                <View style={styles.txHeader}>
                  <Text style={styles.txDate}>{tx.dateTime}</Text>
                  <View style={[styles.badge, badgeStyle]}>
                    <Text style={[styles.badgeText, badgeTextStyle]}>{tx.status}</Text>
                  </View>
                </View>

                {/* Locations: Pickup & Destination with vertical line connector */}
                <View style={styles.locationContainer}>
                  {/* Pickup Row */}
                  <View style={styles.locationRow}>
                    <View style={styles.locationLeft}>
                      <View style={styles.dotOutline} />
                      <Text style={styles.locationKey}>Pick up point</Text>
                    </View>
                    <Text style={styles.locationVal}>{tx.pickup}</Text>
                  </View>

                  {/* Vertical Connector Line */}
                  <View style={styles.connectorLine}>
                    <DottedConnectorLineItem color="#E2E4E9" />
                  </View>

                  {/* Destination Row */}
                  <View style={styles.locationRow}>
                    <View style={styles.locationLeft}>
                      <View style={styles.dotFilled} />
                      <Text style={styles.locationKey}>Destination</Text>
                    </View>
                    <Text style={styles.locationVal}>{tx.destination}</Text>
                  </View>
                </View>

                {/* Footer line: Seats Booked & Amount */}
                <View style={styles.txFooter}>
                  <View style={styles.seatsRow}>
                    <UsersIconItem color={colors.grey} size={16} />
                    <Text style={styles.seatsText}>{tx.seatsBooked} Booked Seats</Text>
                  </View>
                  <Text style={styles.txAmount}>{tx.amount}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 20,
    fontWeight: "700",
    color: colors.dark,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bankBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  bankBannerText: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "600",
    color: "#193CB8",
    flex: 1,
    marginRight: 8,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    // backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#E2E4E9",
    borderRadius: 10,
    padding: 12,
  },
  summaryLabel: {
    fontFamily: "DM Sans",
    fontSize: 10,
    color: colors.grey,
    marginBottom: 4,
  },
  summaryAmount: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border2,
    borderRadius: 10,
    height: 40,
    gap: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {},
  searchInput: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    fontFamily: "DM Sans",
    fontSize: 14,
    color: colors.dark,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderWidth: 1.1,
    borderColor: colors.border2,
    borderRadius: 11,
    padding: 11,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  filterBtnActive: {
    borderColor: colors.primary,
    backgroundColor: "#EFF6FF",
  },
  transactionsList: {
    gap: 14,
  },
  txCard: {
    // backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border2,
    borderRadius: 16,
    padding: 16,
  },
  txHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  txDate: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: colors.grey,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeCompleted: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#7BF1A8",
  },
  badgePending: {
    backgroundColor: "#F6F8FA",
    borderWidth: 1,
    borderColor: colors.border2,
  },
  badgeFailed: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFA2A2",
  },
  badgeText: {
    fontFamily: "DM Sans Bold",
    fontSize: 10,
    fontWeight: "400",
  },
  badgeTextCompleted: {
    // color: "#7BF1A8",
    color: "#00A63E",
  },
  badgeTextPending: {
    color: colors.grey,
  },
  badgeTextFailed: {
    color: "#E7000B",
  },
  locationContainer: {
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dotOutline: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: palette.slate[400],
  },
  dotFilled: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.slate[500],
  },
  connectorLine: {
    marginLeft: 1.5,
    marginVertical: 2,
  },
  locationKey: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: colors.grey,
  },
  locationVal: {
    fontFamily: "DM Sans",
    fontSize: 12,
    fontWeight: "400",
    color: colors.dark,
  },
  txFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingTop: 12,
  },
  seatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  seatsText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: colors.grey,
  },
  txAmount: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
  },
});
