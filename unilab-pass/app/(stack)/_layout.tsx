import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="detail/[id]" />
      <Stack.Screen name="CreateMemberScreen" />
      <Stack.Screen name="ScanScreen" />
      <Stack.Screen name="RecordScreen" />
    </Stack>
  );
}
