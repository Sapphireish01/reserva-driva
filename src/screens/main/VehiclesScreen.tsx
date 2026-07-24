import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UploadIconItem } from "../../components/ProfileIcons";
import { MainStackParamList } from "../../navigation/types";
import { spacing } from "../../theme/colors";

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

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "1",
    make: "Toyota",
    brand: "High Lander 2026",
    year: "2026",
    plateNumber: "KTU908GH",
    color: "Black",
    seats: "4",
    isDefault: true,
    docName: "vehicle_docs.pdf",
  },
  {
    id: "2",
    make: "Cadillac",
    brand: "Escalade",
    year: "2024",
    plateNumber: "KTU908GH",
    color: "Black",
    seats: "4",
    isDefault: false,
    docName: "vehicle_docs.pdf",
  },
];

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

export const VehiclesScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);

  // Modals state
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  const [selectedVehicleForAction, setSelectedVehicleForAction] = useState<Vehicle | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);

  // Form State
  const [make, setMake] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [color, setColor] = useState("");
  const [seats, setSeats] = useState("");
  const [docName, setDocName] = useState<string | undefined>("vehicle_docs.pdf");

  // Selection Dropdown Sheets inside Add/Edit Modal
  const [activeDropdown, setActiveDropdown] = useState<"make" | "brand" | "year" | null>(null);

  const handleOpenAdd = () => {
    setEditingVehicleId(null);
    setMake("");
    setBrand("");
    setYear("");
    setPlateNumber("");
    setColor("");
    setSeats("");
    setDocName("vehicle_docs.pdf");
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
    setDocName(v.docName || "vehicle_docs.pdf");
    setShowActionSheet(false);
    setShowAddEditModal(true);
  };

  const handleSave = () => {
    if (!make || !brand || !plateNumber) return;

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
    } else {
      const newV: Vehicle = {
        id: Date.now().toString(),
        make,
        brand,
        year,
        plateNumber,
        color,
        seats,
        isDefault: vehicles.length === 0,
        docName,
      };
      setVehicles((prev) => [...prev, newV]);
    }
    setShowAddEditModal(false);
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
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicles</Text>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={handleOpenAdd}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {vehicles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={64} color="#94A3B8" style={{ marginBottom: spacing.md }} />
          <Text style={styles.emptyTitle}>No Vehicle Added</Text>
          <Text style={styles.emptySubtitle}>
            Add your vehicle details to start scheduling trips and accepting bookings.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleOpenAdd} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Add Vehicle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {vehicles.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={styles.vehicleCard}
              onPress={() => {
                setSelectedVehicleForAction(v);
                setShowActionSheet(true);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.vehicleCardHeader}>
                <View style={styles.titleRow}>
                  <Text style={styles.vehicleName}>
                    {v.make} {v.brand} {v.year}
                  </Text>
                  {v.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                <View style={styles.seatsRow}>
                  <Ionicons name="people-outline" size={16} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.seatsText}>{v.seats || "4"} Seats</Text>
                </View>
              </View>
              <Text style={styles.vehicleMeta}>
                {v.plateNumber} • {v.color || "Black"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Add / Edit Vehicle Full Modal */}
      <Modal visible={showAddEditModal} animationType="slide">
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddEditModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>
              {editingVehicleId ? "Edit Vehicle" : "Add Vehicle"}
            </Text>
            <TouchableOpacity onPress={handleSave} disabled={!isFormValid}>
              <Text style={[styles.modalSaveText, !isFormValid && styles.modalSaveTextDisabled]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Make */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Make</Text>
              <TouchableOpacity
                style={styles.dropdownCard}
                onPress={() => setActiveDropdown("make")}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownValue, !make && styles.placeholderText]}>
                  {make || "e.g Toyota"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Brand */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Brand</Text>
              <TouchableOpacity
                style={styles.dropdownCard}
                onPress={() => setActiveDropdown("brand")}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownValue, !brand && styles.placeholderText]}>
                  {brand || "e.g Camry"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Year */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Year</Text>
              <TouchableOpacity
                style={styles.dropdownCard}
                onPress={() => setActiveDropdown("year")}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownValue, !year && styles.placeholderText]}>
                  {year || "e.g 2009"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Plate Number */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Plate Number</Text>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g JKU-32-YH"
                  placeholderTextColor="#94A3B8"
                  value={plateNumber}
                  onChangeText={setPlateNumber}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            {/* Colour */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Colour</Text>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g Black"
                  placeholderTextColor="#94A3B8"
                  value={color}
                  onChangeText={setColor}
                />
              </View>
            </View>

            {/* Number of Seats */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Number of Seats</Text>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g 2"
                  placeholderTextColor="#94A3B8"
                  value={seats}
                  onChangeText={setSeats}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Vehicle Documents */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Vehicle Documents</Text>

              {docName ? (
                <View style={styles.docCard}>
                  <View style={styles.docLeft}>
                    <View style={styles.pdfBadge}>
                      <Text style={styles.pdfBadgeText}>PDF</Text>
                    </View>
                    <View>
                      <Text style={styles.docNameText}>{docName}</Text>
                      <View style={styles.docStatusRow}>
                        <Text style={styles.docSizeText}>0 KB of 120 KB • </Text>
                        <Ionicons name="checkmark-circle" size={12} color="#22C55E" style={{ marginRight: 2 }} />
                        <Text style={styles.docCompletedText}>Completed</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setDocName(undefined)}>
                    <Ionicons name="trash-outline" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.dropzoneCard}
                  onPress={() => setDocName("vehicle_docs.pdf")}
                  activeOpacity={0.8}
                >
                  <View style={{ marginBottom: 6 }}>
                    <UploadIconItem size={32} color="#868C98" />
                  </View>
                  <Text style={styles.dropzoneTitle}>Choose a file or drag & drop it here.</Text>
                  <Text style={styles.dropzoneSubtitle}>
                    JPEG, PNG, PDF, and MP4 formats, up to 50 MB.
                  </Text>
                  <View style={styles.browseButton}>
                    <Text style={styles.browseButtonText}>Browse File</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Dropdown Options Bottom Sheet */}
      <Modal visible={!!activeDropdown} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} onPress={() => setActiveDropdown(null)} />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {activeDropdown === "make"
                  ? "Select Make"
                  : activeDropdown === "brand"
                  ? "Select Brand"
                  : "Select Year"}
              </Text>
              <TouchableOpacity onPress={() => setActiveDropdown(null)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {(activeDropdown === "make"
              ? MAKES
              : activeDropdown === "brand"
              ? BRANDS[make] || BRANDS["Toyota"]
              : YEARS
            ).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.optionItem}
                onPress={() => {
                  if (activeDropdown === "make") setMake(opt);
                  else if (activeDropdown === "brand") setBrand(opt);
                  else if (activeDropdown === "year") setYear(opt);
                  setActiveDropdown(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.optionItemText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Vehicle Action Options Bottom Sheet */}
      <Modal visible={showActionSheet} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} onPress={() => setShowActionSheet(false)} />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Vehicle Details</Text>
              <TouchableOpacity onPress={() => setShowActionSheet(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => selectedVehicleForAction && handleOpenEdit(selectedVehicleForAction)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionRowText}>Edit Vehicle</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionRow} onPress={handleSetDefault} activeOpacity={0.7}>
              <Text style={styles.actionRowText}>Set As Default</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                setShowActionSheet(false);
                setShowDeleteSheet(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.actionRowText}>Delete Vehicle</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Vehicle Bottom Sheet */}
      <Modal visible={showDeleteSheet} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} onPress={() => setShowDeleteSheet(false)} />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Delete Vehicle?</Text>
              <TouchableOpacity onPress={() => setShowDeleteSheet(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSubtitle}>Are you sure you want to delete this vehicle?</Text>

            <TouchableOpacity style={styles.redBtn} onPress={handleDelete} activeOpacity={0.8}>
              <Text style={styles.redBtnText}>Delete Vehicle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => setShowDeleteSheet(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.outlineBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  plusButton: { width: 40, height: 40, justifyContent: "center", alignItems: "flex-end" },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A", marginBottom: 6 },
  emptySubtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", textAlign: "center", lineHeight: 20, marginBottom: spacing.lg },
  primaryButton: {
    width: "100%",
    backgroundColor: "#375DFB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#FFFFFF" },

  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl * 2 },
  vehicleCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: "#FFFFFF",
  },
  vehicleCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  titleRow: { flexDirection: "row", alignItems: "center" },
  vehicleName: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#0F172A", marginRight: 8 },
  defaultBadge: { backgroundColor: "#F1F5F9", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  defaultBadgeText: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B", fontWeight: "600" },
  seatsRow: { flexDirection: "row", alignItems: "center" },
  seatsText: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },
  vehicleMeta: { fontFamily: "DM Sans", fontSize: 13, color: "#94A3B8" },

  /* Modal Form */
  modalContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalCancelText: { fontFamily: "DM Sans", fontSize: 15, color: "#94A3B8" },
  modalHeaderTitle: { fontFamily: "DM Sans Bold", fontSize: 16, fontWeight: "700", color: "#0F172A" },
  modalSaveText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#375DFB" },
  modalSaveTextDisabled: { color: "#CBD5E1" },
  modalBody: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl * 2 },
  fieldGroup: { marginBottom: spacing.lg },
  label: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#0F172A", marginBottom: 6 },
  dropdownCard: {
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
  dropdownValue: { fontFamily: "DM Sans", fontSize: 14, color: "#0F172A" },
  placeholderText: { color: "#94A3B8" },
  inputCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  inputField: { fontFamily: "DM Sans", fontSize: 14, color: "#0F172A" },

  /* Dropzone & Upload Card */
  dropzoneCard: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  dropzoneTitle: { fontFamily: "DM Sans Bold", fontSize: 13, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
  dropzoneSubtitle: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8", textAlign: "center", marginBottom: spacing.md },
  browseButton: { borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 6 },
  browseButtonText: { fontFamily: "DM Sans Bold", fontSize: 12, color: "#475569" },

  docCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: "#FFFFFF",
  },
  docLeft: { flexDirection: "row", alignItems: "center" },
  pdfBadge: { backgroundColor: "#EF4444", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 4, marginRight: 10 },
  pdfBadgeText: { fontFamily: "DM Sans Bold", fontSize: 10, color: "#FFFFFF", fontWeight: "800" },
  docNameText: { fontFamily: "DM Sans Bold", fontSize: 13, fontWeight: "700", color: "#0F172A" },
  docStatusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  docSizeText: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8" },
  docCompletedText: { fontFamily: "DM Sans", fontSize: 11, color: "#22C55E", fontWeight: "600" },

  /* Bottom Sheets */
  sheetOverlay: { flex: 1, justifyContent: "flex-end" },
  sheetBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15, 23, 42, 0.4)" },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
  },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sheetTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  sheetSubtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", marginBottom: spacing.lg, lineHeight: 20 },
  optionItem: { backgroundColor: "#F8FAFC", borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm },
  optionItemText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "600", color: "#0F172A" },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  actionRowText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "600", color: "#0F172A" },
  redBtn: { backgroundColor: "#EF4444", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginBottom: spacing.sm },
  redBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  outlineBtn: { borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, paddingVertical: 14, alignItems: "center" },
  outlineBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, fontWeight: "600", color: "#475569" },
});
