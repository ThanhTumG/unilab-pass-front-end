// Core
import { StyleSheet, View } from "react-native";
import React from "react";
import { IconButton, Text } from "react-native-paper";
import { useRouter } from "expo-router";

// Types
type Props = {
  title: string;
};

// Component
const ScreenHeader = ({ title }: Props) => {
  // Router
  const router = useRouter();

  // Template
  return (
    // Header
    <View style={styles.container}>
      {/* Go back button */}
      <IconButton
        icon={"chevron-left"}
        size={28}
        iconColor="#808080"
        style={{ position: "absolute", left: 10, zIndex: 10 }}
        onPress={() => {
          if (title == "Record Activity") router.dismissAll();
          else router.back();
        }}
      />
      {/* Title */}
      <Text
        variant="titleLarge"
        style={{
          fontFamily: "Poppins-SemiBold",
          color: "#333",
          textAlign: "center",
          flex: 1,
          alignItems: "center",
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default ScreenHeader;

// Styles
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
});
