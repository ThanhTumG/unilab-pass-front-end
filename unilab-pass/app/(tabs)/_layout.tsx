// Core
import { Tabs } from "expo-router";
import { ImageBackground, StyleSheet } from "react-native";

// App
import TabBar from "components/TabBar";

// Component
export default function TabLayout() {
  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
    >
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          tabBarActiveTintColor: "blue",
        }}
      >
        <Tabs.Screen
          name="HomeScreen"
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
          name="RecordActivityScreen"
          options={{
            title: "Record",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="AccountManagementScreen"
          options={{
            title: "Account",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="ProfileScreen"
          options={{
            title: "Profile",
            headerShown: false,
          }}
        />
      </Tabs>
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
