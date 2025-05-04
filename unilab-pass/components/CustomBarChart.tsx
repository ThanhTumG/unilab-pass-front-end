// Core
import React from "react";
import { Button, Surface, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { useRouter } from "expo-router";

// Types
type Props = {
  data: barDataItem[];
};

// Component
const CustomBarChart = ({ data }: Props) => {
  // Router
  const router = useRouter();

  // Methods
  // Handle view all log
  const handleViewAllLog = () => {
    router.navigate("/AccessManagementScreen");
  };

  // Template
  return (
    <Surface style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="titleMedium" style={styles.title}>
          Weekly Activity
        </Text>
        <Button onPress={handleViewAllLog} labelStyle={styles.btnLabel}>
          See all
        </Button>
      </View>
      <BarChart
        data={data}
        barBorderTopLeftRadius={6}
        barBorderTopRightRadius={6}
        noOfSections={5}
        stepValue={5}
        xAxisLabelTexts={[
          " M",
          "O",
          " T",
          "U ",
          " W",
          "E ",
          " T",
          "H ",
          " F",
          "R ",
          " S",
          "A ",
          " S",
          "U ",
        ]}
        yAxisLabelTexts={["0", "5", "10", "15", "20"]}
        xAxisLabelTextStyle={styles.xAxisLabel}
        yAxisTextStyle={styles.yAxisLabel}
        maxValue={20}
        secondaryYAxis={{
          maxValue: 20,
          noOfSections: 5,
          hideYAxisText: true,
          yAxisThickness: 0,
        }}
        frontColor={"#5A9CFF"}
        barWidth={15}
        spacing={8}
        isAnimated
        animationDuration={700}
      />

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#5A9CFF" }]} />
          <Text variant="bodySmall" style={styles.legendLabel}>
            In
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#B27FFF" }]} />
          <Text variant="bodySmall" style={styles.legendLabel}>
            Out
          </Text>
        </View>
      </View>
    </Surface>
  );
};

export default CustomBarChart;

// Styles
const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  btnLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 5,
    marginBottom: 13,
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
  xAxisLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  yAxisLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    marginRight: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendLabel: {
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
});
