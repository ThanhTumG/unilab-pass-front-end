import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  isLastSlide: boolean;
  onPressScroll: () => void;
};

// Screen Dimension
const { width } = Dimensions.get("window");

const PaginateButton = ({ isLastSlide, onPressScroll }: Props) => {
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
        <Text style={styles.buttonText}>
          {isLastSlide ? "Get Started" : "Next"}
        </Text>
        {!isLastSlide && (
          <MaterialCommunityIcons
            name="chevron-right"
            color="#1B61B5"
            size={22}
          />
        )}
      </View>
    </Button>
  );
};

export default PaginateButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontFamily: "Poppins-Bold",
    paddingTop: 3,
    color: "#1B61B5",
  },
});
