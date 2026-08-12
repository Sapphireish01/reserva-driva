import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppButton,
  AppDropdown,
  AppTextEditor,
  AppTextInput,
  CheckIcon,
} from "../../../components/ui";
import {
  useContactSubjectsQuery,
  useCreateSupportTicketMutation,
} from "../../../hooks/useSupportTickets";
import { MainStackParamList } from "../../../navigation/types";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "ContactUs">;

export const ContactUsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const contactSubjectsQuery = useContactSubjectsQuery();
  const createTicketMutation = useCreateSupportTicketMutation();

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<{ uri: string; name?: string; type?: string }[]>([]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const categories = contactSubjectsQuery.data || [];

  const isFormValid =
    subject.trim().length > 0 &&
    category.trim().length > 0 &&
    description.trim().length > 0;

  const isSubmitting = createTicketMutation.isPending;

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setApiError(null);
    try {
      const formattedCategory = category.trim().toUpperCase();
      console.log("🌐 [API Call] Submitting support ticket:", {
        category: formattedCategory,
        subject,
        description,
        attachments,
      });

      await createTicketMutation.mutateAsync({
        category: formattedCategory,
        subject: subject.trim(),
        description: description.trim(),
        attachments: attachments.length > 0 ? attachments[0] : undefined,
      });

      setIsSubmitted(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1200);
    } catch (err: any) {
      console.error("❌ [API Error] Failed to submit support ticket:", err?.response?.data || err?.message);
      const backendData = err?.response?.data;
      let msg = "Failed to submit request. Please try again.";
      if (typeof backendData === "string") {
        msg = backendData;
      } else if (backendData && typeof backendData === "object") {
        msg = backendData.detail || backendData.message || backendData.category?.[0] || backendData.description?.[0] || msg;
      } else if (err?.message) {
        msg = err.message;
      }
      setApiError(msg);
    }
  };

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
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subject Field - autoFocus on mount */}
        <AppTextInput
          label="Subject *"
          placeholder="e.g Payment Issue"
          value={subject}
          onChangeText={(val) => {
            setSubject(val);
            if (apiError) setApiError(null);
          }}
          autoFocus={true}
        />

        {/* Category Field */}
        <AppDropdown
          label="Category *"
          placeholder={contactSubjectsQuery.isLoading ? "Loading categories..." : "Select Category"}
          options={categories}
          value={category}
          onSelect={(val) => {
            setCategory(val);
            if (apiError) setApiError(null);
          }}
          enableSearch={false}
        />

        {/* Description Field */}
        <AppTextEditor
          label="Description *"
          placeholder="Describe your issue..."
          value={description}
          onChangeText={(val) => {
            setDescription(val);
            if (apiError) setApiError(null);
          }}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          maxLength={200}
        />

        {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

        {/* Submit Request Button */}
        <AppButton
          title={isSubmitted ? "Request Submitted!" : "Submit Request"}
          onPress={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          loading={isSubmitting}
          variant={isSubmitted ? "secondary" : "primary"}
          size="lg"
          rightIcon={isSubmitted ? <CheckIcon size={18} /> : undefined}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  errorText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: colors.error || "#EF4444",
    marginTop: 4,
  },
});
