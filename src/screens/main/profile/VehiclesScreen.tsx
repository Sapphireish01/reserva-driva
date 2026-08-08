import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FileFormatIconItem, UploadIconItem, UsersIconItem } from "../../../components/ProfileIcons";
import {
  AppBottomSheet,
  AppButton,
  AppDropdown,
  AppFullScreenModal,
  AppTextInput,
  CheckIcon,
} from "../../../components/ui";
import {
  useAddVehicleMutation,
  useVehicleBrandsQuery,
  useVehicleColorsQuery,
  useVehicleModelsQuery,
  useVehiclesQuery,
} from "../../../hooks/useVehicles";
import { MainStackParamList } from "../../../navigation/types";
import { colors, spacing } from "../../../theme/colors";

type Props = NativeStackScreenProps<MainStackParamList, "Vehicles">;

interface Vehicle {
  id: string;
  make: string;
  brand: string;
  year: string;
  plateNumber: string;
  color: string;
  seats: string;
  isDefault: boolean;
  docName?: string;
}

const INITIAL_VEHICLES: Vehicle[] = [];

const MAKES = ["Toyota", "Cadillac", "Honda", "Hyundai", "Mercedes-Benz", "Nissan"];
const BRANDS: Record<string, string[]> = {
  Toyota: ["Camry", "Highlander", "Corolla", "RAV4", "Prado"],
  Cadillac: ["Escalade", "CT5", "XT5"],
  Honda: ["Accord", "Civic", "CR-V"],
  Hyundai: ["Elantra", "Tucson", "Santa Fe"],
  "Mercedes-Benz": ["E-Class", "C-Class", "GLE"],
  Nissan: ["Altima", "Pathfinder"],
};
const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2009"];

const formatFileName = (name?: string, maxLength = 20) => {
  if (!name) return "";
  if (name.length <= maxLength) return name;
  const lastDot = name.lastIndexOf(".");
  if (lastDot > 0) {
    const ext = name.substring(lastDot);
    const base = name.substring(0, lastDot);
    const avail = maxLength - ext.length - 3;
    if (avail > 2) {
      return `${base.substring(0, avail)}...${ext}`;
    }
  }
  return `${name.substring(0, maxLength - 3)}...`;
};

