// Core
import React from "react";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";

// Types
type Props = {
  item: {
    fullName: string;
    id: string;
    status: string;
    lastRecord: string;
  };
  onPress?: (id: string) => any;
  isEven: boolean;
};

// Component
const MemberCard = ({ item, isEven, onPress }: Props) => {
  // Template
  return (
    <Card
      style={{
        borderRadius: 0,
      }}
      onPress={() => {
        onPress && onPress(item.id);
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
            {item.fullName}
          </Text>
          <Text variant="bodySmall" style={styles.id}>
            {item.id}
          </Text>
          <Text variant="bodySmall" style={styles.time}>
            {`Last record: ${
              item.lastRecord
                ? dayjs(String(item.lastRecord), "hh:mm A DD/MM/YYYY").format(
                    "DD/MM/YY HH:mm"
                  )
                : "Not found"
            }`}
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
              item.status == "ACTIVE"
                ? "rgba(204, 255, 204, .75)"
                : "rgba(255, 230, 230, .75)"
            }`,
            borderColor: `${item.status == "ACTIVE" ? "#00CC00" : "#FF0000"}`,
          }}
        >
          <Text
            variant="bodySmall"
            style={{
              color: `${item.status == "ACTIVE" ? "#00CC00" : "#FF0000"}`,
              textTransform: "capitalize",
              fontFamily: "Poppins-Regular",
            }}
          >
            {item.status}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default MemberCard;

// Styles
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
