import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ToggleIconItem } from "@/components/ProfileIcons";
import { AppDropdown, DropdownOption } from "@/components/ui";
import { colors } from "@/theme/colors";

export interface FormattedVehicleOption {
  id: string;
  label: string;
  plateNumber: string;
  seats: string;
}

interface Step1RouteTimeFormProps {
  pickup: string;
  onChangePickup: (val: string) => void;
  destination: string;
  onChangeDestination: (val: string) => void;
  onOpenPickupSearch?: () => void;
  onOpenDestinationSearch?: () => void;
  time: string;
  onOpenTimePicker: () => void;
  dateFormatted: string;
  onOpenDatePicker: () => void;
  dateValidationError: string | null;
  selectedVehicleId: string;
  onChangeSelectedVehicle: (val: string) => void;
  vehicleOptions: FormattedVehicleOption[];
  isLoadingVehicles: boolean;
  isRecurring: boolean;
  onChangeIsRecurring: (val: boolean) => void;
  isValid: boolean;
  onContinue: () => void;
}

export const Step1RouteTimeForm: React.FC<Step1RouteTimeFormProps> = ({
  pickup,
  onChangePickup,
  destination,
  onChangeDestination,
  onOpenPickupSearch,
  onOpenDestinationSearch,
  time,
  onOpenTimePicker,
  dateFormatted,
  onOpenDatePicker,
  dateValidationError,
  selectedVehicleId,
  onChangeSelectedVehicle,
  vehicleOptions,
  isLoadingVehicles,
  isRecurring,
  onChangeIsRecurring,
  isValid,
  onContinue,
}) => {
  const isSingleVehicle = vehicleOptions.length === 1;
  const singleVehicle = isSingleVehicle ? vehicleOptions[0] : null;

  const dropdownOptions: DropdownOption[] = vehicleOptions.map((v) => ({
    label: v.label,
    value: v.id,
  }));

  return (
    <>
      {/* Privacy Banner */}
      <View style={styles.privacyBanner}>
        <Text style={styles.privacyText}>
          For your privacy and safety, choose a nearby public location instead of your home or workplace.
        </Text>
      </View>

      {/* Vehicle Selection */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Vehicle</Text>
        {isSingleVehicle && singleVehicle && !isLoadingVehicles ? (
          <TextInput
            style={[styles.textInput, styles.readOnlyInput]}
            value={singleVehicle.label}
            editable={false}
            readOnly={true}
          />
        ) : (
          <AppDropdown
            placeholder="Select Vehicle"
            options={dropdownOptions}
            value={selectedVehicleId}
            onSelect={(val) => onChangeSelectedVehicle(val)}
            enableSearch={vehicleOptions.length > 5}
            isLoading={isLoadingVehicles}
            containerStyle={{ marginBottom: 0 }}
          />
        )}
      </View>

      {/* Pickup Location */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Pickup Location</Text>
        <TouchableOpacity
          style={styles.locationSelector}
          onPress={onOpenPickupSearch}
          activeOpacity={0.7}
        >
          <View style={styles.locationLeftContent}>
            <View style={[styles.markerIconBadge, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="location" size={16} color="#305CFF" />
            </View>
            <Text
              style={[styles.locationText, !pickup && styles.placeholderText]}
              numberOfLines={1}
            >
              {pickup || "Search pickup landmark or station..."}
            </Text>
          </View>
          <View style={styles.searchBadge}>
            <Ionicons name="search" size={15} color="#64748B" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Destination */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Destination</Text>
        <TouchableOpacity
          style={styles.locationSelector}
          onPress={onOpenDestinationSearch}
          activeOpacity={0.7}
        >
          <View style={styles.locationLeftContent}>
            <View style={[styles.markerIconBadge, { backgroundColor: "#F0FDF4" }]}>
              <Ionicons name="navigate" size={16} color="#16A34A" />
            </View>
            <Text
              style={[styles.locationText, !destination && styles.placeholderText]}
              numberOfLines={1}
            >
              {destination || "Search drop-off destination..."}
            </Text>
          </View>
          <View style={styles.searchBadge}>
            <Ionicons name="search" size={15} color="#64748B" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Time Field */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity
          style={styles.pickerField}
          onPress={onOpenTimePicker}
          activeOpacity={0.8}
        >
          <Text style={[styles.pickerValue, !time && styles.placeholderText]}>
            {time || "e.g 9:53 AM"}
          </Text>
          <Ionicons name="time-outline" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Date Field */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={[
            styles.pickerField,
            Boolean(dateValidationError) && styles.pickerFieldError,
          ]}
          onPress={onOpenDatePicker}
          activeOpacity={0.8}
        >
          <Text style={[styles.pickerValue, !dateFormatted && styles.placeholderText]}>
            {dateFormatted || "e.g 30 Mar 2026"}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#64748B" />
        </TouchableOpacity>
        {Boolean(dateValidationError) && (
          <Text style={styles.errorText}>{dateValidationError}</Text>
        )}
      </View>

      {/* Recurring Trip Toggle */}
      <View style={styles.toggleRow}>
        <ToggleIconItem
          value={isRecurring}
          onValueChange={onChangeIsRecurring}
        />
        <Text style={styles.toggleLabel}>Recurring Trip?</Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.continueBtn, !isValid && styles.continueBtnDisabled]}
        disabled={!isValid}
        onPress={onContinue}
        activeOpacity={0.8}
      >
        <Text style={[styles.continueBtnText, !isValid && styles.continueBtnTextDisabled]}>
          Continue
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  privacyBanner: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  privacyText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#193CB8",
    lineHeight: 18,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    fontWeight: "500",
    color: colors.dark,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: "DM Sans",
    color: "#0F172A",
  },
  readOnlyInput: {
    backgroundColor: "#F8FAFC",
    color: "#475569",
    borderColor: "#E2E8F0",
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  locationLeftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  markerIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  locationText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
    flex: 1,
  },
  searchBadge: {
    padding: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  pickerField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerFieldError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  pickerValue: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
  },
  placeholderText: {
    color: "#94A3B8",
  },
  errorText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  toggleLabel: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  continueBtn: {
    backgroundColor: "#375DFB",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  continueBtnDisabled: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  continueBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  continueBtnTextDisabled: {
    color: "#94A3B8",
  },
});
