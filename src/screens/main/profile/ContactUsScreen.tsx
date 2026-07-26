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
} from "../../../components/ui";
import { MainStackParamList } from "../../../navigation/types";
import { spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "ContactUs">;

const CATEGORIES = [
  "Payment Issues",
  "Account Issues",
  "Security Concern",
  "Other",
  "Bug",
];

export const ContactUsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isFormValid =
    subject.trim().length > 0 &&
    category.trim().length > 0 &&
    description.trim().length > 0;

  const handleSubmit = () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1200);
    }, 1200);
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
          onChangeText={setSubject}
          autoFocus={true}
        />

        {/* Category Field */}
        <AppDropdown
          label="Category *"
          placeholder="e.g Payment Issue"
          options={CATEGORIES}
          value={category}
          onSelect={(val) => setCategory(val)}
          enableSearch={false}
        />

        {/* Description Field */}
        <AppTextEditor
          label="Description *"
          placeholder="Describe your issue..."
          value={description}
          onChangeText={setDescription}
          maxLength={200}
        />

        {/* Submit Request Button */}
        <AppButton
          title={isSubmitted ? "Request Submitted!" : "Submit Request"}
          onPress={handleSubmit}
          disabled={!isFormValid}
          loading={isSubmitting}
          variant={isSubmitted ? "secondary" : "primary"}
          size="lg"
          rightIcon={isSubmitted ? <Ionicons name="checkmark-circle" size={18} color="#22C55E" /> : undefined}
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
});
