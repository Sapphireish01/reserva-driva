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
import { modalTokens } from "../../theme/tokens";

export interface AppBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: number | string;
  showCloseButton?: boolean;
  showDragIndicator?: boolean;
  containerStyle?: ViewStyle;
}

export const AppBottomSheet: React.FC<AppBottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  maxHeight = "80%",
  showCloseButton = true,
  showDragIndicator = true,
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
                maxHeight: maxHeight as any,
                paddingBottom: Math.max(insets.bottom, 16),
              },
              containerStyle,
            ]}
          >
            {showDragIndicator && <View style={styles.dragPill} />}
            {(title || showCloseButton) && (
              <View style={styles.header}>
                <Text style={styles.headerTitle}>{title || ""}</Text>
                {showCloseButton && (
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={onClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={22} color="#64748B" />
                  </TouchableOpacity>
                )}
              </View>
            )}
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
    backgroundColor: modalTokens.backdropColor,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetCard: {
    backgroundColor: modalTokens.backgroundColor,
    borderTopLeftRadius: modalTokens.borderRadius,
    borderTopRightRadius: modalTokens.borderRadius,
    paddingTop: 12,
    paddingHorizontal: 20,
    width: "100%",
  },
  dragPill: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: modalTokens.dragIndicatorColor,
    alignSelf: "center",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexShrink: 1,
  },
});
