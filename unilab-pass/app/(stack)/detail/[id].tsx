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
  Snackbar,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
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
import { WarningDialog } from "components/CustomDialog";

// Options
const OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

// Component
const UserDetailScreen = () => {
  // States
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState({
    getMem: false,
    updateMem: false,
    updateStatus: false,
    deleteMem: false,
  });
  const [isWarnDialog, setIsWarnDialog] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>();
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);

  // Param
  const { id } = useLocalSearchParams();

  // Router
  const router = useRouter();

  // Theme
  const theme = useTheme();

  // Server
  const labMemberControllerApi = new LabMemberControllerApi();
  const myUserControllerApi = new MyUserControllerApi();

  // Store
  const { appToken } = useAuthStore();
  const { appLabId } = useUserStore();

  // Form
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
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

  // handle toggle edit mode
  const handleToggleEdit = () => {
    if (isEditMode) reset();
    setIsEditMode(!isEditMode);
  };

  // Handle get detail member
  const handleGetDetailMember = useCallback(async () => {
    if (loading.getMem) return;
    setLoading((prev) => ({ ...prev, getMem: true }));
    try {
      const response = await labMemberControllerApi.getLabMemberDetailInfo(
        { labId: appLabId ?? "", memberId: id as string },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );

      console.log("Successful get detail info: ", response.data.result);
      const memberInfo = response.data.result?.myUserResponse;
      reset({
        fullName: getFullName({
          firstName: memberInfo?.firstName,
          lastName: memberInfo?.lastName,
        }),
        id: memberInfo?.id,
        birth: memberInfo?.dob,
        email: memberInfo?.email,
        gender: memberInfo?.gender,
        permission: response.data.result?.status === "ACTIVE",
      });
      setIsActive(response.data.result?.status === "ACTIVE");
    } catch (error: any) {
      console.error(error.response.data);
    }
    setLoading((prev) => ({ ...prev, getMem: false }));
  }, [appToken]);

  // Handle delete member
  const handleDeleteMem = async () => {
    if (loading.deleteMem) return;
    setLoading((prev) => ({ ...prev, deleteMem: true }));

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
    setLoading((prev) => ({ ...prev, deleteMem: false }));
  };

  // Handle update member info
  const handleUpdateMem = async (data: DetailUserInformationFormType) => {
    try {
      if (loading.updateMem) return;
      setLoading((prev) => ({ ...prev, updateMem: true }));

      const { firstName, lastName } = splitFullName(data.fullName);
      const param: MyUserControllerApiUpdateMyUserRequest = {
        userId: id as string,
        myUserUpdateRequest: {
          firstName: firstName,
          lastName: lastName,
          dob: data.birth,
          gender: data.gender,
          roles: [],
        },
      };
      console.log(param);
      const response = await myUserControllerApi.updateMyUser(param, {
        headers: { Authorization: `Bearer ${appToken}` },
      });

      console.log("Successful update member info: ", response.data.result);
      setValue("permission", data.permission);
      setIsEditMode(false);
    } catch (error: any) {
      // console.error(error.response.data);
      setAlertMessage(error.response.data.message);
      setIsAlert(true);
    }
    setLoading((prev) => ({ ...prev, updateMem: false }));
  };

  // Handle update permission
  const handleSetPermission = async () => {
    if (loading.updateStatus) return;
    setLoading((prev) => ({ ...prev, updateStatus: true }));

    try {
      const response = await labMemberControllerApi.updateLabMemberStatus(
        {
          labMemberUpdateRequest: {
            labMemberKey: { labId: appLabId ?? "", myUserId: id as string },
            memberStatus: isActive ? "BLOCKED" : "ACTIVE",
          },
        },
        {
          headers: { Authorization: `Bearer ${appToken}` },
        }
      );

      console.log("Successful update status:", response.data);
      setIsActive(!isActive);
      setLoading((prev) => ({ ...prev, updateStatus: false }));
      setAlertMessage("Successful update status");
      setIsAlert(true);
    } catch {
      (error: any) => {
        setAlertMessage(error.response.data.message);
        setIsAlert(true);
      };
    }
  };

  // Handle refresh
  const onRefresh = useCallback(() => {
    if (isEditMode) return;
    handleGetDetailMember();
  }, [handleGetDetailMember, isEditMode]);

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
          Detail Information
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
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            refreshing={loading.getMem}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.container}>
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
                    mode="outlined"
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
                mode="outlined"
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
                    mode="outlined"
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
                    <Text
                      style={styles.error}
                    >{`${errors.birth.message}`}</Text>
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
                    mode="outlined"
                    // label="Gender"
                    placeholder="Gender"
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
                    <Text
                      style={styles.error}
                    >{`${errors.gender.message}`}</Text>
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
                    mode="outlined"
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
                    <Text
                      style={styles.error}
                    >{`${errors.email.message}`}</Text>
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
                Status
              </Text>
              {loading.updateStatus ? (
                <ActivityIndicator
                  animating={true}
                  size={16}
                  style={{ marginLeft: 10 }}
                />
              ) : (
                <Switch value={isActive} onValueChange={handleSetPermission} />
              )}
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.actionButtonContainer}>
            <Button
              labelStyle={{ fontFamily: "Poppins-Medium" }}
              mode="contained"
              style={[styles.actButton, { backgroundColor: "#FF6666" }]}
              onPress={() => setIsWarnDialog(true)}
            >
              Delete
            </Button>
            <Button
              labelStyle={{ fontFamily: "Poppins-Medium" }}
              mode="contained"
              disabled={!isEditMode}
              style={[styles.actButton]}
              onPress={handleSubmit(handleUpdateMem)}
              loading={loading.updateMem}
            >
              Apply
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* Alert Dialog */}
      <WarningDialog
        title="Confirm delete member?"
        visible={isWarnDialog}
        setVisible={setIsWarnDialog}
        onConfirm={handleDeleteMem}
      />

      {/* Snackbar */}
      <Snackbar
        visible={isAlert}
        onDismiss={() => setIsAlert(false)}
        duration={3000}
        action={{
          label: "Close",
          onPress: () => setIsAlert(false),
        }}
      >
        {alertMessage}
      </Snackbar>
    </View>
  );
};

export default UserDetailScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingBottom: 30,
    minHeight: "100%",
  },
  scrollView: {
    marginTop: 80,
    paddingBottom: 30,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    marginTop: 26,
  },
  formField: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
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
    height: 50,
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
