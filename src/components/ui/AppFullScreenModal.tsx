import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AppFullScreenModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  rightActionText?: string;
  onRightAction?: () => void;
  rightActionDisabled?: boolean;
  height?: number | string;
  containerStyle?: ViewStyle;
}

export const AppFullScreenModal: React.FC<AppFullScreenModalProps> = ({
  visible,
  onClose,
  title,
  children,
  rightActionText,
  onRightAction,
  rightActionDisabled = false,
  height = "65%",
  containerStyle,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.overlayContainer}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={onClose}
          />
          <View
            style={[
              styles.sheetCard,
              {
                height: height as any,
                paddingBottom: Math.max(insets.bottom, 16),
              },
              containerStyle,
            ]}
          >
            <View style={styles.dragPill} />
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={22} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{title}</Text>
              {rightActionText && onRightAction ? (
                <TouchableOpacity
                  onPress={onRightAction}
                  disabled={rightActionDisabled}
                >
                  <Text
                    style={[
                      styles.rightActionText,
                      rightActionDisabled && styles.rightActionDisabled,
                    ]}
                  >
                    {rightActionText}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={{ width: 36 }} />
              )}
            </View>

            {/* Content */}
            <View style={styles.content}>{children}</View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    width: "100%",
  },
  dragPill: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 8,
  },
  header: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  rightActionText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: colors.dark,
  },
  rightActionDisabled: {
    color: "#CAD5E2",
  },
  content: {
    flex: 1,
  },
});

