// Core
import { ImageBackground, StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";

// Types
type Props = {};

// Component
const ManageAccountScreen = (props: Props) => {
  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background-with-icon.png")}
      style={[styles.background]}
    >
      <Text variant="titleMedium" style={styles.title}>
        Account Management
      </Text>
    </ImageBackground>
  );
};

export default ManageAccountScreen;

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    marginLeft: 30,
    marginTop: 100,
    marginRight: "auto",
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    textAlignVertical: "center",
  },
});
