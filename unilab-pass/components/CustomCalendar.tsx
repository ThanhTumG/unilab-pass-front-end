// Core
import dayjs from "dayjs";
import { Calendar, DateData } from "react-native-calendars";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Text, TouchableRipple } from "react-native-paper";
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

// App
import HeaderCalendar from "./ui/HeaderCalendar";

// Types
type Props = {
  markedDates: MarkedDatesType;
  setMarkedDates: React.Dispatch<React.SetStateAction<MarkedDatesType>>;
  viewMode: "week" | "month";
  setViewMode: React.Dispatch<React.SetStateAction<"week" | "month">>;
  style?: StyleProp<ViewStyle>;
};
type MarkedDatesType = {
  currentDate: string;
  markedDates: {
    startDate?: string;
    endDate?: string;
  };
  mode: "week" | "month";
};

type MarkedWeekType = {
  [date: string]: {
    selected: boolean;
    startingDay?: boolean;
    endingDay?: boolean;
    disableTouchEvent?: boolean;
    selectedDotColor?: string;
    color: string;
    textColor: string;
  };
};

type MarkedMonthType = {
  month: number;
  year: number;
};

// Screen Dimension
const { width } = Dimensions.get("window");

// Months
const months = [
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

// Today
const initialDate = new Date().toISOString().split("T")[0];

// Component
const CustomCalendar = React.memo(
  ({ markedDates, setMarkedDates, viewMode, setViewMode, style }: Props) => {
    // States
    const [markedWeek, setMarkedWeek] = useState({});
    const [markedMonth, setMarkedMonth] = useState<
      MarkedMonthType | undefined
    >();

    // Methods
    // Handle select week
    const handelSelectWeek = useCallback(
      (dateString: string) => {
        const selectedDate = dayjs(dateString);
        const startOfWeek = selectedDate.startOf("week");
        const newMarkedWeek: MarkedWeekType = {};

        const newMarkedDates = Array.from({ length: 7 }, (_, i) => i).map(
          (i) => {
            const date = startOfWeek.add(i, "day").format("YYYY-MM-DD");
            newMarkedWeek[date] = {
              startingDay: i == 0,
              endingDay: i == 6,
              color: "#99C2FF",
              textColor: "#333",
              selected: true,
              disableTouchEvent: true,
            };
            return date;
          }
        );
        setMarkedWeek(newMarkedWeek);
        setMarkedDates({
          currentDate: dateString,
          markedDates: {
            startDate: newMarkedDates[0],
            endDate: newMarkedDates[6],
          },
          mode: "week",
        });
      },
      [setMarkedDates, markedDates]
    );

    // Handle select month
    const handleSelectMonth = useCallback(
      (index: number) => {
        const year = dayjs(markedDates.currentDate).year();
        const date = dayjs(`${year}-${index + 1}-01`);
        const startDate = date.startOf("month").format("YYYY-MM-DD");

        const endDate = date.endOf("month").format("YYYY-MM-DD");

        setMarkedMonth({ month: date.month() + 1, year: date.year() });
        setMarkedDates({
          currentDate: markedDates.currentDate,
          markedDates: {
            startDate: startDate,
            endDate: endDate,
          },
          mode: "month",
        });
        setMarkedWeek({});
      },
      [setMarkedDates, markedDates]
    );

    // Memo
    // Memoized month grid
    const monthGrid = useMemo(
      () =>
        months.map((month, index) => {
          const isFocused =
            markedDates.mode == "month" &&
            index + 1 === markedMonth?.month &&
            markedDates.currentDate.split("-")[0] ===
              markedMonth.year.toString();
          return (
            <TouchableRipple
              rippleColor={"#E6F0FF"}
              key={index}
              style={[
                styles.month,
                { backgroundColor: isFocused ? "#99C2FF" : "#fff" },
              ]}
              onPress={() => handleSelectMonth(index)}
            >
              <Text
                variant="bodyMedium"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                {month}
              </Text>
            </TouchableRipple>
          );
        }),
      [markedMonth, markedDates, handleSelectMonth]
    );

    // Effects
    useEffect(() => {
      if (
        !markedDates.markedDates.startDate ||
        !markedDates.markedDates.endDate
      )
        return;

      if (markedDates.mode == "week") {
        const selectedDate = dayjs(markedDates.markedDates.startDate);
        const startOfWeek = selectedDate.startOf("week");
        const newMarkedWeek: MarkedWeekType = {};

        Array.from({ length: 7 }, (_, i) => i).forEach((i) => {
          const date = startOfWeek.add(i, "day").format("YYYY-MM-DD");
          newMarkedWeek[date] = {
            startingDay: date == startOfWeek.format("YYYY-MM-DD"),
            endingDay: date == startOfWeek.add(6, "day").format("YYYY-MM-DD"),
            color: "#99C2FF",
            textColor: "#333",
            selected: true,
            disableTouchEvent: true,
          };
          return date;
        });
        setMarkedWeek(newMarkedWeek);
      } else {
        const selectedDate = dayjs(markedDates.markedDates.startDate);
        const month = selectedDate.month() + 1;
        const year = selectedDate.year();
        setMarkedMonth({ month, year });
      }
    }, []);

    // Template
    return (
      <View style={[styles.container, style]}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Button
            labelStyle={[
              styles.title,
              { color: viewMode == "week" ? "#1B61B5" : "" },
            ]}
            onPress={() => setViewMode("week")}
          >
            Week
          </Button>
          <Button
            labelStyle={[
              styles.title,
              { color: viewMode == "month" ? "#1B61B5" : "" },
            ]}
            onPress={() => setViewMode("month")}
          >
            Month
          </Button>
        </View>

        {/* Calendar Render*/}
        <View>
          {/* Calendar View */}
          {viewMode == "week" ? (
            // Week mode
            <Calendar
              style={styles.calendar}
              key={markedDates.currentDate}
              current={markedDates.currentDate}
              onDayPress={(day: DateData) => {
                handelSelectWeek(day.dateString);
              }}
              markingType="period"
              markedDates={markedWeek}
              headerStyle={styles.header}
              renderHeader={() => (
                <HeaderCalendar
                  mode="week"
                  currentDate={markedDates.currentDate}
                  setCurrentDate={(date) =>
                    setMarkedDates((prev) => ({
                      ...prev,
                      currentDate: date,
                    }))
                  }
                />
              )}
              hideArrows
              disableAllTouchEventsForDisabledDays
            />
          ) : (
            // Month mode
            <View style={styles.calendar}>
              <View
                style={{
                  alignSelf: "stretch",
                  backgroundColor: "rgba(204, 224, 255, 0.35)",
                  paddingTop: 6,
                }}
              >
                <HeaderCalendar
                  mode="month"
                  currentDate={markedDates.currentDate}
                  setCurrentDate={(date) =>
                    setMarkedDates((prev) => ({
                      ...prev,
                      currentDate: date,
                    }))
                  }
                />
              </View>

              {/* Month Grid */}
              <View key={markedDates.currentDate} style={styles.grid}>
                {monthGrid}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
);

export default CustomCalendar;

// Styles
const styles = StyleSheet.create({
  container: {
    width: 0.922 * width,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 7,
    paddingBottom: 9,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "stretch",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#999",
  },
  title: {
    fontSize: 16,
    width: 100,
    textAlign: "center",
    marginHorizontal: "auto",
    fontFamily: "Poppins-Regular",
  },
  calendar: {
    width: 0.922 * width,
    height: 350,
  },
  clearButton: {
    position: "absolute",
    top: -50,
    left: 5,
  },
  header: {
    width: 0.922 * width,
    alignSelf: "center",
    backgroundColor: "rgba(204, 224, 255, 0.35)",
    marginBottom: 5,
  },
  grid: {
    height: 350,
    paddingVertical: 20,
    paddingHorizontal: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  month: {
    width: 104,
    height: 33,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#333",
  },
});
