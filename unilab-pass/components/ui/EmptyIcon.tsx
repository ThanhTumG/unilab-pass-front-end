// Core
import React from "react";
import { Image, StyleSheet } from "react-native";

// Types
type Props = {};

// Component
const EmptyIcon = (props: Props) => {
  // Template
  return (
    <Image
      source={require("../../assets/images/Nothing-Img.png")}
      style={styles.image}
    />
  );
};

export default EmptyIcon;

// Styles
const styles = StyleSheet.create({
  image: {
    resizeMode: "contain",
    width: 170,
    position: "absolute",
    alignSelf: "center",
  },
});
