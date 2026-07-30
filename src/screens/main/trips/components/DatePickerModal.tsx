import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppBottomSheet } from "../../../../components/ui";
import { colors, palette } from "../../../../theme/colors";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (formattedDate: string, rawDate: Date) => void;
  initialDate?: Date;
}

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
];

const WEEKDAYS = ["MON", "TUE", "WED", "THUR", "FRI", "SAT", "SUN"];

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelectDate,
  initialDate,
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(initialDate ? initialDate.getFullYear() : today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate ? initialDate.getMonth() : today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(
    initialDate ? initialDate.getDate() : today.getDate()
  );

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get weekday offset (0 = Mon, 6 = Sun)
  const getFirstDayOfWeek = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay(); // 0 = Sun
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfWeek = getFirstDayOfWeek(currentMonth, currentYear);

  // Previous month trailing days
  const prevMonthDays = getDaysInMonth(
    currentMonth === 0 ? 11 : currentMonth - 1,
    currentMonth === 0 ? currentYear - 1 : currentYear
  );

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleNextYear = () => {
    setCurrentYear((y) => y + 1);
  };

  const handleClear = () => {
    setSelectedDay(null);
  };

  const handleContinue = () => {
    if (selectedDay !== null) {
      const selected = new Date(currentYear, currentMonth, selectedDay);
      const dayStr = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
      const monthName = MONTH_NAMES[currentMonth];
      const yearStr = currentYear;
      const formatted = `${dayStr} ${monthName.charAt(0) + monthName.slice(1).toLowerCase()} ${yearStr}`;
      onSelectDate(formatted, selected);
    }
    onClose();
  };

  // Build grid items
  const calendarCells = [];

  // Previous month offset cells
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
    });
  }

  // Current month cells
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: true,
    });
  }

  // Fill remaining cells for 6 full rows (42 cells total)
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: false,
    });
  }

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title="Select Date"
      maxHeight="85%"
    >
      <View style={styles.contentContainer}>
        {/* Month / Year Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.dropdownPill} onPress={handleNextMonth} activeOpacity={0.7}>
            <Text style={styles.dropdownText}>{MONTH_NAMES[currentMonth]}</Text>
            <Ionicons name="chevron-forward" size={14} color={palette.slate[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.dropdownPill} onPress={handleNextYear} activeOpacity={0.7}>
            <Text style={styles.dropdownText}>{currentYear}</Text>
            <Ionicons name="chevron-forward" size={14} color={palette.slate[400]} />
          </TouchableOpacity>
        </View>

        {/* Weekday headers */}
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((wd) => (
            <Text key={wd} style={styles.weekdayText}>
              {wd}
            </Text>
          ))}
        </View>

        {/* Days Grid */}
        <View style={styles.gridContainer}>
          {calendarCells.map((cell, index) => {
            const isSelected = cell.isCurrentMonth && cell.day === selectedDay;
            const isToday =
              cell.isCurrentMonth &&
              cell.day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  isSelected && styles.dayCellSelected,
                ]}
                disabled={!cell.isCurrentMonth}
                onPress={() => setSelectedDay(cell.day)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    !cell.isCurrentMonth && styles.dayTextDisabled,
                    isSelected && styles.dayTextSelected,
                    isToday && !isSelected && styles.dayTextToday,
                  ]}
                >
                  {cell.day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear} activeOpacity={0.7}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.continueBtn, selectedDay === null && styles.disabledBtn]}
            disabled={selectedDay === null}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={[styles.continueBtnText, selectedDay === null && styles.disabledBtnText]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 12,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  dropdownPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: palette.slate[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  dropdownText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
    color: palette.slate[600],
  },
  weekdayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  weekdayText: {
    width: 40,
    textAlign: "center",
    fontFamily: "DM Sans",
    fontSize: 11,
    fontWeight: "500",
    color: colors.grey,
    letterSpacing: 0.3,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dayCell: {
    width: 44.43,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontFamily: "DM Sans",
    fontSize: 15,
    fontWeight: "500",
    color: colors.dark,
  },
  dayTextDisabled: {
    color: palette.slate[300],
  },
  dayTextToday: {
    fontFamily: "DM Sans Bold",
    fontWeight: "700",
    color: colors.primary,
  },
  dayTextSelected: {
    fontFamily: "DM Sans Bold",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  clearBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: colors.background,
  },
  clearBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "500",
    color: colors.grey,
  },
  continueBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  disabledBtn: {
    backgroundColor: colors.primaryDisabled,
  },
  disabledBtnText: {
    color: palette.slate[400],
  },
});


