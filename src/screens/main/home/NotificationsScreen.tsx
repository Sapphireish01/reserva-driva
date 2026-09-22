import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NotificationItem } from "../../../api/services/notifications";
import { NotificationIconItem } from "../../../components/ProfileIcons";
import { AppLoader, NotificationCardSkeleton } from "../../../components/ui";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useMarkNotificationUnreadMutation,
  useNotificationsQuery,
} from "../../../hooks/useNotifications";
import { MainStackParamList } from "../../../navigation/types";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "Notifications">;

type FilterTab = "all" | "unread";

export const NotificationsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // TanStack Query for notifications
  const {
    notifications,
    unreadCount,
    count,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useNotificationsQuery();

  // Mutations
  const markReadMutation = useMarkNotificationReadMutation();
  const markUnreadMutation = useMarkNotificationUnreadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  const handleRefresh = React.useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Filtered list
  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((item) => !item.is_read);
    }
    return notifications;
  }, [notifications, activeTab]);

  const handleToggleRead = (item: NotificationItem) => {
    if (item.is_read) {
      markUnreadMutation.mutate(item.id);
    } else {
      markReadMutation.mutate(item.id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0 || markAllReadMutation.isPending) return;
    markAllReadMutation.mutate();
  };

  // Helper to render event icon & theme color
  const renderNotificationIcon = (item: NotificationItem) => {
    const eventType = (item.event_type || "").toLowerCase();
    const actorType = (item.actor_type || "").toLowerCase();

    if (eventType.includes("trip") || eventType.includes("ride") || eventType.includes("booking")) {
      return (
        <View style={[styles.iconCircle, { backgroundColor: "#EEF2FF" }]}>
          <Ionicons name="car-outline" size={20} color="#375DFB" />
        </View>
      );
    }

    if (
      eventType.includes("alert") ||
      eventType.includes("security") ||
      eventType.includes("warning") ||
      actorType === "system"
    ) {
      return (
        <View style={[styles.iconCircle, { backgroundColor: "#FEF2F2" }]}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#EF4444" />
        </View>
      );
    }

    if (eventType.includes("wallet") || eventType.includes("payout") || eventType.includes("payment")) {
      return (
        <View style={[styles.iconCircle, { backgroundColor: "#F0FDF4" }]}>
          <Ionicons name="wallet-outline" size={20} color="#16A34A" />
        </View>
      );
    }

    return (
      <View style={[styles.iconCircle, { backgroundColor: "#EFF6FF" }]}>
        <NotificationIconItem color="#375DFB" size={20} />
      </View>
    );
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const isUnread = !item.is_read;

    return (
      <TouchableOpacity
        style={[styles.notificationCard, isUnread && styles.unreadCard]}
        activeOpacity={0.75}
        onPress={() => handleToggleRead(item)}
      >
        {renderNotificationIcon(item)}

        <View style={styles.contentCol}>
          <View style={styles.topRow}>
            <Text style={styles.eventType}>
              {item.event_type ? item.event_type.toUpperCase() : "ALERT"}
            </Text>
            {isUnread && <View style={styles.unreadDot} />}
          </View>

          <Text style={[styles.messageText, isUnread && styles.unreadMessageText]}>
            {item.message}
          </Text>

          <View style={styles.bottomRow}>
            <Text style={styles.timeText}>{item.created_at}</Text>
            <TouchableOpacity
              onPress={() => handleToggleRead(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.actionText}>
                {isUnread ? "Mark as read" : "Mark unread"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllAsRead}
              disabled={markAllReadMutation.isPending}
              activeOpacity={0.7}
            >
              {markAllReadMutation.isPending ? (
                <AppLoader size={14} color="#375DFB" />
              ) : (
                <Text style={styles.markAllText}>Mark all as read</Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("NotificationSettings")}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={22} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "all" && styles.tabButtonActive]}
          onPress={() => setActiveTab("all")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.tabTextActive,
            ]}
          >
            All {count > 0 ? `(${count})` : ""}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "unread" && styles.tabButtonActive]}
          onPress={() => setActiveTab("unread")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "unread" && styles.tabTextActive,
            ]}
          >
            Unread
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {isLoading ? (
        <View style={styles.skeletonContainer}>
          <NotificationCardSkeleton />
          <NotificationCardSkeleton />
          <NotificationCardSkeleton />
          <NotificationCardSkeleton />
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Unable to load notifications</Text>
          <Text style={styles.errorSubtitle}>
            Please check your connection and try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor="#375DFB"
            />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <View style={styles.emptyIconWrapper}>
                <Ionicons name="notifications-off-outline" size={40} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>
                {activeTab === "unread"
                  ? "You're all caught up!"
                  : "No notifications yet"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === "unread"
                  ? "There are no unread notifications right now."
                  : "When you receive ride requests, schedule updates, or system alerts, they'll appear here."}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 20,
    fontWeight: "700",
    color: colors.dark,
    marginLeft: 6,
  },
  markAllButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  markAllText: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    fontWeight: "600",
    color: "#375DFB",
  },

  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 10,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
  },
  tabButtonActive: {
    backgroundColor: "#375DFB",
  },
  tabText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  tabTextActive: {
    fontFamily: "DM Sans Bold",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  badgeContainer: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  badgeText: {
    fontFamily: "DM Sans Bold",
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  skeletonContainer: {
    padding: spacing.lg,
  },

  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "flex-start",
  },
  unreadCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BFDBFE",
    shadowColor: "rgba(55, 93, 251, 0.08)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentCol: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  eventType: {
    fontFamily: "DM Sans Bold",
    fontSize: 11,
    fontWeight: "700",
    color: "#375DFB",
    letterSpacing: 0.5,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#375DFB",
  },
  messageText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
    marginBottom: 8,
  },
  unreadMessageText: {
    fontFamily: "DM Sans Bold",
    fontWeight: "600",
    color: "#0F172A",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#94A3B8",
  },
  actionText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#64748B",
  },

  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  errorTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginTop: 12,
    marginBottom: 4,
  },
  errorSubtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#375DFB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    fontFamily: "DM Sans Bold",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
