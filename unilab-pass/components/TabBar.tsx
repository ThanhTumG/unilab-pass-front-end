// Core
import { View, StyleSheet } from "react-native";
import { Icon, Text, TouchableRipple } from "react-native-paper";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// Types
type IconsType = {
  [key: string]: (props: any) => JSX.Element;
};

// Component
const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  // Icons
  const icons: IconsType = {
    HomeScreen: (props) => (
      <Icon
        source="home-variant-outline"
        size={28}
        color={greyColor}
        {...props}
      />
    ),
    AccessManagementScreen: (props) => (
      <Icon source="history" size={28} color={greyColor} {...props} />
    ),
    RecordActivityScreen: (props) => (
      <Icon source="qrcode-scan" size={28} color={greyColor} {...props} />
    ),
    AccountManagementScreen: (props) => (
      <Icon
        source="account-multiple-outline"
        size={28}
        color={greyColor}
        {...props}
      />
    ),
    ProfileScreen: (props: any) => (
      <Icon
        source="account-circle-outline"
        size={28}
        color={greyColor}
        {...props}
      />
    ),
  };

  // Colors
  const primaryColor = "#1B61B5";
  const greyColor = "#6C6C6C";

  // Template
  return (
    <View style={[styles.tabbar, styles.alginCenter]}>
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

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableRipple
            key={route.name}
            style={[styles.alginCenter, styles.button]}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            rippleColor={"#f9f9f9"}
          >
            <View style={[styles.alginCenter, styles.tabbarItem]}>
              {icons[route.name]({
                color: isFocused ? primaryColor : greyColor,
              })}
              <Text
                style={{
                  color: isFocused ? primaryColor : greyColor,
                  textAlign: "center",
                  fontFamily: "Poppins-Regular",
                  fontSize: 11,
                }}
              >
                {label.toString()}
              </Text>
            </View>
          </TouchableRipple>
        );
      })}
    </View>
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
    bottom: 25,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: "circular",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  tabbarItem: {
    flex: 1,
    gap: 2,
  },
  button: {
    flex: 1,
    // backgroundColor: "#333",
    borderRadius: 20,
  },
});
