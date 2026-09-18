import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AppBottomSheet, AppLoader, CheckIcon } from "../../../../components/ui";
import { colors, palette } from "../../../../theme/colors";
import { useCreateDisputeMutation } from "../../../../hooks/useWallet";

interface RaiseDisputeModalProps {
  visible: boolean;
  reference: string;
  onClose: () => void;
  onSubmit?: (reason: string) => void;
}

export const RaiseDisputeModal: React.FC<RaiseDisputeModalProps> = ({
  visible,
  reference,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createDisputeMutation = useCreateDisputeMutation();

  const handleClose = () => {
    setReason("");
    setIsSubmitting(false);
    setIsSubmitted(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason.trim() || isSubmitting || isSubmitted) return;
    setIsSubmitting(true);
    try {
      await createDisputeMutation.mutateAsync({
        reference,
        reason: reason.trim(),
      });
      setIsSubmitted(true);
      if (onSubmit) onSubmit(reason.trim());
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "An error occurred while submitting the dispute. Please try again.";
      Alert.alert("Dispute Error", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = !reason.trim() || isSubmitting || isSubmitted;

  return (
    <AppBottomSheet
      visible={visible}
      onClose={handleClose}
      showCloseButton={false}
      showDragIndicator={false}
      maxHeight="80%"
    >
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Raise Dispute</Text>
          <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Input Area */}
        <Text style={styles.inputLabel}>Dispute Reason</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            placeholder="Report an issue with this pending payment"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={6}
            maxLength={200}
            value={reason}
            onChangeText={setReason}
            textAlignVertical="top"
          />
          <Text style={styles.charCounter}>{reason.length}/200</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            isButtonDisabled && styles.submitBtnDisabled,
            isSubmitted && styles.submitBtnSuccess,
          ]}
          disabled={isButtonDisabled || isSubmitting || isSubmitted}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <AppLoader />
          ) : isSubmitted ? (
            <View style={styles.successRow}>
              <Text style={styles.submitBtnText}>Submitted</Text>
              <CheckIcon />
            </View>
          ) : (
            <Text
              style={[
                styles.submitBtnText,
                isButtonDisabled && styles.submitBtnTextDisabled,
              ]}
            >
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingTop: 4,
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 20,
    fontWeight: "700",
    color: colors.dark,
  },
  cancelText: {
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "500",
    color: palette.slate[400],
  },
  inputLabel: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 10,
  },
  inputCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    minHeight: 160,
    backgroundColor: colors.background,
    justifyContent: "space-between",
    marginBottom: 24,
  },
  textInput: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: colors.dark,
    minHeight: 110,
    paddingTop: 0,
  },
  charCounter: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: colors.grey,
    alignSelf: "flex-end",
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#F8FAFC",
  },
  submitBtnSuccess: {
    backgroundColor: colors.primary,
  },
  submitBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  submitBtnTextDisabled: {
    color: palette.slate[300],
  },
  successRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
