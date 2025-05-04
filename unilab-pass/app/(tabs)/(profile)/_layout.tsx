import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" />
      <Stack.Screen name="ChangePasswordScreen" />
      <Stack.Screen name="PersonalInfoScreen" />
      <Stack.Screen name="(event)" />
    </Stack>
  );
}
