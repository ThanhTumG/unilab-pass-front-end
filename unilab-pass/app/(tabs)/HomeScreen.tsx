// Core
import { ImageBackground, StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import { barDataItem } from "react-native-gifted-charts";

// App
import CustomCard from "components/CustomCard";
import CustomBarChart from "components/CustomBarChart";

// Types
type Props = {};

// Weekly Record Data
const chartData: barDataItem[] = [
  { value: 15, spacing: 0 },
  { value: 15, frontColor: "#B27FFF", isSecondary: true },

  { value: 18, spacing: 0 },
  { value: 18, frontColor: "#B27FFF", isSecondary: true },

  { value: 5, spacing: 0 },
  { value: 5, frontColor: "#B27FFF", isSecondary: true },

  { value: 10, spacing: 0 },
  { value: 10, frontColor: "#B27FFF", isSecondary: true },

  { value: 2, spacing: 0 },
  { value: 2, frontColor: "#B27FFF", isSecondary: true },

  { value: 9, spacing: 0 },
  { value: 9, frontColor: "#B27FFF", isSecondary: true },

  { value: 18, spacing: 0 },
  { value: 18, frontColor: "#B27FFF", isSecondary: true },
];

// Component
const HomeScreen = (props: Props) => {
  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background-with-icon.png")}
      style={[styles.background]}
    >
      {/* Welcome */}
      <Text
        variant="titleLarge"
        style={{
          fontFamily: "Poppins-SemiBold",
          color: "#333",
          textAlignVertical: "center",
          marginLeft: 30,
          marginRight: "auto",
        }}
      >
        Hi, Admin
      </Text>

      {/* Card */}
      <View style={[styles.alignCenter, styles.cardContainer]}>
        <CustomCard
          title="15"
          content="TOTAL USERS"
          icon="account-multiple-outline"
          color1="#C299FF"
          color2="#8533FF"
        />
        <CustomCard
          title="112"
          content="WEEKLY ACCESSES"
          icon="door-closed"
          color1="#99C2FF"
          color2="#3385FF"
        />
      </View>

      {/* Chart */}
      <CustomBarChart data={chartData} />
    </ImageBackground>
  );
};

export default HomeScreen;

// Styles
const styles = StyleSheet.create({
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100,
  },
  cardContainer: {
    flexDirection: "row",
    gap: 17,
    paddingVertical: 20,
  },
});
