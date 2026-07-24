import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
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
import { MainStackParamList } from "../../navigation/types";
import { spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "FAQs">;

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: "1",
    question: "How do I book this vehicle?",
    answer:
      "You can book this vehicle by selecting your pickup and return dates, reviewing the total price, and confirming your reservation through our secure checkout.",
  },
  {
    id: "2",
    question: "Do I need to select dates before booking?",
    answer:
      "Yes. You must select your pickup and return dates so we can check availability and calculate the total rental cost.",
  },
  {
    id: "3",
    question: "What happens after I book?",
    answer:
      "Once your booking is confirmed, you'll receive a confirmation with the pickup location, vehicle details, and rental instructions.",
  },
  {
    id: "4",
    question: "How long can i schedule a trip for?",
    answer:
      "You can schedule trips ranging from single day rentals up to multiple weeks, depending on host availability and reservation requirements.",
  },
  {
    id: "5",
    question: "How to initiate a refund?",
    answer:
      "To initiate a refund, navigate to your bookings tab, select the active trip, and choose 'Request Cancellation & Refund' according to our policy.",
  },
];

export const FAQsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);

  const filteredFAQs = FAQ_LIST.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

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
        </View>

        {/* FAQ Accordion List */}
        {filteredFAQs.map((faq) => (
          <TouchableOpacity
            key={faq.id}
            style={styles.faqCard}
            onPress={() => setSelectedFAQ(faq)}
            activeOpacity={0.7}
          >
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Ionicons name="chevron-down" size={18} color="#94A3B8" />
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
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
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
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
});
