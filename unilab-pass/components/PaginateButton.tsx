// Core
import { StyleSheet, View, Dimensions } from "react-native";
import React from "react";
import { Button, Icon, Text } from "react-native-paper";

// Types
type Props = {
  isLastSlide: boolean;
  onPressScroll: () => void;
};

// Screen Dimension
const { width } = Dimensions.get("window");

// Component
const PaginateButton = ({ isLastSlide, onPressScroll }: Props) => {
  // Template
  return (
    <Button
      buttonColor="#F5F5F5"
      rippleColor="#F5F5F5"
      mode="contained"
      onPress={onPressScroll}
      style={{
        borderRadius: 10,
        width: 0.9 * width,
        position: "absolute",
        bottom: 15,
      }}
    >
      <View style={styles.button}>
        <Text variant="titleMedium" style={styles.buttonText}>
          {isLastSlide ? "Get Started" : "Next"}
        </Text>
        {!isLastSlide && (
          <Icon source="chevron-right" color="#1B61B5" size={22} />
        )}
      </View>
    </Button>
  );
};

export default PaginateButton;

// Styles
const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    paddingTop: 3,
    textAlignVertical: "center",
    color: "#1B61B5",
  },
});
