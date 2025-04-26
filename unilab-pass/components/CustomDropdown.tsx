// Core
import React, { useMemo } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import {
  Divider,
  Headline,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import {
  DropdownInputProps,
  DropdownItemProps,
} from "react-native-paper-dropdown";

// Custom dropdown item
const CustomDropdownItem = ({
  width,
  option,
  value,
  onSelect,
  toggleMenu,
  isLast,
}: DropdownItemProps) => {
  const style: ViewStyle = useMemo(
    () => ({
      height: 50,
      backgroundColor: value === option.value ? "#f5f5f5" : "#fafafa",
      justifyContent: "center",
      paddingHorizontal: 20,
    }),
    [option.value, value, width]
  );

  // Template
  return (
    <>
      <TouchableRipple
        onPress={() => {
          onSelect?.(option.value);
          toggleMenu();
        }}
        style={style}
      >
        <Headline
          style={{
            color: value === option.value ? "#66A3FF" : "#333",
            fontFamily: "Poppins-Regular",
            fontSize: 16,
          }}
        >
          {option.label}
        </Headline>
      </TouchableRipple>
      {!isLast && <Divider />}
    </>
  );
};

// Custom dropdown input
const CustomDropdownInput = ({
  mode,
  disabled,
  placeholder,
  selectedLabel,
  rightIcon,
  error,
  label,
}: DropdownInputProps) => (
  // Template
  <TextInput
    mode={mode}
    label={label}
    disabled={disabled}
    placeholder={placeholder}
    placeholderTextColor="#777"
    value={selectedLabel}
    error={error}
    style={{
      backgroundColor: `${mode == "flat" ? "transparent" : "#fafafa"}`,
      width: 300,
    }}
    textColor="#333"
    contentStyle={{ fontFamily: "Poppins-Regular" }}
    right={rightIcon}
  />
);

export { CustomDropdownItem, CustomDropdownInput };

// Styles
const styles = StyleSheet.create({});
