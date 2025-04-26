import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventViewScreen" />
      <Stack.Screen name="CreateEventScreen" />
      <Stack.Screen name="DetailEventScreen" />
    </Stack>
  );
}
