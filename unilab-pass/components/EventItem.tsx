// Core
import dayjs from "dayjs";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Icon, Text, TouchableRipple } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// Types
type Props = {
  eventName: string;
  startTime: string;
  endTime: string;
  onDelete?: () => void;
  onViewLog?: () => void;
};

// Component
const EventItem = ({
  eventName,
  startTime,
  endTime,
  onViewLog,
  onDelete,
}: Props) => {
  // States
  const [isExpanded, setIsExpanded] = useState(false);

  // Animation values
  const opacityBtn = useSharedValue(0);
  const rotation = useSharedValue(0);
  const height = useSharedValue(60);

  // Animated styles
  const animatedBtnStyle = useAnimatedStyle(() => ({
    opacity: opacityBtn.value,
    height: opacityBtn.value ? 60 : 0,
  }));

  const animatedTimeStyle = useAnimatedStyle(() => ({
    opacity: opacityBtn.value,
    height: opacityBtn.value ? 40 : 0,
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const animatedCardHeightStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  // Methods
  // Handle press card
  const handlePressCard = () => {
    setIsExpanded(!isExpanded);
    rotation.value = withTiming(isExpanded ? 0 : 180, { duration: 300 });
    height.value = withTiming(isExpanded ? 60 : 155, { duration: 300 });

    setTimeout(() => {
      opacityBtn.value = withTiming(isExpanded ? 0 : 1, { duration: 300 });
    }, 250);
  };

  // Handle view log
  const handleViewLog = () => {
    onViewLog && onViewLog();
  };

  // Handle delete
  const handleDelete = () => {
    onDelete && onDelete();
  };

  // Template
  return (
    <TouchableRipple
      rippleColor={"rgba(230, 240, 255, 0.55)"}
      onPress={handlePressCard}
      style={styles.card}
    >
      <Animated.View
        style={[
          { justifyContent: "space-between", paddingTop: 16 },
          animatedCardHeightStyle,
        ]}
      >
        <View>
          <View style={styles.content}>
            <Text variant="titleMedium" style={styles.title}>
              {eventName}
            </Text>

            <Animated.View style={animatedIconStyle}>
              <Icon source="chevron-up" size={28} color="#808080" />
            </Animated.View>
          </View>
          {isExpanded && (
            <Animated.View style={animatedTimeStyle}>
              <Text variant="bodyMedium" style={styles.timeText}>
                Start: {dayjs(startTime).format("DD MMM YYYY - HH:mm")}
              </Text>
              <Text variant="bodyMedium" style={styles.timeText}>
                End: {dayjs(endTime).format("DD MMM YYYY - HH:mm")}
              </Text>
            </Animated.View>
          )}
        </View>

        {isExpanded && (
          <Animated.View
            style={[
              animatedBtnStyle,
              {
                justifyContent: "flex-end",
              },
            ]}
          >
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleViewLog}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                icon={"file-document"}
              >
                View Log
              </Button>
              <Button
                mode="outlined"
                onPress={handleDelete}
                rippleColor={"transparent"}
                style={styles.deleteButton}
                labelStyle={styles.deleteButtonLabel}
                icon={"delete-outline"}
              >
                Delete
              </Button>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </TouchableRipple>
  );
};

export default EventItem;

// Styles
const styles = StyleSheet.create({
  card: {
    alignSelf: "stretch",
    backgroundColor: "rgba(230, 240, 255, 0.55)",
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(230, 240, 255, 0.55)",
    borderRadius: 8,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 3,
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins-Medium",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
    marginRight: 8,
  },
  button: {
    marginRight: 8,
    borderRadius: 8,
  },
  deleteButton: {
    borderColor: "#d32f2f",
    borderRadius: 8,
  },
  buttonLabel: {
    fontFamily: "Poppins-Medium",
    color: "#fff",
    fontSize: 14,
  },
  deleteButtonLabel: {
    fontFamily: "Poppins-Medium",
    color: "#d32f2f",
    fontSize: 14,
  },
  timeText: {
    paddingLeft: 10,
    color: "#4a4a4a",
  },
});
