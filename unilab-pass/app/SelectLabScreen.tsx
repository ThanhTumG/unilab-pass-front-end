// Core
import { ImageBackground, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Button, Icon, Text, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";

// App
import {
  CustomDropdownInput,
  CustomDropdownItem,
} from "components/CustomDropdown";

// Types
type Props = {};

// Options
const OPTIONS = [
  { label: "Lab 1", value: "1" },
  { label: "Lab 2", value: "2" },
  { label: "Lab 3", value: "3" },
];

// Component
const SelectLabScreen = (props: Props) => {
  // States
  const [lab, setLab] = useState<string>();

  // Router
  const router = useRouter();

  // Methods
  // Handle press homepage button
  const handlePressHomePage = () => {
    if (lab) router.replace("/(tabs)/HomeScreen");
  };

  // Template
  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={[styles.background, styles.alignCenter]}
    >
      {/* Title */}
      <Text variant="headlineLarge" style={styles.title}>
        Select Lab
      </Text>

      {/* Select */}
      <View style={[styles.content, styles.alignCenter]}>
        <Dropdown
          label="Lab name"
          placeholder="Select your lab"
          options={OPTIONS}
          value={lab}
          onSelect={setLab}
          menuContentStyle={{
            marginTop: 25,
          }}
          menuUpIcon={
            <TextInput.Icon icon="menu-up" color="#333" pointerEvents="none" />
          }
          menuDownIcon={
            <TextInput.Icon
              icon="menu-down"
              color="#333"
              pointerEvents="none"
            />
          }
          hideMenuHeader={true}
          CustomDropdownItem={CustomDropdownItem}
          CustomDropdownInput={CustomDropdownInput}
        />

        {/* Create Lab Button */}
        <Text
          variant="bodyMedium"
          style={{ fontFamily: "Poppins-Regular", color: "#333" }}
        >
          Or
        </Text>

        <Button
          mode="outlined"
          style={{ borderRadius: 5 }}
          textColor="#333"
          contentStyle={{ width: 270, height: 50 }}
          onPress={() => console.log("create")}
        >
          Create new Lab
        </Button>
      </View>

      {/* Go to Homepage */}
      <Button
        style={{
          position: "absolute",
          bottom: 5,
          right: 5,
        }}
        mode="text"
        onPress={handlePressHomePage}
        textColor="#1B61B5"
      >
        <View style={[styles.homeButton, styles.alignCenter]}>
          <Text
            variant="titleMedium"
            style={{
              fontFamily: "Poppins-Medium",
              color: "#1B61B5",
            }}
          >
            Homepage
          </Text>
          <Icon source="chevron-right" color="#1B61B5" size={20} />
        </View>
      </Button>
    </ImageBackground>
  );
};

export default SelectLabScreen;

// Styles
const styles = StyleSheet.create({
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    paddingBottom: 170,
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: "#1B61B5",
  },
  content: {
    maxHeight: 200,
    marginTop: 40,
    gap: 30,
  },
  homeButton: {
    flexDirection: "row",
  },
});
