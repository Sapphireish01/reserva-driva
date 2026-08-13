import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { inputTokens } from "../../theme/tokens";
import { AppBottomSheet } from "./AppBottomSheet";
import { AppLoader } from "./AppLoader";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface AppDropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: DropdownOption[] | string[];
  onSelect: (value: string, option?: DropdownOption) => void;
  error?: string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  containerStyle?: ViewStyle;
}

export const AppDropdown: React.FC<AppDropdownProps> = ({
  label,
  placeholder = "Select option",
  value,
  options,
  onSelect,
  error,
  enableSearch = true,
  searchPlaceholder = "Search...",
  disabled = false,
  isLoading = false,
  containerStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isDropdownDisabled = disabled || isLoading;

  // Normalize options array
  const normalizedOptions: DropdownOption[] = useMemo(() => {
    return options.map((opt) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt
    );
  }, [options]);

  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  // Filter options for large datasets (e.g. 1000+ banks)
  const filteredOptions = useMemo(() => {
    if (!enableSearch || !searchQuery.trim()) {
      return normalizedOptions;
    }
    const q = searchQuery.toLowerCase();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(q)
    );
  }, [normalizedOptions, searchQuery, enableSearch]);

  const handleOpen = () => {
    if (isDropdownDisabled) return;
    setSearchQuery("");
    setModalVisible(true);
  };

  const handleSelectOption = (item: DropdownOption) => {
    onSelect(item.value, item);
    setModalVisible(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: DropdownOption }) => {
      const isSelected = item.value === value;
      return (
        <TouchableOpacity
          style={[styles.optionItem, isSelected && styles.optionItemSelected]}
          onPress={() => handleSelectOption(item)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.optionText,
              isSelected && styles.optionTextSelected,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [value]
  );

  const keyExtractor = useCallback(
    (item: DropdownOption, index: number) => item.value + "_" + index,
    []
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.inputCard,
          modalVisible && styles.focusedCard,
          !!error && styles.errorCard,
          isDropdownDisabled && styles.disabledCard,
        ]}
        onPress={handleOpen}
        activeOpacity={0.8}
        disabled={isDropdownDisabled}
      >
        <Text
          style={[
            styles.valueText,
            (!selectedOption || isLoading) && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {isLoading
            ? "Loading options..."
            : selectedOption
            ? selectedOption.label
            : placeholder}
        </Text>
        {isLoading ? (
          <AppLoader size={16} color="#64748B" />
        ) : (
          <Ionicons name="chevron-down" size={18} color="#64748B" />
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <AppBottomSheet
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={label || placeholder}
        maxHeight="85%"
      >
        {enableSearch && normalizedOptions.length > 5 && (
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <FlatList
          data={filteredOptions}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={15}
          maxToRenderPerBatch={20}
          windowSize={10}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No results found</Text>
            </View>
          }
        />
      </AppBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 6,
  },
  inputCard: {
    height: inputTokens.height,
    borderWidth: inputTokens.borderWidth,
    borderColor: inputTokens.borderColor,
    borderRadius: inputTokens.borderRadius,
    backgroundColor: inputTokens.backgroundColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  focusedCard: {
    // borderColor: inputTokens.focusedBorderColor,
  },
  errorCard: {
    borderColor: inputTokens.errorBorderColor,
  },
  disabledCard: {
    backgroundColor: "#F1F5F9",
  },
  valueText: {
    flex: 1,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    color: colors.dark,
    marginRight: 8,
  },
  placeholderText: {
    color: inputTokens.placeholderColor,
  },
  errorText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: inputTokens.errorBorderColor,
    marginTop: 4,
  },
  searchBar: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    color: "#0F172A",
    height: "100%",
  },
  listContent: {
    paddingBottom: 24,
  },
  optionItem: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    borderRadius: 8,
  },
  optionItemSelected: {
    backgroundColor: "#EFF6FF",
  },
  optionText: {
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "500",
    color: colors.dark,
  },
  optionTextSelected: {
    // fontFamily: "DM Sans Bold",
    // fontWeight: "700",
    color: colors.dark,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#94A3B8",
  },
});
