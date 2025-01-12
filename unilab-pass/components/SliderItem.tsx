// Core
import React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SharedValue } from "react-native-reanimated";

// App
import { ImageSliderType } from "constants/OnboardingData";

// Type
type Props = {
  item: ImageSliderType;
  index: number;
};

// Screen Dimension
const { width, height } = Dimensions.get("window");

// Component
const SliderItem = ({ item, index }: Props) => {
  // Template
  return (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={{ width, height }} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.description}</Text>
      </View>
    </View>
  );
};

export default SliderItem;

// Styles
const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    bottom: 105,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#F5F5F5",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#F5F5F5",
    textAlign: "center",
  },
});
