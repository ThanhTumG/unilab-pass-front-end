// Core
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { Calendar, DateData } from "react-native-calendars";
import dayjs from "dayjs";
import Animated from "react-native-reanimated";
import { IconButton, Text, TouchableRipple } from "react-native-paper";

// App
import HeaderCalendar from "./ui/HeaderCalendar";

// Types
type Props = {
  markedDates: MarkedDatesType;
  setMarkedDates: React.Dispatch<React.SetStateAction<MarkedDatesType>>;
  currentDate: string;
  setCurrentDate: React.Dispatch<React.SetStateAction<string>>;
  viewMode: "week" | "month";
  setViewMode: React.Dispatch<React.SetStateAction<"week" | "month">>;
  style?: StyleProp<ViewStyle>;
};

type MarkedDatesType =
  | {
      [date: string]: {
        selected: boolean;
        startingDay?: boolean;
        endingDay?: boolean;
        disableTouchEvent?: boolean;
        selectedDotColor?: string;
        color: string;
        textColor: string;
      };
    }
  | { month: string; year: string };

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

// Component
const CustomCalendar = ({
  markedDates,
  setMarkedDates,
  currentDate,
  setCurrentDate,
  viewMode,
  setViewMode,
  style,
}: Props) => {
  // States

  // Today
  const initialDate = new Date().toISOString().split("T")[0];

  // Mode
  const calendarMode = ["week", "month"];

  // Methods
  // Handle select week
  const handelSelectWeek = (dateString: string) => {
    const selectedDate = dayjs(dateString);
    const startOfWeek = selectedDate.startOf("week");
    const newMarkedDates: MarkedDatesType = {};

    for (let i = 0; i <= 6; i++) {
      const date = startOfWeek.add(i, "day").format("YYYY-MM-DD");
      newMarkedDates[date] = {
        startingDay: i == 0,
        endingDay: i == 6,
        color: "#99C2FF",
        textColor: "#333",
        selected: true,
        disableTouchEvent: true,
      };
    }

    setCurrentDate(dateString);
    setMarkedDates(newMarkedDates);
  };

  // Handle select month
  const handleSelectMonth = (index: number) => {
    const newDate = currentDate.split("-");
    newDate[1] = (index + 1).toString().padStart(2, "0");
    setCurrentDate(newDate.join("-"));
    setMarkedDates({
      month: (index + 1).toString(),
      year: currentDate.split("-")[0],
    });
  };

  // Handle scroll end animation
  const handleScrollEnd = (index: number) => {
    if (index == 1) setViewMode("month");
    else setViewMode("week");

    handleClearFilter();
  };

  // Handle clear all filter
  const handleClearFilter = () => {
    setCurrentDate(initialDate);
    setMarkedDates({});
  };

  // Template
  return (
    <View style={[styles.container, style]}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text
          variant="bodyLarge"
          style={[styles.title, { color: viewMode == "week" ? "#1B61B5" : "" }]}
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
                key={currentDate}
                current={currentDate}
                onDayPress={(day: DateData) => {
                  handelSelectWeek(day.dateString);
                }}
                markingType="period"
                markedDates={markedDates}
                headerStyle={styles.header}
                renderHeader={() => (
                  <HeaderCalendar
                    mode="week"
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
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
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                  />
                </View>

                {/* Month Grid */}
                <View key={currentDate} style={styles.grid}>
                  {months.map((month, index) => {
                    const isFocused =
                      (index + 1).toString() == markedDates.month &&
                      currentDate.split("-")[0] == markedDates.year;

                    return (
                      <TouchableRipple
                        rippleColor={"#E6F0FF"}
                        key={index}
                        style={[
                          styles.month,
                          {
                            backgroundColor: isFocused ? "#99C2FF" : "",
                          },
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

                      // </Button>
                    );
                  })}
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
};

export default CustomCalendar;

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
