// Core
import { StyleSheet, View } from "react-native";
import React from "react";
import { Card, Text } from "react-native-paper";
import dayjs from "dayjs";

// Types
type Props = {
  item: {
    name: string;
    id: string;
    status: string;
    time: string;
    type: "check in" | "check out";
  };
  isEven: boolean;
};

// Component
const Record = ({ item, isEven }: Props) => {
  // Template
  return (
    <Card
      style={{
        borderRadius: 0,
      }}
    >
      <Card.Content
        style={{
          backgroundColor: isEven ? "rgba(230, 240, 255, 0.35)" : "#fff",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 25,
        }}
      >
        <View style={{ gap: 2 }}>
          <Text variant="bodyMedium" style={styles.name}>
            {item.name}
          </Text>
          <Text variant="bodySmall" style={styles.id}>
            {item.id}
          </Text>
          <Text variant="bodySmall" style={styles.time}>
            {dayjs(String(item.time), "hh:mm A DD/MM/YYYY").format(
              "DD/MM/YY HH:mm"
            )}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            borderWidth: 1.3,
            width: 87,
            height: 33,
            alignSelf: "center",
            backgroundColor: `${
              item.status == "success"
                ? "rgba(204, 255, 204, .75)"
                : "rgba(255, 230, 230, .75)"
            }`,
            borderColor: `${item.status == "success" ? "#00CC00" : "#FF0000"}`,
          }}
        >
          <Text
            variant="bodySmall"
            style={{
              color: `${item.status == "success" ? "#00CC00" : "#FF0000"}`,
              textTransform: "capitalize",
              fontFamily: "Poppins-Regular",
            }}
          >
            {item.type}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default Record;

const styles = StyleSheet.create({
  name: {
    fontFamily: "Poppins-Medium",
    color: "#333",
  },
  id: {
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  time: {
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  status: {
    fontFamily: "Poppins-Medium",
    color: "#333",
  },
});
