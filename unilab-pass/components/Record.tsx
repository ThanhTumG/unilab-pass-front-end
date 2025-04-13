// Core
import React from "react";
import dayjs from "dayjs";
import { Card, Icon, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";

// App
import { LogRespond } from "api/index";
import { getFullName } from "lib/utils";

// Types
type Props = {
  item: LogRespond;
  isEven: boolean;
  onPress: () => any;
};

// IconUri
const iconMap = {
  CHECKIN: require("../assets/images/check-in.png"),
  CHECKOUT: require("../assets/images/check-out.png"),
  SUCCESS: require("../assets/images/checked.png"),
  ILLEGAL: require("../assets/images/block.png"),
  BLOCKED: require("../assets/images/block.png"),
  None: require("../assets/images/calendar.png"),
};

// Component
const Record = ({ item, isEven, onPress }: Props) => {
  // Color
  const color = item.status == "SUCCESS" ? "#44CC77" : "#FF0000";

  // Template
  return (
    <Card onPress={onPress}>
      <Card.Content
        style={[
          styles.content,
          { backgroundColor: isEven ? "rgba(230, 240, 255, 0.35)" : "#fff" },
        ]}
      >
        <View style={styles.recordInfoCont}>
          <Icon source={iconMap[item.recordType ?? "None"]} size={38} />
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
        </View>
        <View style={styles.statusCont}>
          <Icon source={iconMap[item.status ?? "None"]} size={28} />
          <Text variant="bodySmall" style={[styles.logStatus, { color }]}>
            {item.status}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default Record;

// Styles
const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
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
  recordInfoCont: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logStatus: {
    fontFamily: "Poppins-Regular",
    textTransform: "capitalize",
    textAlign: "center",
  },
  statusCont: {
    justifyContent: "center",
    alignItems: "center",
    width: 55,
    gap: 3,
  },
});
