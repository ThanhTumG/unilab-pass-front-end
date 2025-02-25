// Core
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Dropdown } from "react-native-paper-dropdown";

// App
import useBackHandler from "utils/useBackHandler";
import { DetailUserInformationFormType } from "constants/userInfor.type";
import {
  DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES,
  DetailUserInformationFormSchema,
} from "constants/userInfor.constant";
import {
  CustomDropdownInput,
  CustomDropdownItem,
} from "components/CustomDropdown";
import {
  LabMemberControllerApi,
  LabMemberControllerApiDeleteMemberRequest,
  MyUserControllerApi,
  MyUserControllerApiUpdateMyUserRequest,
} from "api/index";
import { useAuthStore, useUserStore } from "stores";
import { getFullName, splitFullName } from "lib/utils";

// UTC time
dayjs.extend(utc);

// Options
const OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

// Component
const UserDetailScreen = () => {
  // States
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isPendingGetMem, setIsPendingGetMem] = useState<boolean>(false);
  const [isPendingUpdateMem, setIsPendingUpdateMem] = useState<boolean>(false);
  const [isPendingDeleteMem, setIsPendingDeleteMem] = useState<boolean>(false);
  const [isAllowed, setIsAllowed] = useState<boolean>(
    DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES.permission
  );

  // Param
  const { id } = useLocalSearchParams();

  // Router
  const router = useRouter();

  // Theme
  const theme = useTheme();

  // Server
  const myUserControllerApi = new MyUserControllerApi();
  const labMemberControllerApi = new LabMemberControllerApi();

  // Store
  const { appToken } = useAuthStore();
  const { appLabId } = useUserStore();

  // Form
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<DetailUserInformationFormType>({
    resolver: zodResolver(DetailUserInformationFormSchema),
    defaultValues: DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES,
  });

  // Methods
  // handle back
  useBackHandler(() => {
    router.replace("/AccountManagementScreen");
    return true;
  });

  // handle toggle switch
  const handleToggleSwitch = () => {
    if (isEditMode) setIsAllowed(!isAllowed);
  };

  // handle toggle edit mode
  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  // Handle get detail member
  const handleGetDetailMember = useCallback(async () => {
    if (isPendingGetMem) return;
    setIsPendingGetMem(true);
    try {
      const response = await myUserControllerApi.getMyUser(
        { userId: id as string },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );

      console.log("Successful get detail info: ", response.data.result);
      const result = response.data.result;
      reset({
        fullName: getFullName({
          firstName: result?.firstName,
          lastName: result?.lastName,
        }),
        id: result?.id,
        birth: result?.dob,
        email: result?.email,
        gender: "male",
        permission: true,
      });
    } catch (error: any) {
      console.error(error.response.data);
    }
    setIsPendingGetMem(false);
  }, [appToken]);

  // Handle delete member
  const handleDeleteMem = async () => {
    if (isPendingDeleteMem) return;
    setIsPendingDeleteMem(true);
    try {
      const param: LabMemberControllerApiDeleteMemberRequest = {
        labId: appLabId ?? "",
        userId: id as string,
      };
      const response = await labMemberControllerApi.deleteMember(param, {
        headers: { Authorization: `Bearer ${appToken}` },
      });

      console.log("Success delete member: ", response.data.result);
      router.replace("/(tabs)/AccountManagementScreen");
    } catch (error: any) {
      console.error(error.response.data);
    }
    setIsPendingDeleteMem(false);
  };

  // Handle update member
  const handleUpdateMem = async (data: DetailUserInformationFormType) => {
    try {
      if (isPendingUpdateMem) return;
      setIsPendingUpdateMem(true);
      const { firstName, lastName } = splitFullName(data.fullName);
      const param: MyUserControllerApiUpdateMyUserRequest = {
        userId: id as string,
        myUserUpdateRequest: {
          id: id as string,
          dob: data.email,
          firstName: firstName,
          lastName: lastName,
        },
      };
      const response = await myUserControllerApi.updateMyUser(param, {
        headers: { Authorization: `Bearer ${appToken}` },
      });
      console.log("Successful update member: ", response.data.result);
    } catch (error: any) {
      console.error(error.response.data);
    }
    setIsPendingUpdateMem(false);
  };

  // Handle refresh
  const onRefresh = useCallback(() => {
    handleGetDetailMember();
  }, [handleGetDetailMember]);

  // Effects
  useFocusEffect(
    useCallback(() => {
      handleGetDetailMember();
    }, [handleGetDetailMember])
  );

  // Template
  return (
    <View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
      {/* Header */}
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          top: 0,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#FCFCFC",
          width: "100%",
          paddingVertical: 20,
        }}
      >
        {/* Go back button */}
        <IconButton
          icon={"chevron-left"}
          style={{ position: "absolute", left: 10, zIndex: 10 }}
          size={32}
          iconColor="#808080"
          onPress={() => router.replace("/(tabs)/AccountManagementScreen")}
        />
        {/* Title */}
        <Text
          variant="titleLarge"
          style={{
            fontFamily: "Poppins-SemiBold",
            color: "#333",
            textAlign: "center",
            flex: 1,
            alignItems: "center",
          }}
        >
          Details Information
        </Text>

        <IconButton
          icon={isEditMode ? "eraser" : "square-edit-outline"}
          size={24}
          iconColor={isEditMode ? "#808080" : "#1B61B5"}
          onPress={handleToggleEdit}
          style={{ position: "absolute", right: 10 }}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={{ marginTop: 80 }}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            refreshing={isPendingGetMem}
            onRefresh={onRefresh}
          />
        }
      >
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
                  <Text
                    style={styles.error}
                  >{`${errors.fullName.message}`}</Text>
                )}
              </View>
            )}
          />

          {/* ID */}
          <View>
            <TextInput
              disabled={!isEditMode}
              textColor="#333"
              mode="flat"
              style={styles.inputField}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
              }}
              label="ID"
              value={getValues().id}
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
                  label="Birth"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={!!errors.birth}
                />
                {errors.birth && (
                  <Text style={styles.error}>{`${errors.birth.message}`}</Text>
                )}
              </View>
            )}
          />

          {/* Gender */}
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Dropdown
                  mode="flat"
                  label="Gender"
                  options={OPTIONS}
                  value={value}
                  onSelect={(value) => onChange(value)}
                  menuUpIcon={
                    <TextInput.Icon
                      icon="menu-up"
                      color="#333"
                      pointerEvents="none"
                    />
                  }
                  disabled={!isEditMode}
                  error={!!errors.gender}
                  menuDownIcon={
                    <TextInput.Icon
                      icon="menu-down"
                      color="#333"
                      pointerEvents="none"
                    />
                  }
                  menuContentStyle={{
                    marginTop: 25,
                  }}
                  hideMenuHeader={true}
                  CustomDropdownItem={CustomDropdownItem}
                  CustomDropdownInput={CustomDropdownInput}
                />
                {errors.gender && (
                  <Text style={styles.error}>{`${errors.gender.message}`}</Text>
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

          {/* Permission */}
          <View style={styles.permissionContainer}>
            <Text
              style={{
                fontSize: 13,
                color: isEditMode ? "#777" : "rgba(28, 27, 31, 0.38)",
              }}
            >
              Permission
            </Text>
            <Switch value={isAllowed} onValueChange={handleToggleSwitch} />
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionButtonContainer}>
          <Button
            labelStyle={{ fontFamily: "Poppins-Medium" }}
            mode="contained"
            style={[styles.actButton, { backgroundColor: "#FF6666" }]}
            onPress={handleDeleteMem}
            loading={isPendingDeleteMem}
            disabled={isPendingDeleteMem}
          >
            Delete
          </Button>
          <Button
            labelStyle={{ fontFamily: "Poppins-Medium" }}
            mode="contained"
            disabled={!isEditMode}
            style={[styles.actButton]}
            onPress={handleSubmit(handleUpdateMem)}
            loading={isPendingUpdateMem}
          >
            Apply
          </Button>
        </View>
      </ScrollView>
    </View>
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
  title: {
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    marginTop: 26,
  },
  formField: {
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  inputField: {
    maxHeight: 77,
    width: 300,
    backgroundColor: "transparent",
  },
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 60,
    marginTop: 60,
  },
  actButton: {
    borderRadius: 5,
    width: 120,
    minHeight: 40,
  },
});
