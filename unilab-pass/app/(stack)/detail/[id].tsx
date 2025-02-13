// Core
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View, StyleSheet, ImageBackground } from "react-native";
import {
  Button,
  IconButton,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";

// App
import useBackHandler from "utils/useBackHandler";
import { DetailUserInformationFormType } from "constants/userInfor.type";
import {
  DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES,
  DetailUserInformationFormSchema,
} from "constants/userInfor.constant";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// UTC time
dayjs.extend(utc);

// Component
const UserDetailScreen = () => {
  // States
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [status, setStatus] = React.useState("checked");
  const [isAllowed, setIsAllowed] = useState<boolean>(
    DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES.permission
  );

  // Param
  const { id } = useLocalSearchParams();

  // Router
  const router = useRouter();

  useBackHandler(() => {
    router.replace("/AccountManagementScreen");
    return true;
  });

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DetailUserInformationFormType>({
    resolver: zodResolver(DetailUserInformationFormSchema),
    defaultValues: {
      fullName: "Thanh Tùng",
      birth: dayjs.utc("2003-10-25 00:00:00").toDate(),
      email: "thanhtumg.2510@gmail.com",
      gender: "Male",
      phone: "0986801203",
      permission: DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES.permission,
    },
  });

  // Methods
  // handle toggle switch
  const handleToggleSwitch = () => {
    if (isEditMode) setIsAllowed(!isAllowed);
  };

  // handle toggle edit mode
  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  // Template
  return (
    <ImageBackground
      source={require("assets/images/background-without-logo.png")}
      style={[styles.background]}
    >
      {/* Go back button */}
      <IconButton
        icon={"chevron-left"}
        style={{ position: "absolute", top: 10, left: 10 }}
        size={32}
        iconColor="#808080"
        onPress={() => router.replace("/(tabs)/AccountManagementScreen")}
      />

      {/* Title */}
      <Text variant="titleLarge" style={styles.title}>
        Details Information
      </Text>

      <IconButton
        icon={isEditMode ? "eraser" : "square-edit-outline"}
        size={24}
        iconColor={isEditMode ? "#808080" : "#3385FF"}
        onPress={handleToggleEdit}
        style={{ position: "absolute", top: 14, right: 10 }}
      />

      <View style={styles.formField}>
        {/* Form */}
        {/* Fullname */}
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                theme={{
                  colors: {
                    primary: "#2B56F0",
                    onSurfaceVariant: "#777",
                  },
                }}
                disabled={!isEditMode}
                textColor="#333"
                mode="flat"
                style={styles.inputField}
                contentStyle={{
                  fontFamily: "Poppins-Regular",
                  marginTop: 8,
                }}
                label="Name"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={!!errors.fullName}
              />
              {errors.fullName && (
                <Text style={styles.error}>{`${errors.fullName.message}`}</Text>
              )}
            </View>
          )}
        />

        {/* ID */}
        <View>
          <TextInput
            disabled={true}
            textColor="#333"
            mode="flat"
            style={styles.inputField}
            contentStyle={{
              fontFamily: "Poppins-Regular",
              marginTop: 8,
            }}
            label="ID"
            value={id.toString()}
          />
        </View>

        {/* Birth */}
        <Controller
          control={control}
          name="birth"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                theme={{
                  colors: {
                    primary: "#2B56F0",
                    onSurfaceVariant: "#777",
                  },
                }}
                disabled={!isEditMode}
                textColor="#333"
                mode="flat"
                style={styles.inputField}
                contentStyle={{
                  fontFamily: "Poppins-Regular",
                  marginTop: 8,
                }}
                label="Name"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value?.toISOString().split("T")[0]}
                error={!!errors.birth}
              />
              {errors.birth && (
                <Text style={styles.error}>{`${errors.birth.message}`}</Text>
              )}
            </View>
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                theme={{
                  colors: {
                    primary: "#2B56F0",
                    onSurfaceVariant: "#777",
                  },
                }}
                disabled={!isEditMode}
                textColor="#333"
                mode="flat"
                style={styles.inputField}
                contentStyle={{
                  fontFamily: "Poppins-Regular",
                  marginTop: 8,
                }}
                label="Email"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={!!errors.email}
              />
              {errors.email && (
                <Text style={styles.error}>{`${errors.email.message}`}</Text>
              )}
            </View>
          )}
        />

        {/* Phone */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                theme={{
                  colors: {
                    primary: "#2B56F0",
                    onSurfaceVariant: "#777",
                  },
                }}
                disabled={!isEditMode}
                textColor="#333"
                mode="flat"
                style={styles.inputField}
                contentStyle={{
                  fontFamily: "Poppins-Regular",
                  marginTop: 8,
                }}
                label="Phone"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={!!errors.phone}
              />
              {errors.phone && (
                <Text style={styles.error}>{`${errors.phone.message}`}</Text>
              )}
            </View>
          )}
        />

        {/* Permission */}
        <View style={styles.permissionContainer}>
          <Text style={{ fontSize: 13, color: "rgba(28, 27, 31, 0.38)" }}>
            Permission
          </Text>
          <Switch value={isAllowed} onValueChange={handleToggleSwitch} />
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.actionButtonContainer}>
        <Button
          mode="contained"
          style={[styles.actButton, { backgroundColor: "#FF6666" }]}
        >
          Delete Member
        </Button>
        <Button
          mode="contained"
          disabled={!isEditMode}
          style={[styles.actButton]}
        >
          Apply
        </Button>
      </View>
    </ImageBackground>
  );
};

export default UserDetailScreen;

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    marginTop: 26,
  },
  formField: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    gap: 5,
  },
  inputField: {
    maxHeight: 77,
    width: 300,
    backgroundColor: "transparent",
  },
  // submitButton: {
  //   borderRadius: 5,
  //   marginTop: 25,
  // },
  error: {
    marginLeft: 2,
    color: "red",
    fontFamily: "Poppins-Light",
    fontSize: 12,
  },
  permissionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    paddingLeft: 16,
    maxHeight: 77,
    width: 300,
  },
  actionButtonContainer: {
    position: "absolute",
    bottom: 74,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  actButton: {
    borderRadius: 5,
    minWidth: 150,
    minHeight: 40,
  },
});
