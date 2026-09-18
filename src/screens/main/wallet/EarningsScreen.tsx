import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  RefreshControl,
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
import {
  TransactionCardSkeleton,
  WalletSummarySkeleton,
} from "../../../components/ui";
import { useWalletTransactionsQuery } from "../../../hooks/useWallet";
import { TransactionItem } from "../../../navigation/types";
import { colors, palette } from "../../../theme/colors";

type Props = any;
type StatusFilter = "all" | "completed" | "pending" | "failed";

const formatCurrency = (val: string | number): string => {
  if (typeof val === "string" && val.startsWith("$")) return val;
  const num = typeof val === "string" ? parseFloat(val.replace(/[^0-9.-]+/g, "")) : val;
  if (isNaN(num)) return `$${val}`;
  return `$${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const EarningsScreen = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  const {
    data: rawTransactions,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useWalletTransactionsQuery();

  // Normalize backend transactions to TransactionItem structure
  const transactions: TransactionItem[] = useMemo(() => {
    if (!rawTransactions || !Array.isArray(rawTransactions)) return [];
    return rawTransactions.map((tx, index) => {
      const refId = tx.reference_id || String(tx.id || `tx-${index}`);
      const normStatus = (tx.status || "pending").toLowerCase();
      const displayStatus =
        normStatus === "completed"
          ? "Completed"
          : normStatus === "failed"
          ? "Failed"
          : "Pending";

      return {
        id: refId,
        reference_id: tx.reference_id || refId,
        transactionId: tx.reference_id || refId,
        amount: tx.amount,
        currency: tx.currency || "NGN",
        status: displayStatus,
        date: tx.date,
        time: tx.time,
        dateTime:
          tx.date && tx.time ? `${tx.date} • ${tx.time}` : (tx.dateTime as string) || "Recent",
        pickup: tx.pickup as string | undefined,
        destination: tx.destination as string | undefined,
        seatsBooked: tx.seatsBooked as number | undefined,
        bookingDate: (tx.bookingDate as string) || tx.date,
        customerName: tx.customerName as string | undefined,
        resolution_notes: tx.resolution_notes as string | null | undefined,
      };
    });
  }, [rawTransactions]);

  // Compute metrics dynamically from transactions
  const { totalEarnings, totalPending } = useMemo(() => {
    let completedSum = 0;
    let pendingSum = 0;

    transactions.forEach((tx) => {
      const amt = parseFloat(String(tx.amount).replace(/[^0-9.-]+/g, "")) || 0;
      if (tx.status === "Completed") {
        completedSum += amt;
      } else if (tx.status === "Pending") {
        pendingSum += amt;
      }
    });

    return {
      totalEarnings: formatCurrency(completedSum),
      totalPending: formatCurrency(pendingSum),
    };
  }, [transactions]);

  // Filter transactions based on search query and status filter
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Status filter
      if (selectedStatus !== "all") {
        if (tx.status.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const refMatch = (tx.reference_id || tx.transactionId || "").toLowerCase().includes(q);
      const amountMatch = (tx.amount || "").toLowerCase().includes(q);
      const statusMatch = (tx.status || "").toLowerCase().includes(q);
      const dateMatch = (tx.dateTime || tx.date || "").toLowerCase().includes(q);
      const pickupMatch = (tx.pickup || "").toLowerCase().includes(q);
      const destMatch = (tx.destination || "").toLowerCase().includes(q);

      return refMatch || amountMatch || statusMatch || dateMatch || pickupMatch || destMatch;
    });
  }, [transactions, selectedStatus, searchQuery]);

  const handleTransactionPress = (transaction: TransactionItem) => {
    navigation.navigate("TransactionDetails", { transaction });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setFilterActive(false);
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

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
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
        {isLoading && !rawTransactions ? (
          <WalletSummarySkeleton />
        ) : (
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Earnings</Text>
              <Text style={styles.summaryAmount}>{totalEarnings}</Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Pending Payments</Text>
              <Text style={styles.summaryAmount}>{totalPending}</Text>
            </View>
          </View>
        )}

        {/* Search & Filter Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <SearchIconItem size={20} color={colors.grey} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search reference, amount, date..."
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
            style={[styles.filterBtn, (filterActive || selectedStatus !== "all") && styles.filterBtnActive]}
            onPress={() => setFilterActive((prev) => !prev)}
            activeOpacity={0.8}
          >
            <FilterIconItem
              size={20}
              color={filterActive || selectedStatus !== "all" ? colors.primary : "#868C98"}
            />
          </TouchableOpacity>
        </View>

        {/* Filter Chips Bar (Shown when filter is toggled) */}
        {filterActive && (
          <View style={styles.filterChipsRow}>
            {(["all", "completed", "pending", "failed"] as StatusFilter[]).map((status) => {
              const isSelected = selectedStatus === status;
              const label =
                status === "all"
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1);

              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => setSelectedStatus(status)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Error State */}
        {isError && (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={24} color={colors.error} />
            <Text style={styles.errorTitle}>Could not load transactions</Text>
            <Text style={styles.errorSubtitle}>
              {(error as any)?.message || "Please check your network and try again."}
            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()} activeOpacity={0.8}>
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          {isLoading && !rawTransactions ? (
            <>
              <TransactionCardSkeleton />
              <TransactionCardSkeleton />
              <TransactionCardSkeleton />
            </>
          ) : filteredTransactions.length === 0 ? (
            /* Empty State */
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="receipt-outline" size={32} color={palette.slate[400]} />
              </View>
              <Text style={styles.emptyTitle}>No Transactions Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedStatus !== "all"
                  ? "No transactions match your current search or filter criteria."
                  : "You don't have any wallet transactions recorded yet."}
              </Text>
              {(searchQuery || selectedStatus !== "all") && (
                <TouchableOpacity
                  style={styles.clearFilterBtn}
                  onPress={handleClearFilters}
                  activeOpacity={0.8}
                >
                  <Text style={styles.clearFilterText}>Reset Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredTransactions.map((tx) => {
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

              const hasLocations = Boolean(tx.pickup && tx.destination);

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

                  {/* Locations or Reference ID */}
                  {hasLocations ? (
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
                  ) : (
                    <View style={styles.refContainer}>
                      <View style={styles.locationRow}>
                        <Text style={styles.locationKey}>Reference ID</Text>
                        <Text style={styles.refIdVal}>{tx.reference_id || tx.transactionId}</Text>
                      </View>
                    </View>
                  )}

                  {/* Footer line: Seats / Reference & Amount */}
                  <View style={styles.txFooter}>
                    {tx.seatsBooked ? (
                      <View style={styles.seatsRow}>
                        <UsersIconItem color={colors.grey} size={16} />
                        <Text style={styles.seatsText}>{tx.seatsBooked} Booked Seats</Text>
                      </View>
                    ) : (
                      <Text style={styles.subtleTimeText}>
                        {tx.time ? `${tx.time}` : "Wallet Transaction"}
                      </Text>
                    )}
                    <Text style={styles.txAmount}>{formatCurrency(tx.amount)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
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
    fontWeight: "600",
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
    marginBottom: 12,
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
  filterChipsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: colors.primary,
  },
  chipText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: palette.slate[600],
  },
  chipTextActive: {
    fontFamily: "DM Sans Bold",
    color: colors.primary,
    fontWeight: "600",
  },
  errorCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  errorTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    color: colors.error,
    marginTop: 6,
    fontWeight: "600",
  },
  errorSubtitle: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: palette.slate[600],
    textAlign: "center",
    marginVertical: 4,
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.error,
    borderRadius: 8,
  },
  retryBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  transactionsList: {
    gap: 14,
  },
  txCard: {
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
  refContainer: {
    marginBottom: 10,
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
  refIdVal: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "600",
    color: colors.dark,
  },
  txFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  subtleTimeText: {
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: colors.grey,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },
  clearFilterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
  },
  clearFilterText: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
});
