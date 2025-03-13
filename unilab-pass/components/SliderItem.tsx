// Core
import React from "react";
import { Text } from "react-native-paper";
import { StyleSheet, View, Image, Dimensions } from "react-native";

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
        <Text variant="titleLarge" style={styles.title}>
          {item.title}
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          {item.description}
        </Text>
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
    paddingVertical: 10,
    gap: 10,
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: "#F5F5F5",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    color: "#F5F5F5",
    textAlign: "center",
  },
});
