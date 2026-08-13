import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useSetCustomAvailabilityMutation,
  useSetDailyAvailabilityMutation,
  useSetOneOffAvailabilityMutation,
} from "@/hooks/useDriverTrips";
import {
  useAllVehicleModelsQuery,
  useVehicleBrandsQuery,
  useVehicleColorsQuery,
  useVehiclesQuery,
} from "@/hooks/useVehicles";
import { spacing } from "@/theme/colors";
import { DatePickerModal } from "./DatePickerModal";
import { TimePickerModal } from "./TimePickerModal";
import { SeatsPickerSheet } from "./availability/SeatsPickerSheet";
import {
  FormattedVehicleOption,
  Step1RouteTimeForm,
} from "./availability/Step1RouteTimeForm";
import { Step2RecurringForm } from "./availability/Step2RecurringForm";
import { Step3SeatsPriceForm } from "./availability/Step3SeatsPriceForm";
import { Step4ReviewSchedule } from "./availability/Step4ReviewSchedule";

interface SetAvailabilityModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (tripData: any) => void;
}

const formatDateToApi = (dateObj: Date | null, dateStr: string): string => {
  if (dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  // Fallback parsing dateStr e.g. "30 Mar 2026"
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const dd = String(parsed.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return dateStr;
};

const formatTimeToApi = (timeStr: string): string => {
  // Converts e.g. "6:00 AM" or "06:00 AM" or "6:00PM" -> "06:00:00" / "18:00:00"
  if (!timeStr) return "06:00:00";
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return timeStr.includes(":") ? `${timeStr}:00` : `${timeStr}:00:00`;

  let hours = parseInt(match[1], 10);
  const minutes = match[2].padStart(2, "0");
  const modifier = match[3] ? match[3].toUpperCase() : null;

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const hh = String(hours).padStart(2, "0");
  return `${hh}:${minutes}:00`;
};

export const SetAvailabilityModal: React.FC<SetAvailabilityModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const insets = useSafeAreaInsets();

  // Vehicle data queries
  const { data: serverVehicles, isLoading: isLoadingVehicles } = useVehiclesQuery();
  const { data: brandsData } = useVehicleBrandsQuery();
  const { data: allModelsData } = useAllVehicleModelsQuery();
  const { data: colorsData } = useVehicleColorsQuery();

  // API mutations for trips
  const setOneOffMutation = useSetOneOffAvailabilityMutation();
  const setDailyMutation = useSetDailyAvailabilityMutation();
  const setCustomMutation = useSetCustomAvailabilityMutation();

  // Format vehicle options with resolved human readable names
  const vehicleOptions: FormattedVehicleOption[] = useMemo(() => {
    const rawVehicles = Array.isArray(serverVehicles)
      ? serverVehicles
      : (serverVehicles as any)?.results && Array.isArray((serverVehicles as any).results)
      ? (serverVehicles as any).results
      : [];

    if (rawVehicles.length === 0) return [];
    return rawVehicles.map((v: any) => {
      let makeName = "";
      if (v.brand && typeof v.brand === "object") {
        makeName = v.brand.name || v.brand.brand_name || "";
      } else if (v.brand !== undefined && v.brand !== null) {
        const foundBrand = brandsData?.find(
          (b) => String(b.id) === String(v.brand) || b.name?.toLowerCase() === String(v.brand).toLowerCase()
        );
        makeName = foundBrand ? foundBrand.name : String(v.brand);
      }

      let modelName = "";
      const rawModel = v.model ?? v.vehicle_model;
      if (rawModel && typeof rawModel === "object") {
        modelName = rawModel.name || rawModel.model_name || "";
      } else if (rawModel !== undefined && rawModel !== null) {
        const foundModel = allModelsData?.find(
          (m) => String(m.id) === String(rawModel) || m.name?.toLowerCase() === String(rawModel).toLowerCase()
        );
        modelName = foundModel ? foundModel.name : String(rawModel);
      }

      const vehicleTitle = [makeName, modelName, v.year ? String(v.year) : ""]
        .filter(Boolean)
        .join(" ");

      const label = v.plate_number
        ? `${vehicleTitle || "Vehicle"} (${v.plate_number})`
        : vehicleTitle || "Vehicle";

      return {
        id: String(v.id),
        label,
        plateNumber: v.plate_number || "",
        seats: String(v.number_of_seats || "4"),
      };
    });
  }, [serverVehicles, brandsData, allModelsData]);

  // Step state: 1 (Route/Time), 2 (Recurring), 3 (Seats/Price), 4 (Review Schedule)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
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

  // Auto-select vehicle and seats
  useEffect(() => {
    if (vehicleOptions.length > 0 && !selectedVehicleId) {
      const defaultVehicle = serverVehicles?.find((v: any) => v.is_default);
      if (defaultVehicle) {
        setSelectedVehicleId(String(defaultVehicle.id));
      } else {
        setSelectedVehicleId(vehicleOptions[0].id);
      }
    }
  }, [vehicleOptions, serverVehicles, selectedVehicleId]);

  // Sync availableSeats when selected vehicle changes if availableSeats is empty
  useEffect(() => {
    if (selectedVehicleId && !availableSeats) {
      const selectedV = vehicleOptions.find((v) => v.id === selectedVehicleId);
      if (selectedV?.seats) {
        setAvailableSeats(selectedV.seats);
      } else {
        setAvailableSeats("4");
      }
    }
  }, [selectedVehicleId, vehicleOptions, availableSeats]);

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
    setSelectedVehicleId("");
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
    if (!selectedVehicleId || !pickup.trim() || !destination.trim() || !time || !dateFormatted) return;
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
    if (!availableSeats) {
      setAvailableSeats(selectedVehicleObj?.seats || "4");
    }
    setStep(4);
  };

  const selectedVehicleObj = vehicleOptions.find((v) => v.id === selectedVehicleId);

  const handlePublish = async () => {
    if (publishStatus !== "idle") return;

    setPublishStatus("publishing");

    try {
      const cleanPrice = price.replace(/[^0-9.]/g, "");
      const seatsCount = parseInt(availableSeats, 10) || 1;
      const apiTripDate = formatDateToApi(rawDateObj, dateFormatted);
      const apiDepartureTime = formatTimeToApi(time);

      if (!isRecurring) {
        // One-off trip POST /drivers/trips/
        await setOneOffMutation.mutateAsync({
          vehicle: selectedVehicleId,
          pickup_location: pickup,
          destination,
          trip_date: apiTripDate,
          departure_time: apiDepartureTime,
          available_seats: seatsCount,
        });
      } else {
        // Recurring trip POST /drivers/trips/recurring/
        const apiEndDate = formatDateToApi(null, endDateFormatted);
        const freqKey = isCustomRange ? "custom" : (frequency ? (frequency.toLowerCase() as any) : "daily");

        if (isCustomRange) {
          const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          const daysIndices = selectedDays
            .map((day) => {
              // Map both "Thur" and "Thu" or other variations if any
              const normalized = day === "Thur" ? "Thu" : day;
              return WEEKDAYS.indexOf(normalized);
            })
            .filter((idx) => idx !== -1);

          await setCustomMutation.mutateAsync({
            vehicle: selectedVehicleId,
            pickup_location: pickup,
            destination,
            departure_time: apiDepartureTime,
            start_date: apiTripDate,
            end_date: apiEndDate,
            frequency: "custom",
            days_of_week: daysIndices,
            available_seats: seatsCount,
          });
        } else {
          await setDailyMutation.mutateAsync({
            vehicle: selectedVehicleId,
            pickup_location: pickup,
            destination,
            trip_date: apiTripDate,
            departure_time: apiDepartureTime,
            available_seats: seatsCount,
            start_date: apiTripDate,
            end_date: apiEndDate,
            frequency: freqKey === "daily" ? "daily" : (freqKey as any),
          });
        }
      }

      setPublishStatus("published");

      setTimeout(() => {
        onSubmit({
          vehicleId: selectedVehicleId,
          vehicle: selectedVehicleObj?.label,
          pickupLocation: pickup,
          destination,
          departureTime: time,
          date: dateFormatted,
          isRecurring,
          frequency: getFormattedFrequency(),
          customDays: isRecurring && isCustomRange ? selectedDays : undefined,
          endDate: isRecurring ? endDateFormatted : undefined,
          availableSeats: seatsCount,
          pricePerSeat: parseFloat(cleanPrice) || 0,
        });

        handleClose();
      }, 600);
    } catch (err) {
      console.error("Error publishing trip availability:", err);
      setPublishStatus("idle");
    }
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
    selectedVehicleId.length > 0 &&
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
    (availableSeats.trim().length > 0 || Boolean(selectedVehicleObj?.seats)) &&
    (price.trim().length === 0 || (!isNaN(Number(cleanPriceVal)) && Number(cleanPriceVal) >= 0));

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
                  selectedVehicleId={selectedVehicleId}
                  onChangeSelectedVehicle={setSelectedVehicleId}
                  vehicleOptions={vehicleOptions}
                  isLoadingVehicles={isLoadingVehicles}
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
                  vehicleLabel={selectedVehicleObj?.label}
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
