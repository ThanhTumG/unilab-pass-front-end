// Core
import dayjs from "dayjs";
import React, { memo } from "react";
import { IconButton, Text } from "react-native-paper";
import { Dimensions, StyleSheet, View } from "react-native";

// Types
type Props = {
  mode: "week" | "month";
  currentDate: string;
  setCurrentDate: (date: string) => void;
};

// Screen Dimension
const { width } = Dimensions.get("window");

// Component
const HeaderCalendar = memo(({ mode, currentDate, setCurrentDate }: Props) => {
  // Methods
  // Handle press navigation button
  const handleMonthChange = (direction: "prev" | "next") => {
    var newDate;
    if (direction === "prev") {
      newDate = dayjs(currentDate).subtract(
        1,
        mode == "week" ? "month" : "year"
      );
    } else {
      newDate = dayjs(currentDate).add(1, mode == "week" ? "month" : "year");
    }
    setCurrentDate(newDate?.toISOString().split("T")[0]);
  };

  const month = currentDate.split("-")[1];
  const year = currentDate.split("-")[0];

  // Template
  return (
    <View style={styles.header}>
      <IconButton
        mode="contained"
        size={28}
        icon={"menu-left"}
        containerColor="transparent"
        rippleColor="rgba(204, 224, 255, 0.35)"
        iconColor="#3385FF"
        onPress={() => handleMonthChange("prev")}
      />
      <Text variant="bodyMedium" style={styles.day}>
        {mode == "week" ? `${month}/${year}` : year}
      </Text>
      <IconButton
        mode="contained"
        size={28}
        icon={"menu-right"}
        containerColor="transparent"
        rippleColor="rgba(204, 224, 255, 0.35)"
        iconColor="#3385FF"
        onPress={() => handleMonthChange("next")}
      />
    </View>
  );
});

export default HeaderCalendar;

// Styles
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    minWidth: 0.85 * width,
  },
  day: {
    fontFamily: "Poppins-Regular",
  },
});
