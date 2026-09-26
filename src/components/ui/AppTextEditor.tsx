import { colors } from "@/theme/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { forwardRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { inputTokens } from "../../theme/tokens";
import { AppBottomSheet } from "./AppBottomSheet";
import { AppButton } from "./AppButton";
import { AppTextInput } from "./AppTextInput";

export interface AttachmentFile {
  uri: string;
  name?: string;
  type?: string;
}

export interface AppTextEditorProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
  minHeight?: number;
  containerStyle?: ViewStyle;
  onInsertLink?: () => void;
  onInsertImage?: () => void;
  attachments?: AttachmentFile[];
  onAttachmentsChange?: (attachments: AttachmentFile[]) => void;
}

export const AppTextEditor = forwardRef<TextInput, AppTextEditorProps>(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      showCharCount = true,
      minHeight = 160,
      containerStyle,
      value = "",
      onChangeText,
      onFocus,
      onBlur,
      autoFocus = false,
      onInsertLink,
      onInsertImage,
      attachments = [],
      onAttachmentsChange,
      style,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [textAlign, setTextAlign] = useState<"left" | "center">("left");
    const [isBulletList, setIsBulletList] = useState(false);

    // Built-in Link Modal states
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkTitle, setLinkTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    // Local Attachments state
    const [localAttachments, setLocalAttachments] = useState<AttachmentFile[]>(attachments);

    React.useEffect(() => {
      setLocalAttachments(attachments);
    }, [attachments]);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const currentLength = typeof value === "string" ? value.length : 0;

    const handleToggleBullet = () => {
      setIsBulletList((prev) => !prev);
      const strVal = typeof value === "string" ? value : "";
      if (!strVal) {
        onChangeText?.("• ");
      } else if (strVal.endsWith("\n")) {
        onChangeText?.(strVal + "• ");
      } else {
        onChangeText?.(strVal + "\n• ");
      }
    };

    const handleLinkBtnPress = () => {
      if (onInsertLink) {
        onInsertLink();
        return;
      }
      setLinkTitle("");
      setLinkUrl("");
      setShowLinkModal(true);
    };

    const handleConfirmInsertLink = () => {
      if (!linkUrl.trim()) return;
      const strVal = typeof value === "string" ? value : "";
      const formattedLink = linkTitle.trim()
        ? `[${linkTitle.trim()}](${linkUrl.trim()})`
        : linkUrl.trim();
      const spacer = strVal && !strVal.endsWith(" ") && !strVal.endsWith("\n") ? " " : "";
      onChangeText?.(strVal + spacer + formattedLink);
      setShowLinkModal(false);
      setLinkTitle("");
      setLinkUrl("");
    };

    const handleImageBtnPress = async () => {
      if (onInsertImage) {
        onInsertImage();
        return;
      }
      try {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          alert("Permission to access media library is required to attach images.");
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          const newFile: AttachmentFile = {
            uri: asset.uri,
            name: asset.fileName || `attachment_${Date.now()}.jpg`,
            type: asset.mimeType || "image/jpeg",
          };
          const updated = [...localAttachments, newFile];
          setLocalAttachments(updated);
          onAttachmentsChange?.(updated);
        }
      } catch (err) {
        console.warn("⚠️ Failed to pick image attachment:", err);
      }
    };

    const handleRemoveAttachment = (index: number) => {
      const updated = localAttachments.filter((_, i) => i !== index);
      setLocalAttachments(updated);
      onAttachmentsChange?.(updated);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View
          style={[
            styles.editorCard,
            { minHeight },
            isFocused && styles.focusedCard,
            !!error && styles.errorCard,
          ]}
        >
          {/* Formatting Toolbar */}
          <View style={styles.toolbar}>
            {/* Bold */}
            <TouchableOpacity
              style={[styles.toolBtn, isBold && styles.toolBtnActive]}
              onPress={() => setIsBold((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toolText,
                  { fontWeight: "700" },
                  isBold && styles.toolTextActive,
                ]}
              >
                B
              </Text>
            </TouchableOpacity>

            {/* Italic */}
            <TouchableOpacity
              style={[styles.toolBtn, isItalic && styles.toolBtnActive]}
              onPress={() => setIsItalic((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toolText,
                  { fontStyle: "italic", fontFamily: "serif" },
                  isItalic && styles.toolTextActive,
                ]}
              >
                I
              </Text>
            </TouchableOpacity>

            {/* Underline */}
            <TouchableOpacity
              style={[styles.toolBtn, isUnderline && styles.toolBtnActive]}
              onPress={() => setIsUnderline((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toolText,
                  { textDecorationLine: "underline" },
                  isUnderline && styles.toolTextActive,
                ]}
              >
                U
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Align Left */}
            <TouchableOpacity
              style={[styles.toolBtn, textAlign === "left" && styles.toolBtnActive]}
              onPress={() => setTextAlign("left")}
              activeOpacity={0.7}
            >
              <Feather
                name="align-left"
                size={16}
                color={textAlign === "left" ? "#0F172A" : "#868C98"}
              />
            </TouchableOpacity>

            {/* Align Center */}
            <TouchableOpacity
              style={[
                styles.toolBtn,
                textAlign === "center" && styles.toolBtnActive,
              ]}
              onPress={() =>
                setTextAlign((prev) => (prev === "center" ? "left" : "center"))
              }
              activeOpacity={0.7}
            >
              <Feather
                name="align-center"
                size={16}
                color={textAlign === "center" ? "#0F172A" : "#868C98"}
              />
            </TouchableOpacity>

            {/* Bullet List */}
            <TouchableOpacity
              style={[styles.toolBtn, isBulletList && styles.toolBtnActive]}
              onPress={handleToggleBullet}
              activeOpacity={0.7}
            >
              <Feather
                name="list"
                size={16}
                color={isBulletList ? "#0F172A" : "#868C98"}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Insert Link */}
            <TouchableOpacity
              style={styles.toolBtn}
              onPress={handleLinkBtnPress}
              activeOpacity={0.7}
            >
              <Feather name="link-2" size={16} color="#868C98" />
            </TouchableOpacity>

            {/* Insert Image / Media Attachment */}
            <TouchableOpacity
              style={styles.toolBtn}
              onPress={handleImageBtnPress}
              activeOpacity={0.7}
            >
              <Feather name="image" size={16} color="#868C98" />
            </TouchableOpacity>
          </View>

          {/* Text Input Field */}
          <TextInput
            ref={ref}
            style={[
              styles.inputField,
              {
                minHeight: minHeight - 90,
                fontWeight: isBold ? "700" : "400",
                fontStyle: isItalic ? "italic" : "normal",
                textDecorationLine: isUnderline ? "underline" : "none",
                textAlign,
              },
              style,
            ]}
            placeholderTextColor={inputTokens.placeholderColor}
            onFocus={handleFocus}
            onBlur={handleBlur}
            multiline
            textAlignVertical="top"
            maxLength={maxLength}
            value={value}
            onChangeText={onChangeText}
            autoFocus={autoFocus}
            {...props}
          />

          {/* Attached Media Chips */}
          {localAttachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {localAttachments.map((file, idx) => (
                <View key={file.uri + idx} style={styles.attachmentChip}>
                  <Image source={{ uri: file.uri }} style={styles.attachmentThumbnail} />
                  <Text style={styles.attachmentName} numberOfLines={1}>
                    {file.name || "Attachment"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveAttachment(idx)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close-circle" size={18} color="#64748B" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Bottom Right Character Counter & Resize handle */}
          {showCharCount && (
            <View style={styles.footerRow}>
              <Text style={styles.charCount}>
                {maxLength ? `${currentLength}/${maxLength}` : `${currentLength}`}
              </Text>
              <Text style={styles.resizeIcon}>{"//"}</Text>
            </View>
          )}
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : helperText ? (
          <Text style={styles.helperText}>{helperText}</Text>
        ) : null}

        {/* Built-in Link Insertion Bottom Sheet */}
        <AppBottomSheet
          visible={showLinkModal}
          onClose={() => setShowLinkModal(false)}
          title="Insert Link"
        >
          <View style={styles.linkModalContent}>
            <AppTextInput
              label="Link Title / Text (Optional)"
              placeholder="e.g. Booking Portal"
              value={linkTitle}
              onChangeText={setLinkTitle}
            />
            <AppTextInput
              label="URL *"
              placeholder="https://example.com"
              value={linkUrl}
              onChangeText={setLinkUrl}
              keyboardType="url"
              autoCapitalize="none"
            />
            <AppButton
              title="Insert Link"
              onPress={handleConfirmInsertLink}
              disabled={!linkUrl.trim()}
              size="md"
              style={{ marginTop: 12 }}
            />
          </View>
        </AppBottomSheet>
      </View>
    );
  }
);

AppTextEditor.displayName = "AppTextEditor";

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 6,
  },
  editorCard: {
    borderWidth: inputTokens.borderWidth,
    borderColor: inputTokens.borderColor,
    borderRadius: 16,
    backgroundColor: inputTokens.backgroundColor,
    padding: 12,
    justifyContent: "space-between",
  },
  focusedCard: {},
  errorCard: {
    borderColor: inputTokens.errorBorderColor,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    gap: 2,
  },
  toolBtn: {
    flex: 1,
    height: 30,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  toolBtnActive: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  toolText: {
    fontSize: 15,
    color: "#64748B",
  },
  toolTextActive: {
    color: "#0F172A",
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 4,
  },
  inputField: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: inputTokens.textColor,
    paddingTop: 2,
    paddingBottom: 2,
  },
  attachmentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    marginBottom: 4,
  },
  attachmentChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: "100%",
    gap: 6,
  },
  attachmentThumbnail: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  attachmentName: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#334155",
    maxWidth: 140,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 4,
  },
  charCount: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#868C98",
  },
  resizeIcon: {
    fontFamily: "DM Sans",
    fontSize: 11,
    color: "#868C98",
    fontWeight: "600",
    letterSpacing: -1,
  },
  errorText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: inputTokens.errorBorderColor,
    marginTop: 4,
  },
  helperText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  linkModalContent: {
    paddingVertical: 8,
    gap: 8,
  },
});
