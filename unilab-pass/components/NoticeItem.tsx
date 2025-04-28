// Core
import { StyleSheet, View } from "react-native";
import React from "react";
import { Icon, IconButton, Surface, Text } from "react-native-paper";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import { ImageSourcePropType } from "react-native";

dayjs.extend(utc);
dayjs.extend(timezone);

// App
import { NotificationResponse } from "api/index";

// Types
type Props = {
  item: NotificationResponse;
  onPress: () => void;
};

// IconUri
const iconMap: { [key: string]: ImageSourcePropType } = {
  "Unauthorized access": require("../assets/images/security-alert.png"),
};

const defaultImage = require("../assets/images/photo.png");

// Component
const NoticeItem = ({ item, onPress }: Props) => {
  // Methods
  const getHoursSinceCreated = (created?: string) => {
    const createdTime = dayjs(created);
    const now = dayjs();
    const hoursDiff = now.diff(createdTime, "hour", true);
    return Math.round(hoursDiff);
  };

  // Template
  return (
    <Surface style={styles.container}>
      <Icon
        source={
          item.title && item.title in iconMap
            ? iconMap[item.title]
            : defaultImage
        }
        size={28}
      />
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text variant="bodySmall" style={styles.title}>
            {item.title} {`\u{2022}`}{" "}
            <Text style={styles.time}>
              {getHoursSinceCreated(item.createdAt)}
              {" hours ago"}
            </Text>
          </Text>

          {/* Action */}
          <IconButton
            containerColor="#fafafa"
            rippleColor={"#fafafa"}
            style={{
              height: 14,
            }}
            icon={"dots-horizontal"}
            size={22}
            onPress={onPress}
          />
        </View>

        {/* Body */}
        <Text variant="bodySmall" style={styles.body}>
          {item.body}
        </Text>
      </View>
    </Surface>
  );
};

export default NoticeItem;

// Styles
const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#fafafa",
  },
  content: {
    flex: 1,
    gap: 8,
  },
  titleContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins-Medium",
  },
  time: { fontFamily: "Poppins-Regular", fontSize: 11 },
  body: {
    fontFamily: "Poppins-Regular",
    marginRight: 15,
  },
});
