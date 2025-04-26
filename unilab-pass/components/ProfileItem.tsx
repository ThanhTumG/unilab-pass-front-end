// Core
import React from "react";
import { Divider, Icon, Text, TouchableRipple } from "react-native-paper";
import { StyleSheet, View } from "react-native";

// Types
type Props = {
  title: string;
  onPress?: () => any;
};

// Component
const ProfileItem = ({ title, onPress }: Props) => {
  // Template
  return (
    <TouchableRipple
      rippleColor="#FCFCFC"
      style={{
        alignSelf: "stretch",
      }}
      onPress={onPress}
    >
      <>
        <View style={styles.container}>
          <Text variant="titleMedium" style={styles.title}>
            {title}
          </Text>
          <Icon source={"chevron-right"} size={28} color="#808080" />
        </View>
        <Divider
          style={{
            height: 1,
            width: "100%",
          }}
        />
      </>
    </TouchableRipple>
  );
};

export default ProfileItem;

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    height: 50,
  },
  title: {
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
});
