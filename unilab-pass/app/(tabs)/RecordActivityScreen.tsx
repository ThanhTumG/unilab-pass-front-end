// Core
import { ImageBackground, StyleSheet, View } from "react-native";
import React from "react";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";

// Types
type Props = {};

// Component
const RecordActivityScreen = (props: Props) => {
  // Route
  const router = useRouter();

  // Methods
  // Handle route scan screen
  const handleRouteScanScreen = (isCheckIn: boolean) => {
    router.replace({
      pathname: "/(stack)/ScanFaceScreen",
      params: { recordType: isCheckIn ? "CHECKIN" : "CHECKOUT" },
    });
  };

  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background-without-logo.png")}
      style={[styles.background]}
    >
      {/* Title */}
      <Text variant="headlineLarge" style={styles.title}>
        Select Record Type
      </Text>

      {/* Action button */}
      <View style={[styles.actionBtnContainer, styles.alignCenter]}>
        <Button
          mode="outlined"
          style={{ borderRadius: 5 }}
          textColor="#333"
          contentStyle={{ width: 270, height: 50 }}
          onPress={() => handleRouteScanScreen(true)}
        >
          Check In
        </Button>
        <Button
          mode="outlined"
          style={{ borderRadius: 5 }}
          textColor="#333"
          contentStyle={{ width: 270, height: 50 }}
          onPress={() => handleRouteScanScreen(false)}
        >
          Check Out
        </Button>
      </View>
    </ImageBackground>
  );
};

export default RecordActivityScreen;

// Styles
const styles = StyleSheet.create({
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 150,
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: "#1B61B5",
  },
  actionBtnContainer: {
    marginTop: 90,
    gap: 37,
  },
});
