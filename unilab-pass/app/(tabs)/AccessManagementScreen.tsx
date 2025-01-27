// Core
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React from "react";
import { Button, Icon, Text } from "react-native-paper";
import { DataTable } from "react-native-paper";
import Table from "components/Table";
import FilterAccess from "components/FilterAccess";

// Types
type Props = {};

// Component
const ManageAccessScreen = (props: Props) => {
  // States

  const [recordData] = React.useState([
    {
      id: 2115235,
      name: "Phạm Châu Thanh Tùng",
      type: "check in",
      time: "2024-12-23T08:00:00",
      status: "success",
    },
    {
      id: 2115236,
      name: "Trần Thị B",
      type: "check out",
      time: "2025-01-20T04:02:15",
      status: "success",
    },
    {
      id: 2115237,
      name: "Lê Văn C",
      type: "check in",
      time: "2025-01-21T16:02:15",
      status: "pending",
    },
    {
      id: 2115238,
      name: "Phạm Thị D",
      type: "check out",
      time: "2025-01-25T04:02:15",
      status: "success",
    },
    {
      id: 2115239,
      name: "Hoàng Văn E",
      type: "check in",
      time: "2025-01-25T04:02:15",
      status: "failed",
    },
    {
      id: 2115240,
      name: "Nguyễn Thị F",
      type: "check out",
      time: "2025-01-25T04:02:15",
      status: "success",
    },
    {
      id: 2115241,
      name: "Lý Văn G",
      type: "check in",
      time: "2025-01-25T04:02:15",
      status: "success",
    },
    {
      id: 2115242,
      name: "Đỗ Thị H",
      type: "check out",
      time: "2025-01-25T04:02:15",
      status: "pending",
    },
    {
      id: 2115243,
      name: "Võ Văn I",
      type: "check in",
      time: "2025-01-25T04:02:15",
      status: "success",
    },
    {
      id: 2115244,
      name: "Bùi Thị K",
      type: "check out",
      time: "2025-01-25T04:02:15",
      status: "failed",
    },
    {
      id: 2115245,
      name: "Phan Văn L",
      type: "check in",
      time: "2025-01-25T04:02:15",
      status: "success",
    },
    {
      id: 2115246,
      name: "Ngô Thị M",
      type: "check out",
      time: "2025-01-25T04:02:15",
      status: "success",
    },
    {
      id: 2115247,
      name: "Vũ Văn N",
      type: "check in",
      time: "2025-01-25T04:02:15",
      status: "pending",
    },
    {
      id: 2115248,
      name: "Dương Thị O",
      type: "check out",
      time: "2025-01-25T04:02:15",
      status: "success",
    },
    {
      id: 2115249,
      name: "Lâm Văn P",
      type: "check in",
      time: "2025-01-25T04:02:15",
      status: "success",
    },
  ]);

  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background-with-icon.png")}
      style={[styles.background]}
    >
      {/* <View style={[styles.titleContainer]}> */}
      {/* Title */}
      <Text variant="titleMedium" style={styles.title}>
        Access Management
      </Text>

      {/* Filter */}
      <View style={{ position: "absolute", top: 80, right: 20 }}>
        <FilterAccess />
      </View>
      {/* </View> */}

      {/* Table */}
      <Table
        data={recordData}
        columns={["id", "name", "time", "type", "status"]}
      />
    </ImageBackground>
  );
};

export default ManageAccessScreen;

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
  },
  titleContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    alignContent: "flex-start",
    marginLeft: 30,
    marginRight: 20,
    marginTop: 100,
    backgroundColor: "#333",
  },
  title: {
    marginLeft: 30,
    marginTop: 100,
    marginRight: "auto",
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    textAlignVertical: "center",
  },
});
