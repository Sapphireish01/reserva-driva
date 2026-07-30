import { Ionicons } from "@expo/vector-icons";
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
import { ToggleIconItem } from "../../../../components/ProfileIcons";
import { CheckIcon } from "../../../../components/ui";
import { colors, spacing } from "../../../../theme/colors";
import { DatePickerModal } from "./DatePickerModal";
import { TimePickerModal } from "./TimePickerModal";

interface SetAvailabilityModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (tripData: any) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

export const SetAvailabilityModal: React.FC<SetAvailabilityModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const insets = useSafeAreaInsets();

  // Step 1 or Step 2
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 Form State
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [dateFormatted, setDateFormatted] = useState("");
  const [rawDateObj, setRawDateObj] = useState<Date | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);

  // Step 2 Form State
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Monthly" | "">("");
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [endDateFormatted, setEndDateFormatted] = useState("");

  // Modals Visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<"startDate" | "endDate">("startDate");
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Validation state
  const [dateValidationError, setDateValidationError] = useState<string | null>(null);

  // Reset form state on close
  const handleClose = () => {
    setStep(1);
    setPickup("");
    setDestination("");
    setTime("");
    setDateFormatted("");
    setRawDateObj(null);
    setIsRecurring(false);
    setFrequency("");
    setIsCustomRange(false);
    setSelectedDays([]);
    setEndDateFormatted("");
    setDateValidationError(null);
    onClose();
  };

  const validateDateAdvance = (dateObj: Date) => {
    const now = new Date();
    const minAdvanceTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours in future

    if (dateObj.getTime() < minAdvanceTime.getTime()) {
      setDateValidationError("Trips must be scheduled at least 24 hours in advance.");
      return false;
    } else {
      setDateValidationError(null);
      return true;
    }
  };

  const handleDateSelect = (formattedDate: string, rawDate: Date) => {
    if (datePickerTarget === "startDate") {
      setDateFormatted(formattedDate);
      setRawDateObj(rawDate);
      validateDateAdvance(rawDate);
    } else {
      setEndDateFormatted(formattedDate);
    }
  };

  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleStep1Continue = () => {
    if (!pickup.trim() || !destination.trim() || !time || !dateFormatted) {
      return;
    }
    if (rawDateObj && !validateDateAdvance(rawDateObj)) {
      return;
    }

    if (isRecurring) {
      setStep(2);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    onSubmit({
      pickupLocation: pickup,
      destination,
      departureTime: time,
      date: dateFormatted,
      isRecurring,
      frequency: isRecurring ? frequency : undefined,
      customDays: isRecurring && isCustomRange ? selectedDays : undefined,
      endDate: isRecurring ? endDateFormatted : undefined,
    });
    handleClose();
  };

  const isStep1Valid =
    pickup.trim().length > 0 &&
    destination.trim().length > 0 &&
    time.length > 0 &&
    dateFormatted.length > 0 &&
    !dateValidationError;

  const isStep2Valid =
    !isRecurring ||
    (frequency.length > 0 || (isCustomRange && selectedDays.length > 0)) &&
    endDateFormatted.length > 0;

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                {step === 2 && (
                  <TouchableOpacity onPress={() => setStep(1)} style={{ marginRight: 10 }}>
                    <Ionicons name="arrow-back" size={20} color="#0F172A" />
                  </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>Set Availability</Text>
              </View>

              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 520 }}>
              {step === 1 ? (
                <>
                  {/* Privacy Banner */}
                  <View style={styles.privacyBanner}>
                    <Text style={styles.privacyText}>
                      For your privacy and safety, choose a nearby public location instead of your home or workplace.
                    </Text>
                  </View>

                  {/* Pickup Location */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Pickup Location</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g Ajao Estate Police Station"
                      placeholderTextColor="#94A3B8"
                      value={pickup}
                      onChangeText={setPickup}
                    />
                  </View>

                  {/* Destination */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Destination</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g CMS Bus stop"
                      placeholderTextColor="#94A3B8"
                      value={destination}
                      onChangeText={setDestination}
                    />
                  </View>

                  {/* Time Field */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Time</Text>
                    <TouchableOpacity
                      style={styles.pickerField}
                      onPress={() => setShowTimePicker(true)}
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
                      onPress={() => {
                        setDatePickerTarget("startDate");
                        setShowDatePicker(true);
                      }}
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
                      onValueChange={setIsRecurring}
                    />
                    <Text style={styles.toggleLabel}>Recurring Trip?</Text>
                  </View>

                  {/* Continue Button */}
                  <TouchableOpacity
                    style={[styles.continueBtn, !isStep1Valid && styles.continueBtnDisabled]}
                    disabled={!isStep1Valid}
                    onPress={handleStep1Continue}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.continueBtnText, !isStep1Valid && styles.continueBtnTextDisabled]}>
                      Continue
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Step 2: Recurring Options */}
                  <Text style={[styles.label, { marginBottom: 12 }]}>Frequency</Text>

                  {/* Frequency Options */}
                  {["Daily", "Weekly", "Monthly"].map((freq) => {
                    const isSelected = frequency === freq && !isCustomRange;
                    return (
                      <TouchableOpacity
                        key={freq}
                        style={[styles.freqCard, isSelected && styles.freqCardSelected]}
                        onPress={() => {
                          setFrequency(freq as any);
                          setIsCustomRange(false);
                        }}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                          {isSelected && <CheckIcon size={14} color="#FFFFFF" />}
                        </View>
                        <Text style={styles.freqText}>{freq}</Text>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Custom Range Switch */}
                  <View style={[styles.toggleRow, { marginTop: 12, justifyContent: "flex-end" }]}>
                    <ToggleIconItem
                      value={isCustomRange}
                      onValueChange={(val) => {
                        setIsCustomRange(val);
                        if (val) setFrequency("");
                      }}
                    />
                    <Text style={styles.toggleLabel}>Custom Range</Text>
                  </View>

                  {/* Custom Days Pills (when Custom Range ON) */}
                  {isCustomRange && (
                    <View style={styles.daysGrid}>
                      {WEEKDAYS.map((day) => {
                        const isSelected = selectedDays.includes(day);
                        return (
                          <TouchableOpacity
                            key={day}
                            style={[styles.dayPill, isSelected && styles.dayPillSelected]}
                            onPress={() => toggleDaySelection(day)}
                            activeOpacity={0.8}
                          >
                            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                              {isSelected && <CheckIcon size={12} color="#FFFFFF" />}
                            </View>
                            <Text style={styles.dayPillText}>{day}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                  {/* End Date */}
                  <View style={[styles.fieldGroup, { marginTop: 16 }]}>
                    <Text style={styles.label}>End Date</Text>
                    <TouchableOpacity
                      style={styles.pickerField}
                      onPress={() => {
                        setDatePickerTarget("endDate");
                        setShowDatePicker(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.pickerValue, !endDateFormatted && styles.placeholderText]}>
                        {endDateFormatted || "30 Apr 2026"}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#64748B" />
                    </TouchableOpacity>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[styles.continueBtn, !isStep2Valid && styles.continueBtnDisabled]}
                    disabled={!isStep2Valid}
                    onPress={handleFinalSubmit}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.continueBtnText, !isStep2Valid && styles.continueBtnTextDisabled]}>
                      Continue
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Picker Sub-Modal */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelectDate={handleDateSelect}
      />

      {/* Time Picker Sub-Modal */}
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onSelectTime={(t) => setTime(t)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  cancelText: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: "#64748B",
  },
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
    // backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: "DM Sans",
    color: "#0F172A",
  },
  pickerField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "#F8FAFC",
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
    backgroundColor: "#F1F5F9",
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
  freqCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  freqCardSelected: {
    borderColor: "#375DFB",
    backgroundColor: "#EFF6FF",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: "#375DFB",
    borderColor: "#375DFB",
  },
  freqText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 12,
  },
  dayPill: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dayPillSelected: {
    borderColor: "#375DFB",
    backgroundColor: "#EFF6FF",
  },
  dayPillText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
  },
});
