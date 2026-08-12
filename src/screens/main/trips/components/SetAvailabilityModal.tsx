import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "@/theme/colors";
import { DatePickerModal } from "./DatePickerModal";
import { TimePickerModal } from "./TimePickerModal";
import { SeatsPickerSheet } from "./availability/SeatsPickerSheet";
import { Step1RouteTimeForm } from "./availability/Step1RouteTimeForm";
import { Step2RecurringForm } from "./availability/Step2RecurringForm";
import { Step3SeatsPriceForm } from "./availability/Step3SeatsPriceForm";
import { Step4ReviewSchedule } from "./availability/Step4ReviewSchedule";

interface SetAvailabilityModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (tripData: any) => void;
}

export const SetAvailabilityModal: React.FC<SetAvailabilityModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const insets = useSafeAreaInsets();

  // Step state: 1 (Route/Time), 2 (Recurring), 3 (Seats/Price), 4 (Review Schedule)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [dateFormatted, setDateFormatted] = useState("");
  const [rawDateObj, setRawDateObj] = useState<Date | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);

  // Step 2 State
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Monthly" | "">("");
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [endDateFormatted, setEndDateFormatted] = useState("");

  // Step 3 State
  const [availableSeats, setAvailableSeats] = useState("");
  const [price, setPrice] = useState("");
  const [showSeatsPicker, setShowSeatsPicker] = useState(false);

  // Step 4 Publish State
  const [publishStatus, setPublishStatus] = useState<"idle" | "publishing" | "published">("idle");

  // Picker Sub-Modals Visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<"startDate" | "endDate">("startDate");
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Validation
  const [dateValidationError, setDateValidationError] = useState<string | null>(null);

  // Reset all state on close
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
    setAvailableSeats("");
    setPrice("");
    setShowSeatsPicker(false);
    setPublishStatus("idle");
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
    if (!pickup.trim() || !destination.trim() || !time || !dateFormatted) return;
    if (rawDateObj && !validateDateAdvance(rawDateObj)) return;

    if (isRecurring) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleStep2Continue = () => {
    if (!isStep2Valid) return;
    setStep(3);
  };

  const handleStep3Continue = () => {
    if (!isStep3Valid) return;
    setStep(4);
  };

  const handlePublish = () => {
    if (publishStatus !== "idle") return;

    setPublishStatus("publishing");

    setTimeout(() => {
      setPublishStatus("published");

      setTimeout(() => {
        const cleanPrice = price.replace(/[^0-9.]/g, "");

        onSubmit({
          pickupLocation: pickup,
          destination,
          departureTime: time,
          date: dateFormatted,
          isRecurring,
          frequency: getFormattedFrequency(),
          customDays: isRecurring && isCustomRange ? selectedDays : undefined,
          endDate: isRecurring ? endDateFormatted : undefined,
          availableSeats: parseInt(availableSeats, 10) || 1,
          pricePerSeat: parseFloat(cleanPrice) || 0,
        });

        handleClose();
      }, 800);
    }, 1000);
  };

  const handleBackPress = () => {
    if (step === 4) {
      setStep(3);
    } else if (step === 3) {
      setStep(isRecurring ? 2 : 1);
    } else if (step === 2) {
      setStep(1);
    }
  };

  // Step Validation checks
  const isStep1Valid =
    pickup.trim().length > 0 &&
    destination.trim().length > 0 &&
    time.length > 0 &&
    dateFormatted.length > 0 &&
    !dateValidationError;

  const isStep2Valid =
    !isRecurring ||
    ((frequency.length > 0 || (isCustomRange && selectedDays.length > 0)) &&
      endDateFormatted.length > 0);

  const cleanPriceVal = price.replace(/[^0-9.]/g, "");
  const isStep3Valid =
    availableSeats.trim().length > 0 &&
    price.trim().length > 0 &&
    !isNaN(Number(cleanPriceVal)) &&
    Number(cleanPriceVal) >= 0;

  const getFormattedFrequency = () => {
    if (!isRecurring) return "Single Trip";
    if (isCustomRange && selectedDays.length > 0) {
      const daysStr = selectedDays.join(", ");
      return frequency ? `${daysStr} • ${frequency}` : `${daysStr} • Weekly`;
    }
    return frequency || "Weekly";
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                {step > 1 && (
                  <TouchableOpacity onPress={handleBackPress} style={{ marginRight: 10 }}>
                    <Ionicons name="arrow-back" size={20} color="#0F172A" />
                  </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>
                  {step === 4 ? "Review Schedule" : "Set Availability"}
                </Text>
              </View>

              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 520 }}>
              {step === 1 && (
                <Step1RouteTimeForm
                  pickup={pickup}
                  onChangePickup={setPickup}
                  destination={destination}
                  onChangeDestination={setDestination}
                  time={time}
                  onOpenTimePicker={() => setShowTimePicker(true)}
                  dateFormatted={dateFormatted}
                  onOpenDatePicker={() => {
                    setDatePickerTarget("startDate");
                    setShowDatePicker(true);
                  }}
                  dateValidationError={dateValidationError}
                  isRecurring={isRecurring}
                  onChangeIsRecurring={setIsRecurring}
                  isValid={isStep1Valid}
                  onContinue={handleStep1Continue}
                />
              )}

              {step === 2 && (
                <Step2RecurringForm
                  frequency={frequency}
                  onSelectFrequency={(freq) => {
                    setFrequency(freq);
                    setIsCustomRange(false);
                  }}
                  isCustomRange={isCustomRange}
                  onToggleCustomRange={(val) => {
                    setIsCustomRange(val);
                    if (val) setFrequency("");
                  }}
                  selectedDays={selectedDays}
                  onToggleDaySelection={toggleDaySelection}
                  endDateFormatted={endDateFormatted}
                  onOpenEndDatePicker={() => {
                    setDatePickerTarget("endDate");
                    setShowDatePicker(true);
                  }}
                  isValid={isStep2Valid}
                  onContinue={handleStep2Continue}
                />
              )}

              {step === 3 && (
                <Step3SeatsPriceForm
                  availableSeats={availableSeats}
                  onOpenSeatsPicker={() => setShowSeatsPicker(true)}
                  price={price}
                  onChangePrice={setPrice}
                  isValid={isStep3Valid}
                  onContinue={handleStep3Continue}
                />
              )}

              {step === 4 && (
                <Step4ReviewSchedule
                  price={price}
                  pickup={pickup}
                  destination={destination}
                  time={time}
                  dateFormatted={dateFormatted}
                  frequency={getFormattedFrequency()}
                  isRecurring={isRecurring}
                  endDateFormatted={endDateFormatted}
                  availableSeats={availableSeats}
                  publishStatus={publishStatus}
                  onPublish={handlePublish}
                />
              )}
            </ScrollView>
          </View>

          {/* Inline Seats Picker Overlay */}
          <SeatsPickerSheet
            visible={showSeatsPicker}
            onClose={() => setShowSeatsPicker(false)}
            selectedSeat={availableSeats}
            onSelectSeat={(seatNum) => {
              setAvailableSeats(seatNum);
              setShowSeatsPicker(false);
            }}
            insetsBottom={insets.bottom}
          />
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
});
