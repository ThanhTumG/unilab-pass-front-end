// Core
import React from "react";
import { Icon, Surface, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet, View } from "react-native";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

// App
import Dot from "./ui/Dot-matrix";

// Types
type Props = {
  color1: string;
  color2: string;
  title: string;
  content: string;
  icon: IconSource;
};

// Screen Dimension
const { width } = Dimensions.get("window");

// Component
const CustomCard = ({ color1, color2, title, content, icon }: Props) => {
  // Template
  return (
    <Surface style={{ borderRadius: 10, borderCurve: "continuous" }}>
      <LinearGradient
        colors={[color1, color2]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.alignCenter, styles.container]}
      >
        <View style={styles.content}>
          <Text variant="titleLarge" style={styles.titleText}>
            {title}
          </Text>
          <Text variant="labelSmall" style={styles.contentText}>
            {content}
          </Text>
        </View>

        <View style={styles.iconWrapper}>
          <Icon source={icon} color="white" size={35} />
        </View>
        <Dot style={styles.dot_top} />
        <Dot style={styles.dot_bottom} />
      </LinearGradient>
    </Surface>
  );
};

export default CustomCard;

// Styles
const styles = StyleSheet.create({
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 0.43 * width,
    height: 133,
    borderRadius: 10,
    borderCurve: "continuous",
  },
  dot_top: {
    position: "absolute",
    top: 5,
    left: 5,
  },
  dot_bottom: {
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  iconWrapper: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  content: {
    position: "absolute",
    bottom: 15,
    left: 15,
    gap: 2,
  },
  titleText: { fontFamily: "Poppins-SemiBold", color: "white" },
  contentText: { fontFamily: "Poppins-Medium", color: "white" },
});
