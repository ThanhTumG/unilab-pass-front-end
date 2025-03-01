// Core
import { StyleSheet, View } from "react-native";
import React from "react";
import { Card, Text } from "react-native-paper";
import dayjs from "dayjs";

// App
import { LogRespond } from "api/index";
import { getFullName } from "lib/utils";

// Types
type Props = {
  item: LogRespond;

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
            {getFullName({
              firstName: item.userFirstName,
              lastName: item.userLastName,
            })}
          </Text>
          <Text variant="bodySmall">{item.userId}</Text>
          <Text variant="bodySmall" style={styles.time}>
            {dayjs(String(item.recordTime), "hh:mm A DD/MM/YYYY").format(
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
              item.status == "SUCCESS"
                ? "rgba(204, 255, 204, .75)"
                : "rgba(255, 230, 230, .75)"
            }`,
            borderColor: `${item.status == "SUCCESS" ? "#00CC00" : "#FF0000"}`,
          }}
        >
          <Text
            variant="bodySmall"
            style={{
              color: `${item.status == "SUCCESS" ? "#00CC00" : "#FF0000"}`,
              textTransform: "capitalize",
              fontFamily: "Poppins-Regular",
            }}
          >
            {item.recordType}
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