export const VehiclesScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);

  // Vehicle API queries & mutations
  const { data: serverVehicles, isLoading: isLoadingVehicles } = useVehiclesQuery();
  const { data: brandsData, isLoading: isLoadingBrands } = useVehicleBrandsQuery();
  const addVehicleMutation = useAddVehicleMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [make, setMake] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [color, setColor] = useState("");
  const [seats, setSeats] = useState("");
  const [docName, setDocName] = useState<string | undefined>(undefined);
  const [fileAsset, setFileAsset] = useState<{ uri: string; name?: string; type?: string } | undefined>(undefined);

  // Find matching selected brand object to get brand_id for models query
  const selectedBrandObj = React.useMemo(() => {
    if (!make || !brandsData) return undefined;
    return brandsData.find(
      (b) => b.name?.toLowerCase() === make.toLowerCase() || String(b.id) === make
    );
  }, [make, brandsData]);

  const selectedBrandId = selectedBrandObj?.id;

  // Query models for the selected brand_id (e.g. GET /drivers/vehicles/models/?brand_id=1)
  const { data: modelsData, isLoading: isLoadingModels } = useVehicleModelsQuery(
    selectedBrandId ? { brand_id: selectedBrandId } : undefined
  );

  const { data: colorsData, isLoading: isLoadingColors } = useVehicleColorsQuery();

  // Consolidate backend vehicles with local list
  const vehiclesList = React.useMemo(() => {
    if (serverVehicles && serverVehicles.length > 0) {
      return serverVehicles.map((v: any) => ({
        id: String(v.id),
        make: typeof v.brand === "object" ? v.brand?.name : String(v.brand),
        brand: typeof v.model === "object" ? v.model?.name : String(v.model),
        year: String(v.year || ""),
        plateNumber: v.plate_number || "",
        color: typeof v.colour === "object" ? (v.colour?.color_name || v.colour?.name) : String(v.colour || "Black"),
        seats: String(v.number_of_seats || "4"),
        isDefault: Boolean(v.is_default),
        docName: v.file ? String(v.file).split("/").pop() : undefined,
      }));
    }
    return vehicles;
  }, [serverVehicles, vehicles]);

  // Dynamic Brand dropdown options
  const brandOptions = React.useMemo(() => {
    if (brandsData && brandsData.length > 0) {
      return brandsData.map((b) => b.name);
    }
    return MAKES;
  }, [brandsData]);

  // Dynamic Model dropdown options based on brand_id
  const modelOptions = React.useMemo(() => {
    if (modelsData && modelsData.length > 0) {
      return modelsData.map((m) => m.name);
    }
    if (make && BRANDS[make]) {
      return BRANDS[make];
    }
    return [];
  }, [modelsData, make]);

  // Dynamic Color dropdown options from useVehicleColorsQuery
  const colorOptions = React.useMemo(() => {
    if (colorsData && colorsData.length > 0) {
      return colorsData.map((c: any) => c.color_name || c.name);
    }
    return ["Black", "White", "Silver", "Grey", "Blue", "Red", "Gold", "Green"];
  }, [colorsData]);

  // Modals state
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  const [selectedVehicleForAction, setSelectedVehicleForAction] = useState<Vehicle | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        setDocName(pickedFile.name || "vehicle_docs.pdf");
        setFileAsset({
          uri: pickedFile.uri,
          name: pickedFile.name || "vehicle_docs.pdf",
          type: pickedFile.mimeType || "image/jpeg",
        });
      }
    } catch (err) {
      console.log("Document picker error:", err);
    }
  };

  const handleOpenAdd = () => {
    setEditingVehicleId(null);
    setMake("");
    setBrand("");
    setYear("");
    setPlateNumber("");
    setColor("");
    setSeats("");
    setDocName(undefined);
    setFileAsset(undefined);
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setMake(v.make);
    setBrand(v.brand);
    setYear(v.year);
    setPlateNumber(v.plateNumber);
    setColor(v.color);
    setSeats(v.seats);
    setDocName(v.docName);
    setFileAsset(undefined);
    setShowActionSheet(false);
    setShowAddEditModal(true);
  };

  const handleSave = async () => {
    if (!make || !brand || !plateNumber) return;

    // Resolve brand ID from selection name (or fallback to make)
    const brandObj = brandsData?.find(
      (b) => b.name?.toLowerCase() === make.toLowerCase() || String(b.id) === make
    );
    const brandId = brandObj ? brandObj.id : make;

    // Resolve model ID from selection name (or fallback to brand)
    const modelObj = modelsData?.find(
      (m) => m.name?.toLowerCase() === brand.toLowerCase() || String(m.id) === brand
    );
    const modelId = modelObj ? modelObj.id : brand;

    // Resolve colour ID from selection name (or fallback to color)
    const colorObj = colorsData?.find(
      (c) => (c.color_name || c.name)?.toLowerCase() === color.toLowerCase() || String(c.id) === color
    );
    const colourId = colorObj ? colorObj.id : (color || 1);

    if (editingVehicleId) {
      setVehicles((prev) =>
        prev.map((item) =>
          item.id === editingVehicleId
            ? {
                ...item,
                make,
                brand,
                year,
                plateNumber,
                color,
                seats,
                docName,
              }
            : item
        )
      );
      setShowAddEditModal(false);
    } else {
      try {
        setIsSubmitting(true);
        await addVehicleMutation.mutateAsync({
          brand: brandId,
          model: modelId,
          year: year || "2020",
          colour: colourId,
          plate_number: plateNumber,
          number_of_seats: seats || "4",
          is_default: vehiclesList.length === 0,
          file: fileAsset,
        });

        const newV: Vehicle = {
          id: Date.now().toString(),
          make,
          brand,
          year,
          plateNumber,
          color,
          seats,
          isDefault: vehiclesList.length === 0,
          docName,
        };
        setVehicles((prev) => [...prev, newV]);
        setShowAddEditModal(false);
      } catch (err: any) {
        console.error("Error submitting vehicle enrollment:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSetDefault = () => {
    if (!selectedVehicleForAction) return;
    setVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        isDefault: v.id === selectedVehicleForAction.id,
      }))
    );
    setShowActionSheet(false);
  };

  const handleDelete = () => {
    if (!selectedVehicleForAction) return;
    setVehicles((prev) => prev.filter((v) => v.id !== selectedVehicleForAction.id));
    setShowDeleteSheet(false);
    setShowActionSheet(false);
  };

  const availableBrands = make ? BRANDS[make] || [] : [];
  const isFormValid = make.trim().length > 0 && brand.trim().length > 0 && plateNumber.trim().length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicles</Text>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={handleOpenAdd}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {vehiclesList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Vehicle Added</Text>
          <Text style={styles.emptySubtitle}>
            Add your vehicle details to start scheduling trips and accepting bookings.
          </Text>
          <AppButton
            title="Add Vehicle"
            onPress={handleOpenAdd}
            size="lg"
            style={{ width: "100%", marginTop: 16 }}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {vehiclesList.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={styles.vehicleCard}
              onPress={() => {
                setSelectedVehicleForAction(v);
                setShowActionSheet(true);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.vehicleTopRow}>
                <Text style={styles.vehicleName} numberOfLines={1}>
                  {v.make} {v.brand} {v.year}
                </Text>
                {v.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>

              <View style={styles.vehicleBottomRow}>
                <Text style={styles.vehicleMeta}>
                  {v.plateNumber} • {v.color || "Black"}
                </Text>
                <View style={styles.seatsRow}>
                  <View style={{ marginRight: 4 }}>
                    <UsersIconItem color="#868C98" size={16} />
                  </View>
                  <Text style={styles.seatsText}>{v.seats || "4"} Seats</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Add / Edit Vehicle Full Modal */}
      <AppFullScreenModal
        visible={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        title={editingVehicleId ? "Edit Vehicle" : "Add Vehicle"}
        rightActionText="Save"
        onRightAction={handleSave}
        rightActionDisabled={!isFormValid}
      >
        <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
          <AppDropdown
            label="Brand *"
            placeholder="Select Brand"
            options={brandOptions}
            value={make}
            onSelect={(val) => {
              setMake(val);
              setBrand("");
            }}
            enableSearch={true}
          />

          <AppDropdown
            label="Model *"
            placeholder={isLoadingModels ? "Loading models..." : "Select Model"}
            options={modelOptions}
            value={brand}
            onSelect={(val) => setBrand(val)}
            disabled={!make || isLoadingModels}
            enableSearch={true}
          />

          <AppDropdown
            label="Year *"
            placeholder="Select Year"
            options={YEARS}
            value={year}
            onSelect={(val) => setYear(val)}
            enableSearch={false}
          />

          <AppDropdown
            label="Vehicle Color"
            placeholder="Select Color"
            options={colorsData?.map((c) => c.color_name || c.name) || []}
            value={color}
            onSelect={(val) => setColor(val)}
            enableSearch={true}
          />

          {/* Plate Number Input with autoFocus */}
          <AppTextInput
            label="Plate Number *"
            placeholder="e.g KJA-123AA"
            value={plateNumber}
            onChangeText={setPlateNumber}
            autoCapitalize="characters"
            autoFocus={true}
          />


          <AppTextInput
            label="Seats Count"
            placeholder="e.g 4"
            value={seats}
            onChangeText={setSeats}
            keyboardType="number-pad"
          />

          {/* Document Upload Area */}
          <Text style={styles.inputLabel}>Vehicle Documents</Text>
          <TouchableOpacity
            style={[styles.uploadCard, docName ? styles.uploadCardSolid : null]}
            onPress={handlePickDocument}
            activeOpacity={0.7}
          >
            {docName ? (
              <View style={styles.uploadedRow}>
                <FileFormatIconItem filename={docName} size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.docNameText} numberOfLines={1}>{formatFileName(docName)}</Text>
                  <View style={styles.completedRow}>
                    <Text style={styles.docMetaText}>120 KB of 120 KB • </Text>
                    <CheckIcon size={16} />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setDocName(undefined);
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <UploadIconItem color="#64748B" size={32} />
                <Text style={styles.uploadMainTitle}>Choose a file or drag & drop it here.</Text>
                <Text style={styles.uploadSubtitle}>JPEG, PNG, PDF, and MP4 formats, up to 50 MB.</Text>
                <View style={styles.browseButton}>
                  <Text style={styles.browseButtonText}>Browse File</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          <AppButton
            title={isSubmitting ? "Submitting..." : editingVehicleId ? "Save Changes" : "Add Vehicle"}
            onPress={handleSave}
            disabled={!isFormValid || isSubmitting}
            size="lg"
            style={{ marginTop: 24 }}
          />
        </ScrollView>
      </AppFullScreenModal>

      {/* Vehicle Options Action Sheet */}
      <AppBottomSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        title={selectedVehicleForAction ? `${selectedVehicleForAction.make} ${selectedVehicleForAction.brand}` : "Vehicle Options"}
      >
        <TouchableOpacity
          style={styles.sheetOption}
          onPress={() => selectedVehicleForAction && handleOpenEdit(selectedVehicleForAction)}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>Edit vehicle details</Text>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        {!selectedVehicleForAction?.isDefault && (
          <TouchableOpacity style={styles.sheetOption} onPress={handleSetDefault} activeOpacity={0.7}>
            <Text style={styles.optionText}>Set as default vehicle</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.sheetOption}
          onPress={() => setShowDeleteSheet(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.optionText, { color: "#DC2626" }]}>Delete vehicle</Text>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </AppBottomSheet>

      {/* Delete Vehicle Bottom Sheet */}
      <AppBottomSheet
        visible={showDeleteSheet}
        onClose={() => setShowDeleteSheet(false)}
        title="Delete Vehicle?"
      >
        <Text style={styles.sheetSubtitle}>
          Are you sure you want to remove this vehicle from your account?
        </Text>
        <View style={styles.deleteActionRow}>
          <AppButton
            title="Cancel"
            onPress={() => setShowDeleteSheet(false)}
            variant="secondary"
            style={{ flex: 1 }}
          />
          <AppButton
            title="Delete"
            onPress={handleDelete}
            variant="destructive"
            style={{ flex: 1 }}
          />
        </View>
      </AppBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  plusButton: { width: 40, height: 40, justifyContent: "center", alignItems: "flex-end" },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: colors.dark },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  emptyTitle: { fontFamily: "DM Sans Bold", fontSize: 20, fontWeight: "700", color: "#0F172A", marginBottom: 8 },
  emptySubtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", textAlign: "center", marginBottom: 16 },
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  vehicleCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  vehicleTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  vehicleName: { fontFamily: "DM Sans Bold", fontSize: 16, fontWeight: "700", color: "#0F172A", flex: 1 },
  defaultBadge: { backgroundColor: "#EFF6FF", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
  defaultBadgeText: { fontFamily: "DM Sans Bold", fontSize: 11, fontWeight: "700", color: "#375DFB" },
  vehicleBottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  vehicleMeta: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },
  seatsRow: { flexDirection: "row", alignItems: "center" },
  seatsText: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },
  modalBody: { padding: 20 },
  inputLabel: { fontFamily: "DM Sans", fontSize: 14, fontWeight: "700", color: colors.dark, marginBottom: 6 },
  uploadCard: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  uploadCardSolid: {
    borderStyle: "solid",
    borderWidth: 1,
    padding: 16,
  },
  uploadPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  uploadMainTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 12,
    textAlign: "center",
  },
  uploadSubtitle: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: colors.grey,
    marginTop: 4,
    marginBottom: 16,
    textAlign: "center",
  },
  browseButton: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  browseButtonText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  uploadedRow: { flexDirection: "row", alignItems: "center" },
  docNameText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#0F172A" },
  completedRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  docMetaText: { fontFamily: "DM Sans", fontSize: 13, color: "#94A3B8" },
  completedText: { fontFamily: "DM Sans Bold", fontSize: 13, fontWeight: "600", color: "#0F172A", marginLeft: 4 },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  optionText: { fontFamily: "DM Sans", fontSize: 15, color: "#0F172A" },
  sheetSubtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", marginBottom: 20 },
  deleteActionRow: { flexDirection: "row", gap: 12, marginTop: 8 },
});
