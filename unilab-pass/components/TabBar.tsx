// Core
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// App
import TabBarButton from "./TabBarButton";

// Component
const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  // Colors
  const primaryColor = "#1B61B5";
  const greyColor = "#6C6C6C";

  // Template
  return (
    <Surface style={[styles.tabbar, styles.alginCenter]} elevation={5}>
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

const styles = StyleSheet.create({
  alginCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabbar: {
    position: "absolute",
    flexDirection: "row",
    bottom: 0,
    backgroundColor: "#fff",
    marginHorizontal: 0,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 25,
    borderCurve: "circular",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
});
