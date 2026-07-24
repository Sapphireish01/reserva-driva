import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

  const [showCategorySheet, setShowCategorySheet] = useState(false);
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
        {/* Subject Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Subject</Text>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.inputField}
              placeholder="e.g Payment Issue"
              placeholderTextColor="#94A3B8"
              value={subject}
              onChangeText={setSubject}
            />
          </View>
        </View>

        {/* Category Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.inputCard}
            onPress={() => setShowCategorySheet(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.inputField, !category && styles.placeholderText]}>
              {category || "e.g Payment Issue"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Description Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <View style={styles.editorCard}>
            {/* Formatting Toolbar Header */}
            <View style={styles.toolbarHeader}>
              <TouchableOpacity style={styles.toolbarBtn}>
                <Text style={styles.toolbarBold}>B</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarBtn}>
                <Text style={styles.toolbarItalic}>I</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarBtn}>
                <Text style={styles.toolbarUnderline}>U</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarBtn}>
                <Ionicons name="options-outline" size={16} color="#64748B" />
              </TouchableOpacity>
              <View style={styles.toolbarDivider} />
              <TouchableOpacity style={styles.toolbarBtn}>
                <Ionicons name="list" size={16} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarBtn}>
                <Ionicons name="menu" size={16} color="#64748B" />
              </TouchableOpacity>
              <View style={styles.toolbarDivider} />
              <TouchableOpacity style={styles.toolbarBtn}>
                <Ionicons name="link-outline" size={16} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarBtn}>
                <Ionicons name="image-outline" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Multiline Description Input */}
            <TextInput
              style={styles.editorInput}
              placeholder="Placeholder text..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              maxLength={200}
              value={description}
              onChangeText={setDescription}
            />

            {/* Character Counter Footer */}
            <View style={styles.editorFooter}>
              <Text style={styles.charCount}>{description.length}/200</Text>
              <Ionicons name="pencil" size={12} color="#94A3B8" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </View>

        {/* Submit Request Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid && styles.submitButtonDisabled,
            isSubmitted && styles.submitButtonSuccess,
          ]}
          disabled={!isFormValid || isSubmitting}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : isSubmitted ? (
            <View style={styles.successRow}>
              <Text style={styles.submitBtnText}>Request Submitted!</Text>
              <Ionicons name="checkmark-circle" size={18} color="#22C55E" style={{ marginLeft: 6 }} />
            </View>
          ) : (
            <Text
              style={[
                styles.submitBtnText,
                !isFormValid && styles.submitBtnTextDisabled,
              ]}
            >
              Submit Request
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Category Selection Bottom Sheet Modal */}
      <Modal visible={showCategorySheet} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.sheetBackdrop}
            onPress={() => setShowCategorySheet(false)}
          />
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Choose Category</Text>
              <TouchableOpacity onPress={() => setShowCategorySheet(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.categoryItem}
                onPress={() => {
                  setCategory(cat);
                  setShowCategorySheet(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryItemText}>{cat}</Text>
              </TouchableOpacity>
            ))}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  inputField: {
    flex: 1,
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
  },
  placeholderText: {
    color: "#94A3B8",
  },
  editorCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  toolbarHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    gap: 12,
  },
  toolbarBtn: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  toolbarBold: { fontFamily: "DM Sans Bold", fontWeight: "900", fontSize: 14, color: "#475569" },
  toolbarItalic: { fontFamily: "DM Sans", fontStyle: "italic", fontSize: 14, color: "#475569" },
  toolbarUnderline: { fontFamily: "DM Sans", textDecorationLine: "underline", fontSize: 14, color: "#475569" },
  toolbarDivider: { width: 1, height: 16, backgroundColor: "#E2E8F0" },
  editorInput: {
    height: 120,
    fontFamily: "DM Sans",
    fontSize: 14,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    color: "#0F172A",
  },
  editorFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.md,
    paddingBottom: 10,
  },
  charCount: {
    fontFamily: "DM Sans",
    fontSize: 11,
    color: "#94A3B8",
  },
  submitButton: {
    backgroundColor: "#375DFB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  submitButtonDisabled: {
    backgroundColor: "#F8FAFC",
  },
  submitButtonSuccess: {
    backgroundColor: "#375DFB",
  },
  successRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  submitBtnTextDisabled: {
    color: "#CBD5E1",
  },

  /* Bottom Sheet Styles */
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    paddingBottom: spacing.xl * 1.5,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  sheetTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  categoryItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryItemText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
});
