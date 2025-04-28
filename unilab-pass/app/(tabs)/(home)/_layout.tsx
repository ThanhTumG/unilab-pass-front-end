import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" />
      <Stack.Screen name="NotificationScreen" />
    </Stack>
  );
}
