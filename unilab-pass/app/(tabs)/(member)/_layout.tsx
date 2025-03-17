import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MemberManagementScreen" />
      <Stack.Screen name="DetailMemberScreen" />
      <Stack.Screen name="CreateMemberScreen" />
    </Stack>
  );
}
