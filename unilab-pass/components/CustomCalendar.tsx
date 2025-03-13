// Core
import dayjs from "dayjs";
import Animated from "react-native-reanimated";
import { Calendar, DateData } from "react-native-calendars";
import React, { useCallback, useMemo, useState } from "react";
import { IconButton, Text, TouchableRipple } from "react-native-paper";
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
  markedDates: string[];
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

// Mode
const calendarMode = ["week", "month"];

// Component
const CustomCalendar = React.memo(
  ({ markedDates, setMarkedDates, viewMode, setViewMode, style }: Props) => {
    // States
    const [markedWeek, setMarkedWeek] = useState({});

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
          markedDates: newMarkedDates,
        });
      },
      [setMarkedDates]
    );

    // Handle select month
    const handleSelectMonth = useCallback(
      (index: number) => {
        const newDate = markedDates.currentDate.split("-");
        newDate[1] = (index + 1).toString().padStart(2, "0");
        setMarkedDates({
          currentDate: newDate.join("-"),
          markedDates: [
            (index + 1).toString(),
            markedDates.currentDate.split("-")[0],
          ],
        });
      },
      [setMarkedDates, markedDates]
    );

    // Handle scroll end animation
    const handleScrollEnd = (index: number) => {
      if (index == 1) setViewMode("month");
      else setViewMode("week");
      handleClearFilter();
    };

    // Handle clear all filter
    const handleClearFilter = useCallback(() => {
      setMarkedDates({
        currentDate: initialDate,
        markedDates: [],
      });
    }, [setMarkedDates, initialDate]);

    // Memoized month grid
    const monthGrid = useMemo(
      () =>
        months.map((month, index) => {
          const isFocused =
            (index + 1).toString() === markedDates.markedDates[0] &&
            markedDates.currentDate.split("-")[0] ===
              markedDates.markedDates[1];
          return (
            <TouchableRipple
              rippleColor={"#E6F0FF"}
              key={index}
              style={[
                styles.month,
                { backgroundColor: isFocused ? "#99C2FF" : "" },
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
      [markedDates]
    );

    // Template
    return (
      <View style={[styles.container, style]}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text
            variant="bodyLarge"
            style={[
              styles.title,
              { color: viewMode == "week" ? "#1B61B5" : "" },
            ]}
          >
            Week
          </Text>
          <Text
            variant="bodyLarge"
            style={[
              styles.title,
              { color: viewMode == "month" ? "#1B61B5" : "" },
            ]}
          >
            Month
          </Text>
        </View>

        {/* Calendar Render*/}
        <Animated.FlatList
          data={calendarMode}
          renderItem={() => (
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
                        setMarkedDates({
                          currentDate: date,
                          markedDates: [],
                        })
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
                        setMarkedDates({
                          currentDate: date,
                          markedDates: [],
                        })
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
          )}
          onMomentumScrollEnd={(event) => {
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(
              contentOffsetX / event.nativeEvent.layoutMeasurement.width
            );
            handleScrollEnd(index);
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
        />

        {/* Clear filter button */}
        <IconButton
          mode="outlined"
          size={14}
          icon={"filter-remove-outline"}
          style={styles.clearButton}
          disabled={Object.keys(markedDates).length == 0}
          onPress={handleClearFilter}
        />
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
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#999",
  },
  title: {
    width: 60,
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
