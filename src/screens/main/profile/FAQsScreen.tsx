import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FAQ } from "../../../api/services/support";
import { FAQCardSkeleton } from "../../../components/ui";
import { useFAQsQuery } from "../../../hooks/useSupportTickets";
import { MainStackParamList } from "../../../navigation/types";
import { spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "FAQs">;

export const FAQsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { data: serverFAQs, isLoading } = useFAQsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  const faqsList: FAQ[] = useMemo(() => {
    if (serverFAQs && Array.isArray(serverFAQs)) {
      return serverFAQs.filter((faq) => faq.is_active !== false);
    }
    return [];
  }, [serverFAQs]);

  const filteredFAQs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return faqsList;
    return faqsList.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q)
    );
  }, [faqsList, searchQuery]);

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
        <Text style={styles.headerTitle}>FAQs</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Loading Skeletons */}
        {isLoading ? (
          <>
            <FAQCardSkeleton />
            <FAQCardSkeleton />
            <FAQCardSkeleton />
            <FAQCardSkeleton />
            <FAQCardSkeleton />
          </>
        ) : filteredFAQs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery.trim() ? "No FAQs found matching your search." : "No FAQs available right now."}
            </Text>
          </View>
        ) : (
          /* FAQ Accordion List */
          filteredFAQs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqCard}
              onPress={() => setSelectedFAQ(faq)}
              activeOpacity={0.7}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons name="chevron-down" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* FAQ Answer Detail Bottom Sheet Modal */}
      <Modal visible={!!selectedFAQ} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setSelectedFAQ(null)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetQuestionTitle}>{selectedFAQ?.question}</Text>
              <TouchableOpacity onPress={() => setSelectedFAQ(null)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.sheetAnswerText}>{selectedFAQ?.answer}</Text>
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
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl * 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: spacing.sm2,
    paddingVertical: spacing.sm2,
    marginBottom: spacing.md,
    backgroundColor: "#F8FAFC",
  },
  searchInput: {
    flex: 1,
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
  },
  faqCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: spacing.sm2,
    paddingVertical: spacing.sm2,
    marginBottom: spacing.sm,
    backgroundColor: "#FFFFFF",
  },
  faqQuestion: {
    flex: 1,
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sheetQuestionTitle: {
    flex: 1,
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginRight: 12,
  },
  sheetAnswerText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
});
