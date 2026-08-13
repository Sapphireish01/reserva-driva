import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Skeleton } from "../Skeleton";

export interface SkeletonContainerProps {
  style?: ViewStyle;
}

export const TripCardSkeleton: React.FC<SkeletonContainerProps> = ({ style }) => {
  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.headerRow}>
        <Skeleton width={120} height={18} borderRadius={4} />
        <Skeleton width={70} height={22} borderRadius={11} />
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.locationRow}>
          <Skeleton width={12} height={12} borderRadius={6} style={styles.dotMargin} />
          <Skeleton width="75%" height={16} borderRadius={4} />
        </View>
        <View style={styles.lineConnector} />
        <View style={styles.locationRow}>
          <Skeleton width={12} height={12} borderRadius={6} style={styles.dotMargin} />
          <Skeleton width="60%" height={16} borderRadius={4} />
        </View>
      </View>

      <View style={styles.footerRow}>
        <Skeleton width={90} height={16} borderRadius={4} />
        <Skeleton width={80} height={20} borderRadius={4} />
      </View>
    </View>
  );
};

export const DriverProfileSkeleton: React.FC<SkeletonContainerProps> = ({ style }) => {
  return (
    <View style={[styles.profileContainer, style]}>
      <Skeleton width={70} height={70} borderRadius={35} />
      <View style={styles.profileTextContainer}>
        <Skeleton width={160} height={20} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width={110} height={14} borderRadius={4} />
      </View>
    </View>
  );
};

export const VehicleDetailsSkeleton: React.FC<SkeletonContainerProps> = ({ style }) => {
  return (
    <View style={[styles.cardContainer, style]}>
      <Skeleton width="100%" height={140} borderRadius={8} style={{ marginBottom: 16 }} />
      <Skeleton width={140} height={20} borderRadius={4} style={{ marginBottom: 8 }} />
      <Skeleton width={90} height={14} borderRadius={4} />
    </View>
  );
};

export const VehicleCardSkeleton: React.FC<SkeletonContainerProps> = ({ style }) => {
  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.headerRow}>
        <Skeleton width="60%" height={18} borderRadius={4} />
        <Skeleton width={60} height={20} borderRadius={6} />
      </View>
      <View style={styles.footerRow}>
        <Skeleton width={130} height={14} borderRadius={4} />
        <Skeleton width={70} height={14} borderRadius={4} />
      </View>
    </View>
  );
};

export const ReferralsScreenSkeleton: React.FC<SkeletonContainerProps> = ({ style }) => {
  return (
    <View style={style}>
      {/* Top Stats Row Skeleton */}
      <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
        <View style={{ flex: 1, backgroundColor: "#F8FAFC", borderRadius: 14, padding: 18, height: 88, justifyContent: "center", alignItems: "center" }}>
          <Skeleton width={100} height={12} borderRadius={4} style={{ marginBottom: 10 }} />
          <Skeleton width={60} height={22} borderRadius={4} />
        </View>
        <View style={{ flex: 1, backgroundColor: "#F8FAFC", borderRadius: 14, padding: 18, height: 88, justifyContent: "center", alignItems: "center" }}>
          <Skeleton width={90} height={12} borderRadius={4} style={{ marginBottom: 10 }} />
          <Skeleton width={40} height={22} borderRadius={4} />
        </View>
      </View>

      {/* Banner Section Skeleton */}
      <View style={{ marginBottom: 24 }}>
        <Skeleton width="55%" height={14} borderRadius={4} style={{ marginBottom: 10 }} />
        <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width="75%" height={16} borderRadius={4} />
      </View>

      {/* Code Card Skeleton */}
      <View style={{ marginBottom: 24 }}>
        <Skeleton width="30%" height={14} borderRadius={4} style={{ marginBottom: 10 }} />
        <View style={{ backgroundColor: "#F8FAFC", borderRadius: 14, padding: 16, height: 54, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton width={130} height={18} borderRadius={4} />
          <Skeleton width={20} height={20} borderRadius={4} />
        </View>
      </View>

      {/* How it works Skeleton */}
      <View>
        <Skeleton width={110} height={20} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width={160} height={14} borderRadius={4} style={{ marginBottom: 16 }} />
        <Skeleton width="80%" height={16} borderRadius={4} style={{ marginBottom: 12 }} />
        <Skeleton width="85%" height={16} borderRadius={4} style={{ marginBottom: 12 }} />
        <Skeleton width="65%" height={16} borderRadius={4} />
      </View>
    </View>
  );
};

export const EmergencyContactCardSkeleton: React.FC<SkeletonContainerProps> = ({ style }) => {
  return (
    <View style={[{ backgroundColor: "#F6F8FA", borderRadius: 14, paddingVertical: 18, paddingHorizontal: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, style]}>
      <Skeleton width={140} height={16} borderRadius={4} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Skeleton width={110} height={16} borderRadius={4} style={{ marginRight: 8 }} />
        <Skeleton width={18} height={18} borderRadius={4} />
      </View>
    </View>
  );
};

export const FAQCardSkeleton: React.FC<SkeletonContainerProps> = ({ style }) => {
  return (
    <View style={[{ borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, paddingHorizontal: 16, paddingVertical: 18, marginBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" }, style]}>
      <Skeleton width="80%" height={16} borderRadius={4} />
      <Skeleton width={18} height={18} borderRadius={4} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  routeContainer: {
    marginVertical: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dotMargin: {
    marginRight: 10,
  },
  lineConnector: {
    marginLeft: 5,
    marginVertical: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  profileTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
});
