// Core
import React, { useState, useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import {
  TextInput,
  Menu,
  TouchableRipple,
  Text,
  Divider,
  useTheme,
} from "react-native-paper";

// Types
type Option = {
  label: string;
  value: string;
};

type CustomDropdownProps = {
  options: Option[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  mode?: "flat" | "outlined";
};

// Component
const CustomDropdown = ({
  options,
  value,
  onSelect,
  placeholder = "Select option",
  label,
  disabled = false,
  error = false,
  mode = "outlined",
}: CustomDropdownProps) => {
  // States
  const [visible, setVisible] = useState(false);

  // Theme
  const theme = useTheme();

  // Memo
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const menuStyle: ViewStyle = useMemo(
    () => ({
      marginTop: 50,
      backgroundColor: theme.colors.surface,
      borderRadius: 4,
      elevation: 4,
    }),
    [theme]
  );

  const itemStyle: ViewStyle = useMemo(
    () => ({
      height: 50,
      width: 300,
      justifyContent: "center",
      paddingHorizontal: 20,
    }),
    [value, selectedOption]
  );

  // Template
  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableRipple
            onPress={() => setVisible(!visible)}
            disabled={disabled}
          >
            <TextInput
              mode={mode}
              label={label}
              disabled={disabled}
              placeholder={placeholder}
              placeholderTextColor="#777"
              value={selectedOption?.label || ""}
              error={error}
              editable={false}
              style={{
                backgroundColor: `${
                  mode === "flat" ? "transparent" : "#fafafa"
                }`,
                width: 300,
              }}
              textColor="#333"
              contentStyle={{ fontFamily: "Poppins-Regular" }}
              right={
                <TextInput.Icon
                  icon={visible ? "menu-up" : "menu-down"}
                  pointerEvents="none"
                />
              }
            />
          </TouchableRipple>
        }
        contentStyle={menuStyle}
      >
        {options.map((option, index) => (
          <React.Fragment key={option.value}>
            <TouchableRipple
              onPress={() => {
                onSelect(option.value);
                setVisible(false);
              }}
              style={itemStyle}
            >
              <Text
                style={{
                  color: value === option.value ? "#66A3FF" : "#333",
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                }}
              >
                {option.label}
              </Text>
            </TouchableRipple>
            {index < options.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Menu>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    width: 300,
  },
});

export default CustomDropdown;
