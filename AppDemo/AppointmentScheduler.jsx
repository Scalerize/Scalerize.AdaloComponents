import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "@react-native-vector-icons/material-icons";

/**
 * Appointment Scheduler Component
 *
 * Renders:
 * 1. A simple monthly calendar (with month selector).
 * 2. Time slots for the selected date based on hour range and appointment duration.
 *
 * Reserved appointments are passed in `props.reservedAppointments` as an array of objects, each containing { dateTime: string }.
 * The `onSchedule` action is triggered whenever a valid time slot is selected.
 */
const AppointmentScheduler = (props) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const {
    hourRangeStart,
    hourRangeEnd,
    appointmentDuration,
    reservedAppointments,
  } = props;

  // ========== Calendar Computations ==========

  /**
   * Return number of days in the given month,
   * accounting for leap years if month = 1 (February).
   */
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  /**
   * Build an array [Sun, Mon, ... Sat] for each row in the month view.
   * We'll simply list out the days for a single row display, but you could
   * do multi-row if you want a typical grid view.
   */
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  // First day index (0 = Sunday, 1 = Monday, etc.).
  const firstDayOfMonth =
    (new Date(currentYear, currentMonth, 1).getDay() + 7 - 1) % 7;

  /**
   * Create an array that represents each date in the month
   * plus leading blank days for alignment (if you want a typical month grid).
   */
  const calendarArray = useMemo(() => {
    // Example: fill with null for days before the 1st, then actual day numbers
    const arr = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      arr.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push(d);
    }
    return arr;
  }, [daysInMonth, firstDayOfMonth]);

  // ========== Month Navigation ==========

  const goToPreviousMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const goToNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDay(null);
    setSelectedTime(null);
  };

  // ========== Day Selection ==========

  const onDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedTime(null);
  };

  const isToday = (year, month, day) => {
    const now = new Date();
    return (
      now.getFullYear() === year &&
      now.getMonth() === month &&
      now.getDate() === day
    );
  };

  // ========== Time Slot Computations ==========

  /**
   * Generate time slots for the selected day, from hourRangeStart to hourRangeEnd,
   * in increments of `appointmentDuration`.
   */
  const timeSlots = useMemo(() => {
    if (hourRangeEnd < hourRangeStart) return [];

    const slots = [];
    if(!selectedDay) return slots;

    let current = hourRangeStart * 60; // start in minutes from midnight
    const end = hourRangeEnd * 60;

    while (current + appointmentDuration <= end) {
      slots.push(current);
      current += appointmentDuration;
    }
    return slots;
  }, [hourRangeStart, hourRangeEnd, appointmentDuration, selectedDay]);

  /**
   * Convert minutes-from-midnight to a readable HH:mm (12-hour or 24-hour).
   * Example: 540 -> "9:00 AM".
   */
  const formatTime = (minutesFromMidnight) => {
    const hr24 = Math.floor(minutesFromMidnight / 60);
    const min = minutesFromMidnight % 60;
    const hr12 = hr24 % 12 || 12;
    const ampm = hr24 < 12 ? "AM" : "PM";
    const minString = min < 10 ? `0${min}` : min;
    return `${hr12}:${minString} ${ampm}`;
  };

  /**
   * Check if a time slot is already reserved.
   * We'll compare the year, month, day, hour, minute to each reserved appointment in props.
   */
  const isSlotReserved = (minutesFromMidnight) => {
    const year = currentYear;
    const month = currentMonth;
    const day = selectedDay;
    const hour = Math.floor(minutesFromMidnight / 60);
    const minute = minutesFromMidnight % 60;

    return reservedAppointments?.some((appt) => {
      if (!appt.dateTime) return false;
      const apptDate = new Date(appt.dateTime);
      return (
        apptDate.getFullYear() === year &&
        apptDate.getMonth() === month &&
        apptDate.getDate() === day &&
        apptDate.getHours() === hour &&
        apptDate.getMinutes() === minute
      );
    });
  };

  // ========== Time Slot Selection & Scheduling Action ==========

  const onTimeSlotPress = (minutesFromMidnight) => {
    // If slot is reserved, do nothing.
    if (isSlotReserved(minutesFromMidnight)) return;

    setSelectedTime(minutesFromMidnight);

    // Build a Date object for the final selection
    const scheduleDate = new Date(
      currentYear,
      currentMonth,
      selectedDay,
      Math.floor(minutesFromMidnight / 60),
      minutesFromMidnight % 60
    );

    // Trigger the Adalo action.
    // Often you might pass parameters to the action; here we simply call it.
    if (props.onSchedule) {
      props.onSchedule({
        scheduledDateTime: scheduleDate.toISOString(),
        // If your Adalo setup supports passing arguments,
        // you can pass more data here
      });
    }
  };

  // ========== Rendering Styles ==========

  const calendarSectionStyles = {
    backgroundColor:
      props.calendarSection?.calendarBackgroundColor ?? "#FFFFFF",
    borderRadius: 6,
    padding: 8,
  };

  const timeSectionStyles = {
    backgroundColor:
      props.timeSelectorSection?.timeSlotBackgroundColor ?? "#FFFFFF",
    gridTemplateColumns: "",
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  };

  // ========== Rendering ==========

  // Build month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <View style={styles.container}>
      <View style={calendarSectionStyles}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Icon name="chevron-left" color="#000000"></Icon>
          </TouchableOpacity>
          <Text style={styles.monthHeaderText}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Icon name="chevron-right" color="#000000"></Icon>
          </TouchableOpacity>
        </View>

        <View style={styles.daysRow}>
          {calendarArray.map((day, index) => {
            if (day === null) {
              // Blank space for alignment
              return <View key={`blank-${index}`} style={styles.dayCell} />;
            }

            const isTodayValue = isToday(currentYear, currentMonth, day);
            // Check if it's today
            const todayHighlight = isTodayValue
              ? props.calendarSection?.todayHighlightColor ?? "#FF5722"
              : null;
            // Check if it's selected
            const isSelected = day === selectedDay;
            const dayBackgroundColor = isSelected
              ? props.calendarSection?.daySelectedBackgroundColor ?? "#2196F3"
              : undefined;

            const textColor = isSelected
              ? props.calendarSection?.daySelectedTextColor ?? "#FFFFFF"
              : props.calendarSection?.dayTextColor ?? "#000000";

            return (
              <TouchableOpacity
                key={`day-${day}-${index}`}
                style={[
                  styles.dayCell,
                  {
                    backgroundColor: dayBackgroundColor,
                    borderRadius: props.calendarSection?.dayBorderRadius ?? 4,
                  },
                ]}
                onPress={() => onDaySelect(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: textColor,
                    },
                  ]}
                >
                  {day}
                </Text>
                <View
                  style={[
                    styles.todayIndicator,
                    {
                      backgroundColor: isTodayValue ? textColor : "transparent",
                    },
                  ]}
                ></View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={timeSectionStyles}>
        {timeSlots.map((slot) => {
          const reserved = isSlotReserved(slot);
          const isSelected = slot === selectedTime;

          // Dynamic style for selected or reserved time slot
          const backgroundColor = isSelected
            ? props.timeSelectorSection?.timeSlotSelectedBackgroundColor ??
              "#2196F3"
            : props.timeSelectorSection?.timeSlotBackgroundColor ?? "#FFFFFF";
          const textColor = isSelected
            ? props.timeSelectorSection?.timeSlotSelectedTextColor ?? "#FFFFFF"
            : props.timeSelectorSection?.timeSlotTextColor ?? "#000000";

          return (
            <TouchableOpacity
              key={`slot-${slot}`}
              style={[
                styles.timeSlotItem,
                {
                  backgroundColor: reserved ? "#ccc" : backgroundColor,
                  borderRadius:
                    props.timeSelectorSection?.timeSlotBorderRadius ?? 4,
                  opacity: reserved ? 0.5 : 1,
                },
              ]}
              disabled={reserved}
              onPress={() => onTimeSlotPress(slot)}
            >
              <Text style={[styles.timeSlotText, { color: textColor }]}>
                {formatTime(slot)}
                {reserved ? " (Reserved)" : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
        {timeSlots.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 6 }}>
            {selectedDay ? "No available time slots" : "Select a day"}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 10,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  monthHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%", // 7 columns
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
  },
  todayIndicator: {
    borderRadius: "50%",
    width: 4,
    height: 4,
    backgroundColor: "black",
  },
  timeSlotItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    width: "23%",
    padding: 8,
    justifyContent: "center",
  },
  timeSlotText: {
    fontSize: 14,
  },
});

export default AppointmentScheduler;
