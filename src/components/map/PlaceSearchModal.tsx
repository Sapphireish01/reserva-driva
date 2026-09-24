import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { mapsService, PlaceSuggestion, PlaceLocation } from "@/api/services/maps";
import { colors, palette } from "@/theme/colors";

interface PlaceSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPlace: (place: PlaceLocation) => void;
  title?: string;
  placeholder?: string;
  initialValue?: string;
}

// Popular Transit & Commuter Hubs for immediate selection
const POPULAR_HUBS: Array<{ name: string; address: string; placeQuery: string }> = [
  { name: "CMS Bus Terminal", address: "Marina / CMS, Lagos Island", placeQuery: "CMS Bus Stop, Marina, Lagos" },
  { name: "Oshodi Transport Interchange", address: "Agege Motor Road, Oshodi, Lagos", placeQuery: "Oshodi Bus Terminal, Lagos" },
  { name: "Ikeja Underbridge / City Mall", address: "Obafemi Awolowo Way, Ikeja", placeQuery: "Ikeja Under Bridge, Ikeja, Lagos" },
  { name: "Yaba Bus Stop / Montgomery", address: "Murtala Muhammed Way, Yaba, Lagos", placeQuery: "Yaba Bus Stop, Lagos" },
  { name: "Ajao Estate Junction", address: "Airport Road, Ajao Estate, Lagos", placeQuery: "Ajao Estate, Lagos" },
  { name: "Victoria Island (Eko Hotel)", address: "Adetokunbo Ademola St, VI, Lagos", placeQuery: "Eko Hotel, Victoria Island, Lagos" },
  { name: "Lekki Phase 1 Gate", address: "Lekki-Epe Expressway, Lekki, Lagos", placeQuery: "Lekki Phase 1 Gate, Lagos" },
];

export const PlaceSearchModal: React.FC<PlaceSearchModalProps> = ({
  visible,
  onClose,
  onSelectPlace,
  title = "Choose Location",
  placeholder = "Search street, landmark, or terminal...",
  initialValue = "",
}) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolvingPlace, setIsResolvingPlace] = useState(false);
  const [sessionToken, setSessionToken] = useState("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate unique session token when opening modal to group autocomplete & details billings
  useEffect(() => {
    if (visible) {
      setQuery(initialValue);
      setSuggestions([]);
      setSessionToken(`sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
    } else {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    }
  }, [visible, initialValue]);

  // Debounced search on query change
  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (text.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimerRef.current = setTimeout(async () => {
      const results = await mapsService.searchPlaces(text, sessionToken);
      setSuggestions(results);
      setIsSearching(false);
    }, 320);
  };

  const handleSelectSuggestion = async (item: PlaceSuggestion) => {
    setIsResolvingPlace(true);
    const details = await mapsService.getPlaceDetails(item.placeId, sessionToken);
    setIsResolvingPlace(false);

    if (details) {
      onSelectPlace(details);
      onClose();
    } else {
      // Fallback if details API returned empty
      onSelectPlace({
        placeId: item.placeId,
        name: item.mainText,
        address: item.description,
        coordinates: { latitude: 6.5244, longitude: 3.3792 },
      });
      onClose();
    }
  };

  const handleSelectPopularHub = async (hub: typeof POPULAR_HUBS[0]) => {
    setIsResolvingPlace(true);
    const searchResults = await mapsService.searchPlaces(hub.placeQuery, sessionToken);
    if (searchResults.length > 0) {
      const details = await mapsService.getPlaceDetails(searchResults[0].placeId, sessionToken);
      setIsResolvingPlace(false);
      if (details) {
        onSelectPlace(details);
        onClose();
        return;
      }
    }
    setIsResolvingPlace(false);
    // Fallback coordinates for known hub
    onSelectPlace({
      placeId: `hub-${hub.name.replace(/\s+/g, "-").toLowerCase()}`,
      name: hub.name,
      address: hub.address,
      coordinates: { latitude: 6.5244, longitude: 3.3792 },
    });
    onClose();
  };

  const handleClearQuery = () => {
    setQuery("");
    setSuggestions([]);
  };

  const renderSuggestionItem = ({ item }: { item: PlaceSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionRow}
      onPress={() => handleSelectSuggestion(item)}
      activeOpacity={0.7}
      disabled={isResolvingPlace}
    >
      <View style={styles.pinCircle}>
        <Ionicons name="location-sharp" size={18} color="#305CFF" />
      </View>
      <View style={styles.suggestionTextContainer}>
        <Text style={styles.suggestionMainText} numberOfLines={1}>
          {item.mainText}
        </Text>
        {Boolean(item.secondaryText) && (
          <Text style={styles.suggestionSecondaryText} numberOfLines={1}>
            {item.secondaryText}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Search Box */}
          <View style={styles.searchBoxContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                placeholderTextColor="#94A3B8"
                value={query}
                onChangeText={handleQueryChange}
                autoFocus={true}
                autoCorrect={false}
                clearButtonMode="never"
              />
              {isSearching ? (
                <ActivityIndicator size="small" color="#305CFF" style={styles.trailingIcon} />
              ) : query.length > 0 ? (
                <TouchableOpacity
                  onPress={handleClearQuery}
                  style={styles.trailingIcon}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Resolving Loader Indicator */}
          {isResolvingPlace && (
            <View style={styles.resolvingBanner}>
              <ActivityIndicator size="small" color="#305CFF" />
              <Text style={styles.resolvingText}>Pinpointing road coordinates...</Text>
            </View>
          )}

          {/* Search Results or Popular Suggestions */}
          {query.trim().length >= 2 ? (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.placeId}
              renderItem={renderSuggestionItem}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                !isSearching ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="navigate-circle-outline" size={48} color="#CBD5E1" />
                    <Text style={styles.emptyTitle}>No exact locations found</Text>
                    <Text style={styles.emptySubtitle}>
                      Try typing a broader area, street name, or public landmark.
                    </Text>
                  </View>
                ) : null
              }
            />
          ) : (
            <View style={styles.popularContainer}>
              <Text style={styles.popularHeaderTitle}>Suggested Transit Hubs</Text>
              <FlatList
                data={POPULAR_HUBS}
                keyExtractor={(item) => item.name}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.popularItemRow}
                    onPress={() => handleSelectPopularHub(item)}
                    activeOpacity={0.7}
                    disabled={isResolvingPlace}
                  >
                    <View style={styles.popularPinCircle}>
                      <Ionicons name="bus-outline" size={18} color="#4338CA" />
                    </View>
                    <View style={styles.suggestionTextContainer}>
                      <Text style={styles.suggestionMainText}>{item.name}</Text>
                      <Text style={styles.suggestionSecondaryText}>{item.address}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  searchBoxContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "DM Sans",
    color: "#0F172A",
    height: "100%",
    paddingVertical: 0,
  },
  trailingIcon: {
    padding: 4,
    marginLeft: 6,
  },
  resolvingBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EEF2FF",
    paddingVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  resolvingText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#3730A3",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  pinCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  suggestionTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  suggestionMainText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 2,
  },
  suggestionSecondaryText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#64748B",
  },
  popularContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  popularHeaderTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  popularItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  popularPinCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 14,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
});
