// Core
import { Tabs } from "expo-router";

// App
import TabBar from "components/TabBar";

// Component
export default function TabLayout() {
  // Template
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="AccessManagementScreen"
        options={{
          title: "Access",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(record)"
        options={{
          title: "Record",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(member)"
        options={{
          title: "Account",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
