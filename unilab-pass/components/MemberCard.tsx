// Core
import { StyleSheet, View } from "react-native";
import React from "react";
import { Card, Text } from "react-native-paper";
import dayjs from "dayjs";
import { useRouter } from "expo-router";

// Types
type Props = {
  item: {
    name: string;
    id: string;
    status: string;
    lastRecord: string;
  };
  isEven: boolean;
};

// Component
const MemberCard = ({ item, isEven }: Props) => {
  // Router
  const router = useRouter();

  // Template
  return (
    <Card
      style={{
        borderRadius: 0,
      }}
      onPress={() => router.replace(`/(stack)/detail/${item.id}`)}
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
            {dayjs(String("2025-01-21T16:02:15"), "hh:mm A DD/MM/YYYY").format(
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
              item.status == "active"
                ? "rgba(204, 255, 204, .75)"
                : "rgba(255, 230, 230, .75)"
            }`,
            borderColor: `${item.status == "active" ? "#00CC00" : "#FF0000"}`,
          }}
        >
          <Text
            variant="bodySmall"
            style={{
              color: `${item.status == "active" ? "#00CC00" : "#FF0000"}`,
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
