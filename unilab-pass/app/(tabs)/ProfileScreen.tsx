// Core
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";

type Props = {};

// Component
const ProfileScreen = (props: Props) => {
  // Router
  const router = useRouter();

  // Template
  return (
    <View>
      <Text>ProfileScreen</Text>
      <Button onPress={() => router.replace("/(auth)/LoginScreen")}>
        Log out
      </Button>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
