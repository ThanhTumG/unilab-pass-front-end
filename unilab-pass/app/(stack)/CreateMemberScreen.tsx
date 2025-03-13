// Core
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dropdown } from "react-native-paper-dropdown";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";

// App
import { splitFullName } from "lib/utils";
import useBackHandler from "utils/useBackHandler";
import { WarningDialog } from "components/CustomDialog";
import { DetailUserInformationFormType } from "constants/userInfor.type";
import {
  DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES,
  DetailUserInformationFormSchema,
} from "constants/userInfor.constant";
import {
  CustomDropdownInput,
  CustomDropdownItem,
} from "components/CustomDropdown";
import { useAuthStore, useUserStore } from "stores";
import {
  LabMemberControllerApi,
  LabMemberControllerApiAddLabMemberRequest,
  MyUserControllerApi,
  MyUserControllerApiUpdateMyUserRequest,
} from "api/index";

// Types
type Props = {};

// Options
const OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

// Component
const CreateMemberScreen = (props: Props) => {
  // States
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isWarnDialog, setIsWarnDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState({
    createMem: false,
    updateMem: false,
  });

  // Router
  const router = useRouter();

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

  // handle submit form
  const handleAddMember = async (data: DetailUserInformationFormType) => {
    if (loading.createMem) return;
    setLoading((prev) => ({ ...prev, createMem: true }));
    const { firstName, lastName } = splitFullName(data.fullName);
    const param: LabMemberControllerApiAddLabMemberRequest = {
      request: {
        labId: appLabId ?? "",
        userId: data.id,
        dob: data.birth,
        gender: data.gender,
        email: data.email,
        firstName: firstName,
        lastName: lastName,
        role: "MEMBER",
      },
    };
    try {
      const response = await labMemberControllerApi.addLabMember(param, {
        headers: { Authorization: `Bearer ${appToken}` },
      });
      console.log("Successful create member: ", response.data.result);
      setAlertMessage("Successful create member");
      setIsAlert(true);
      reset();
    } catch (error: any) {
      const errLog = error.response.data;
      if (errLog.code === 1018) {
        setLoading((prev) => ({ ...prev, createMem: false }));
        setIsWarnDialog(true);
        return;
      }
      setAlertMessage(error.response.data.message);
      setIsAlert(true);
    }
    setLoading((prev) => ({ ...prev, createMem: false }));
  };

  // Handle update member info
  const handleUpdateMem = async (data: DetailUserInformationFormType) => {
    if (loading.updateMem) return;
    setLoading((prev) => ({ ...prev, updateMem: true }));
    try {
      const { firstName, lastName } = splitFullName(data.fullName);
      const param: MyUserControllerApiUpdateMyUserRequest = {
        userId: data.id,
        myUserUpdateRequest: {
          firstName: firstName,
          lastName: lastName,
          dob: data.birth,
          gender: data.gender,
          roles: [],
        },
      };
      await myUserControllerApi.updateMyUser(param, {
        headers: { Authorization: `Bearer ${appToken}` },
      });

      await handleAddMember(data);

      setAlertMessage("Successful create member");
      setIsAlert(true);
    } catch (error: any) {
      setAlertMessage(error.response.data.message);
      setIsAlert(true);
    }
    setIsWarnDialog(false);
    setLoading((prev) => ({ ...prev, createMem: false, updateMem: false }));
  };

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
          size={32}
          iconColor="#808080"
          style={{ position: "absolute", left: 10, zIndex: 10 }}
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
          Create Member
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.formField}>
            <Text
              variant="titleMedium"
              style={{
                fontFamily: "Poppins-SemiBold",
                alignSelf: "flex-start",
              }}
            >
              Detail information
            </Text>

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
                    textColor="#333"
                    mode="outlined"
                    style={styles.inputField}
                    contentStyle={{
                      fontFamily: "Poppins-Regular",
                      marginTop: 8,
                    }}
                    label="Fullname"
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
            <Controller
              control={control}
              name="id"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    theme={{
                      colors: {
                        primary: "#2B56F0",
                        onSurfaceVariant: "#777",
                      },
                    }}
                    textColor="#333"
                    mode="outlined"
                    style={styles.inputField}
                    contentStyle={{
                      fontFamily: "Poppins-Regular",
                      marginTop: 8,
                    }}
                    label="ID"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={!!errors.id}
                  />
                  {errors.id && (
                    <Text style={styles.error}>{`${errors.id.message}`}</Text>
                  )}
                </View>
              )}
            />

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
                    placeholder="YYYY-MM-DD"
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

            {/* Gender */}
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <View style={{ marginTop: 8 }}>
                  <Dropdown
                    mode="outlined"
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
          </View>

          {/* <View style={{ marginTop: 37, gap: 10 }}>
            <Text
              variant="titleMedium"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Face Authentication
            </Text>
            <TouchableRipple
              style={styles.faceAuth}
              onPress={() => {
                console.log("ngan");
              }}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Icon
                  source={"plus-circle-outline"}
                  color="#A6A6A6"
                  size={30}
                />
                <Text
                  variant="bodySmall"
                  style={{ fontFamily: "Poppins-Regular", color: "#A6A6A6" }}
                >
                  click here to scan face
                </Text>
              </View>
            </TouchableRipple>
          </View> */}

          {/* Action Button */}
          <Button
            labelStyle={{ fontFamily: "Poppins-Medium" }}
            mode="contained"
            style={styles.actButton}
            onPress={handleSubmit(handleAddMember)}
            loading={loading.createMem}
          >
            Create
          </Button>
        </View>
      </ScrollView>

      {/* Alert Dialog */}
      <WarningDialog
        title="Warning"
        content={`There is already a member with this id and email in another lab, do you want to update member info?`}
        visible={isWarnDialog}
        setVisible={setIsWarnDialog}
        onConfirm={handleSubmit(handleUpdateMem)}
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

export default CreateMemberScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "100%",
  },
  scrollView: {
    marginTop: 80,
    paddingBottom: 30,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    textAlign: "center",
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -50 }],
    padding: 10,
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

  faceAuth: {
    width: 300,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#A6A6A6",
    borderRadius: 5,
  },
  actButton: {
    marginTop: 80,
    borderRadius: 5,
    minWidth: 300,
    minHeight: 40,
  },
});
