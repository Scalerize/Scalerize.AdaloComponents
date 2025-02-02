import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "@react-native-vector-icons/material-icons";

const AppointmentScheduler = (props) => {
  const {
    hourRangeStart,
    hourRangeEnd,
    appointmentDuration,
    reservedAppointments = [],
    editor,
  } = props;

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(
    editor ? today.getDate() : null
  );
  const [selectedTime, setSelectedTime] = useState(null);

  // Calendar computations
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth =
    (new Date(currentYear, currentMonth, 1).getDay() + 7 - 1) % 7;

  const calendarArray = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDayOfMonth; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [daysInMonth, firstDayOfMonth]);

  // Month navigation
  const adjustMonth = (offset) => {
    let newDate = new Date(currentYear, currentMonth + offset);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
    setSelectedDay(null);
    setSelectedTime(null);
  };

  // Time slot generation with reserved appointments considered
  const timeSlots = useMemo(() => {
    if (!selectedDay || hourRangeEnd <= hourRangeStart) return [];

    // Get reserved slots for selected day
    const reservedSlots = reservedAppointments
      .map((appt) => {
        const apptDate = new Date(appt.dateTime);
        if (
          apptDate.getFullYear() !== currentYear ||
          apptDate.getMonth() !== currentMonth ||
          apptDate.getDate() !== selectedDay
        )
          return null;

        const start = apptDate.getHours() * 60 + apptDate.getMinutes();
        const duration = appt.duration || appointmentDuration;
        return { start, end: start + duration };
      })
      .filter(Boolean)
      .sort((a, b) => a.start - b.start);

    // Generate available intervals
    let availableIntervals = [[hourRangeStart * 60, hourRangeEnd * 60]];

    for (const { start: rs, end: re } of reservedSlots) {
      const newIntervals = [];
      for (const [start, end] of availableIntervals) {
        if (re <= start || rs >= end) {
          newIntervals.push([start, end]);
        } else if (rs <= start && re < end) {
          newIntervals.push([re, end]);
        } else if (rs > start && re < end) {
          newIntervals.push([start, rs], [re, end]);
        } else if (rs < end && re >= end) {
          newIntervals.push([start, rs]);
        }
      }
      availableIntervals = newIntervals;
    }

    // Generate time slots from available intervals
    const slots = [];
    for (const [start, end] of availableIntervals) {
      let current = start;
      while (current + appointmentDuration <= end) {
        slots.push(current);
        current += appointmentDuration;
      }
    }

    return slots;
  }, [
    hourRangeStart,
    hourRangeEnd,
    appointmentDuration,
    selectedDay,
    reservedAppointments,
    currentYear,
    currentMonth,
  ]);

  // Time formatting
  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hrs < 12 ? "AM" : "PM";
    const displayHrs = hrs % 12 || 12;
    return `${displayHrs}:${mins.toString().padStart(2, "0")} ${period}`;
  };

  // Handle time slot selection
  const handleTimeSelect = (minutes) => {
    const date = new Date(currentYear, currentMonth, selectedDay);
    date.setHours(Math.floor(minutes / 60), minutes % 60);

    setSelectedTime(minutes);
    props.selectedSlot?.onChange(date.toISOString());
    props.onSchedule?.(date.toISOString());
  };

  // Styles
  const calendarSectionStyles = {
    backgroundColor: props.calendarSection?.calendarBackgroundColor || "#fff",
    borderRadius: 6,
    padding: 8,
  };

  const timeSectionStyles = {
    backgroundColor:
      props.timeSelectorSection?.timeSlotBackgroundColor || "#fff",
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  };

  return (
    <View style={styles.container}>
      <View style={calendarSectionStyles}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => adjustMonth(-1)}>
            <Icon name="chevron-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.monthHeaderText}>
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentYear}
          </Text>
          <TouchableOpacity onPress={() => adjustMonth(1)}>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.daysRow}>
          {calendarArray.map((day, index) => (
            <DayCell
              key={day ?? `blank-${index}`}
              day={day}
              currentYear={currentYear}
              currentMonth={currentMonth}
              selectedDay={selectedDay}
              onSelect={setSelectedDay}
              styles={props.calendarSection}
            />
          ))}
        </View>
      </View>

      {/* Time Slots Section */}
      <View style={timeSectionStyles}>
        {timeSlots.map((slot, i) => (
          <TimeSlot
            key={slot}
            minutes={slot}
            isSelected={slot === selectedTime || (editor && i === 0)}
            onPress={handleTimeSelect}
            styles={props.timeSelectorSection}
            formatTime={formatTime}
          />
        ))}
        {timeSlots.length === 0 && (
          <Text style={styles.noSlotsText}>
            {selectedDay ? "No available slots" : "Select a day"}
          </Text>
        )}
      </View>
    </View>
  );
};

// Sub-components for better readability
const DayCell = ({
  day,
  currentYear,
  currentMonth,
  selectedDay,
  onSelect,
  styles,
}) => {
  if (!day) return <View style={cellStyles.dayCell} />;

  const isToday =
    new Date().getDate() === day &&
    new Date().getMonth() === currentMonth &&
    new Date().getFullYear() === currentYear;

  const isSelected = day === selectedDay;
  const foregroundColor = isSelected
    ? styles?.daySelectedTextColor || "#fff"
    : styles?.dayTextColor || "#000";
  return (
    <TouchableOpacity
      style={[
        cellStyles.dayCell,
        {
          backgroundColor: isSelected
            ? styles?.daySelectedBackgroundColor || "#2196F3"
            : undefined,
          borderRadius: styles?.dayBorderRadius || 4,
        },
      ]}
      onPress={() => onSelect(day)}
    >
      <View style={cellStyles.innerDayCellWrapper}>
        <View style={{ color: foregroundColor }}>{day}</View>
        <View
          style={[
            { backgroundColor: isToday ? foregroundColor : "transparent" },
            cellStyles.todayIndicator,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const TimeSlot = ({ minutes, isSelected, onPress, styles, formatTime }) => (
  <TouchableOpacity
    style={[
      cellStyles.timeSlot,
      {
        backgroundColor: isSelected
          ? styles?.timeSlotSelectedBackgroundColor || "#2196F3"
          : styles?.timeSlotBackgroundColor || "#fff",
        borderRadius: styles?.timeSlotBorderRadius || 4,
      },
    ]}
    onPress={() => onPress(minutes)}
  >
    <Text
      style={[cellStyles.timeSlotText, {
        color: isSelected
          ? styles?.timeSlotSelectedTextColor || "#fff"
          : styles?.timeSlotTextColor || "#000",
      }]}
    >
      {formatTime(minutes)}
    </Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: { padding: 16 },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthHeaderText: { fontWeight: "bold", fontSize: 18 },
  daysRow: { flexDirection: "row", flexWrap: "wrap" },
  noSlotsText: { width: "100%", textAlign: "center", marginTop: 8 },
});

const cellStyles = StyleSheet.create({
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
    paddingVertical: 4
  },
  innerDayCellWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  todayIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  timeSlot: {
    flexDirection: "row",
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4
  },
  timeSlotText: {
    fontSize: 12,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

export default AppointmentScheduler;
