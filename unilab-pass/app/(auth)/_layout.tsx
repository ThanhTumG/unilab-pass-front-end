// Core
import { Stack } from "expo-router";
import { ImageBackground, StyleSheet } from "react-native";

// Component
export default function RootLayout() {
  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
    >
      <Stack
        screenOptions={{ contentStyle: { backgroundColor: "transparent" } }}
      >
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" options={{ headerShown: false }} />
      </Stack>
    </ImageBackground>
  );
}

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
});
