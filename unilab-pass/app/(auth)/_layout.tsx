// Core
import { Stack } from "expo-router";

// Component
export default function RootLayout() {
  // Template
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "transparent" },
        headerShown: false,
      }}
    >
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="SignUpScreen" />
      <Stack.Screen name="OTPVerificationScreen" />
      <Stack.Screen name="ForgotPasswordScreen" />
    </Stack>
  );
}
