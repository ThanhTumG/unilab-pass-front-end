// Core
import {
  View,
  StyleProp,
  StyleSheet,
  ViewStyle,
  Dimensions,
} from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// App
import { ImageSliderType } from "constants/OnboardingData";

// Types
type Props = {
  items: ImageSliderType[];
  paginationIndex: number;
  scrollX: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
};

// Screen Dimension
const { width } = Dimensions.get("window");

// Component
const DotPagination = ({ items, paginationIndex, scrollX, style }: Props) => {
  // Template
  return (
    <View style={[styles.container, style]}>
      {items.map((_, index) => {
        const pgAnimationStyle = useAnimatedStyle(() => {
          const dotWidth = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [8, 20, 8],
            Extrapolation.CLAMP
          );

          return { width: dotWidth };
        });
        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              pgAnimationStyle,
              {
                backgroundColor: paginationIndex == index ? "#f5f5f5" : "#aaa",
              },
            ]}
          />
        );
      })}
    </View>
  );
};

export default DotPagination;

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    marginHorizontal: 3,
    borderRadius: 8,
    height: 8,
  },
});
