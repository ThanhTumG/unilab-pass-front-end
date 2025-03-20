// Core
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// App
import { useUserStore } from "stores";
import TabBarButton from "./TabBarButton";

// Stack tab
const stackTabScreen = ["(member)", "(record)", "(profile)"];

// Component
const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  // States
  const [isVisible, setIsVisible] = useState(true);

  // Store
  const { appIsOnlyScanMode } = useUserStore();

  // Colors
  const primaryColor = "rgba(27, 97, 181, 0.89)";
  const greyColor = "#6C6C6C";

  // Effects
  useEffect(() => {
    const checkTabStack = () => {
      const currentTabRoute = state.routes[state.index];
      const currentTabName = currentTabRoute.name;
      if (stackTabScreen.includes(currentTabName) && currentTabRoute.state) {
        const stackIndex = currentTabRoute.state.index ?? 0;
        if (stackIndex !== 0 || appIsOnlyScanMode) {
          setIsVisible(false);
          return;
        }
      }
      setIsVisible(true);
    };
    checkTabStack();
  }, [state]);

  // Template
  return (
    <Surface
      style={[styles.tabbar, { display: isVisible ? "flex" : "none" }]}
      elevation={5}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        // Template
        return (
          <TabBarButton
            key={route.name}
            color={isFocused ? primaryColor : greyColor}
            isFocused={isFocused}
            routeName={route.name}
            label={label.toString()}
            onPress={onPress}
          />
        );
      })}
    </Surface>
  );
};

export default TabBar;

// Styles
const styles = StyleSheet.create({
  tabbar: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    flexDirection: "row",
    bottom: 0,
    backgroundColor: "#fff",
    marginHorizontal: 0,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderCurve: "circular",
  },
});
