// Core
import React, { useEffect } from "react";
import { Icon, TouchableRipple } from "react-native-paper";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// Types
type Props = {
  isFocused: boolean;
  label: string;
  routeName: string;
  color: string;
  style?: StyleProp<ViewStyle>;
  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined;
};
interface Icons {
  [key: string]: string; // Index signature
}

const icons: Icons = {
  "(home)": "home-variant-outline",
  AccessManagementScreen: "history",
  "(record)": "qrcode-scan",
  "(member)": "account-multiple-outline",
  "(profile)": "account-circle-outline",
};

// Component
const TabBarButton = ({
  isFocused,
  label,
  routeName,
  color,
  style,
  onPress,
}: Props) => {
  const scale = useSharedValue(0);

  // Animation
  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.5]);
    const top = interpolate(scale.value, [0, 1], [0, 10]);
    return {
      // Style
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {
      // Style
      opacity,
    };
  });

  // Effects
  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [scale, isFocused]);

  // Template
  return (
    <TouchableRipple
      onPress={onPress}
      rippleColor={"#fff"}
      style={[styles.container, style]}
    >
      <View style={styles.tabbarItem}>
        {/* Icon */}
        <Animated.View style={animatedIconStyle}>
          <Icon source={icons[routeName]} size={28} color={color} />
        </Animated.View>

        {/* Label */}
        <Animated.Text
          style={[
            {
              color,
              textAlign: "center",
              fontFamily: "Poppins-Regular",
              fontSize: 11,
            },
            animatedTextStyle,
          ]}
        >
          {label.toString()}
        </Animated.Text>
      </View>
    </TouchableRipple>
  );
};

export default TabBarButton;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tabbarItem: {
    flex: 1,
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
