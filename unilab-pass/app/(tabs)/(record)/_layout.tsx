import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecordActivityScreen" />
      <Stack.Screen name="ScanQRScreen" />
      <Stack.Screen name="ScanFaceScreen" />
      <Stack.Screen name="RecordScreen" />
    </Stack>
  );
}
