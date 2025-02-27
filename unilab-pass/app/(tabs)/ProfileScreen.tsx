// Core
import { ImageBackground, Modal, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Avatar,
  Button,
  Divider,
  Portal,
  Snackbar,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// App
import { useAuthStore, useUserStore } from "stores";
import {
  AuthenticationControllerApi,
  LaboratoryControllerApi,
  LaboratoryControllerApiUpdateLabRequest,
  LogoutRequest,
} from "api/index";
import { WarningDialog } from "components/CustomDialog";
import { LabInformationFormType } from "constants/userInfor.type";
import { LabInformationFormSchema } from "constants/userInfor.constant";

// Types
type Props = {};

// Component
const ProfileScreen = (props: Props) => {
  // States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPendingDelete, setIsPendingDelete] = useState<boolean>(false);
  const [isWarnDialog, setIsWarnDialog] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPendingUpdate, setIsPendingUpdate] = useState<boolean>(false);

  // Router
  const router = useRouter();

  // Store
  const { setAppIsLoggedIn, setAppToken, appToken } = useAuthStore();
  const { appUserName, appLabName, appLabId, setAppUser, appLabLocation } =
    useUserStore();

  // Server
  const authenticationControllerApi = new AuthenticationControllerApi();
  const laboratoryControllerApi = new LaboratoryControllerApi();

  // Forms
  // Lab information form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LabInformationFormType>({
    resolver: zodResolver(LabInformationFormSchema),
    defaultValues: {
      labName: appLabName ?? undefined,
      location: appLabLocation ?? undefined,
    },
  });

  // Methods
  // Handle delete lab
  const handleDeleteLab = async () => {
    if (isPendingDelete) return;
    setIsPendingDelete(true);
    const param = appLabId ?? "";
    await laboratoryControllerApi
      .deleteLab(
        { labId: param },
        { headers: { Authorization: `Bearer ${appToken}` } }
      )
      .then((response) => {
        console.log("Successful delete lab: ", response.data.result);
        setAppUser({ labId: undefined, labName: undefined });
        setIsWarnDialog(false);
        router.replace("/SelectLabScreen");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    setIsPendingDelete(false);
  };

  // Handle submit update lab info
  const handleSubmitLabInfoForm = async (data: LabInformationFormType) => {
    if (isPendingUpdate) return;
    setIsPendingUpdate(true);
    const param: LaboratoryControllerApiUpdateLabRequest = {
      labId: appLabId ?? "",
      labUpdateRequest: {
        name: data.labName,
        location: data.location,
      },
    };
    await laboratoryControllerApi
      .updateLab(param, { headers: { Authorization: `Bearer ${appToken}` } })
      .then((response) => {
        console.log("Successful update lab: ", response.data.result);
        setAppUser({ labName: data.labName, labLocation: data.location });
        setVisible(false);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setIsSnackBarVisible(true);
      });
    setIsPendingUpdate(false);
  };

  // Handle cancel modal
  const handleCancelModal = () => {
    setVisible(false);
    reset({
      labName: appLabName ?? "",
      location: appLabLocation ?? "",
    });
  };

  // Handle log out
  const handleLogout = async () => {
    const param: LogoutRequest = {
      token: appToken as string,
    };
    setIsLoading(true);
    await authenticationControllerApi
      .logout({ logoutRequest: param })
      .then((response) => {
        console.log("Log out successfully");
        setAppIsLoggedIn(false);
        setAppToken({ token: null });
        router.replace("/(auth)/LoginScreen");
      })
      .catch((error) => console.error(error));
    setIsLoading(false);
  };

  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background-without-logo.png")}
      style={[styles.background]}
    >
      {/* Title */}
      <View style={styles.titleContainer}>
        <Avatar.Image
          size={72}
          source={require("../../assets/images/profile-avatar.png")}
        />

        <Text variant="titleLarge" style={styles.adminName} numberOfLines={2}>
          {appUserName}
        </Text>
      </View>

      {/* Line */}
      <Divider
        style={{
          height: 1,
          marginVertical: 20,
          width: "100%",
        }}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Lab information */}
        <View style={styles.smallContainer}>
          <Text variant="titleMedium" style={styles.smallTitle}>
            Current Lab
          </Text>
          <View style={styles.smallBodyContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 4,
              }}
            >
              <Text
                variant="bodyMedium"
                style={[styles.smallBody, { maxWidth: 100 }]}
                numberOfLines={2}
              >
                {appLabName}
              </Text>
              <Text variant="bodyMedium" style={styles.smallBody}>
                -
              </Text>
              <TouchableRipple
                style={{
                  justifyContent: "center",
                }}
                onPress={() => setVisible(true)}
                rippleColor={"#fcfcfc"}
              >
                <Text
                  variant="bodyMedium"
                  style={[styles.smallBody, { color: "#1B61B5" }]}
                >
                  Change info
                </Text>
              </TouchableRipple>
            </View>
            <View>
              <TouchableRipple
                onPress={() => router.replace("/SelectLabScreen")}
                rippleColor={"#fcfcfc"}
              >
                <Text variant="bodyMedium" style={[styles.smallAction]}>
                  Switch Lab
                </Text>
              </TouchableRipple>
              <TouchableRipple
                rippleColor={"#fcfcfc"}
                onPress={() => setIsWarnDialog(true)}
              >
                <Text
                  variant="bodyMedium"
                  style={[styles.smallAction, { color: "#FF3333" }]}
                >
                  Delete Lab
                </Text>
              </TouchableRipple>
            </View>
          </View>
        </View>

        {/* Lab Mode */}
        <View style={styles.smallContainer}>
          <Text variant="titleMedium" style={styles.smallTitle}>
            Mode
          </Text>
          <View style={styles.smallBodyContainer}>
            <Text variant="bodyMedium" style={styles.smallBody}>
              Manage Lab Mode
            </Text>
            <TouchableRipple>
              <Text variant="bodyMedium" style={[styles.smallAction]}>
                Only scan mode
              </Text>
            </TouchableRipple>
          </View>
        </View>

        {/* Event */}
        <View style={styles.smallContainer}>
          <Text variant="titleMedium" style={styles.smallTitle}>
            Current Event
          </Text>
          <View style={styles.smallBodyContainer}>
            <Text variant="bodyMedium" style={styles.smallBody}>
              There is no event now
            </Text>
            <TouchableRipple>
              <Text variant="bodyMedium" style={[styles.smallAction]}>
                Add event
              </Text>
            </TouchableRipple>
          </View>
        </View>

        {/* Security */}
        <View style={styles.smallContainer}>
          <Text variant="titleMedium" style={styles.smallTitle}>
            Security
          </Text>
          <View style={styles.smallBodyContainer}>
            <Text variant="bodyMedium" style={styles.smallBody}>
              Password
            </Text>
            <TouchableRipple>
              <Text variant="bodyMedium" style={[styles.smallAction]}>
                Change password
              </Text>
            </TouchableRipple>
          </View>
        </View>

        {/* Log out */}
        <Button
          mode="contained"
          disabled={isLoading}
          style={{ marginTop: 47 }}
          contentStyle={{ backgroundColor: "#FF3333" }}
          labelStyle={{ fontFamily: "Poppins-Medium" }}
          onPress={handleLogout}
          loading={isLoading}
        >
          Log out
        </Button>
      </View>

      {/* Modal */}
      <Portal>
        <View style={[styles.portal, { display: visible ? "flex" : "none" }]}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              setVisible(!visible);
            }}
          >
            <View style={[styles.modalContainer]}>
              {/* Model Content */}
              <View style={styles.modalView}>
                {/* Title */}
                <Text
                  style={{ fontFamily: "Poppins-SemiBold" }}
                  variant="titleMedium"
                >
                  Lab information
                </Text>

                {/* Content */}
                <View
                  style={{
                    backgroundColor: "#fff",
                    flex: 1,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingHorizontal: 17,
                    paddingVertical: 10,
                    gap: 15,
                    borderRadius: 7,
                  }}
                >
                  {/* Form */}
                  {/* Lab name */}
                  <Controller
                    control={control}
                    name="labName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputForm}>
                        <TextInput
                          theme={{
                            colors: {
                              primary: "#2B56F0",
                              onSurfaceVariant: "#777",
                            },
                          }}
                          textColor="#333"
                          outlineColor="#F2F6FC"
                          outlineStyle={{ borderRadius: 5 }}
                          mode="outlined"
                          style={styles.inputField}
                          contentStyle={{ fontFamily: "Poppins-Regular" }}
                          label="Lab name"
                          onChangeText={onChange}
                          onBlur={onBlur}
                          value={value}
                          error={!!errors.labName}
                        />
                        {errors.labName && (
                          <Text
                            style={styles.error}
                          >{`${errors.labName.message}`}</Text>
                        )}
                      </View>
                    )}
                  />

                  {/* Lab location */}
                  <Controller
                    control={control}
                    name="location"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputForm}>
                        <TextInput
                          theme={{
                            colors: {
                              primary: "#2B56F0",
                              onSurfaceVariant: "#777",
                            },
                          }}
                          textColor="#333"
                          outlineColor="#F2F6FC"
                          outlineStyle={{ borderRadius: 5 }}
                          mode="outlined"
                          style={styles.inputField}
                          contentStyle={{ fontFamily: "Poppins-Regular" }}
                          label="Location"
                          onChangeText={onChange}
                          onBlur={onBlur}
                          value={value}
                          error={!!errors.location}
                        />
                        {errors.location && (
                          <Text
                            style={styles.error}
                          >{`${errors.location.message}`}</Text>
                        )}
                      </View>
                    )}
                  />
                </View>

                {/* Bottom button */}
                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    contentStyle={styles.buttonContent}
                    style={{ borderRadius: 4 }}
                    onPress={handleCancelModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    style={{ borderRadius: 4 }}
                    contentStyle={styles.buttonContent}
                    onPress={handleSubmit(handleSubmitLabInfoForm)}
                    loading={isPendingUpdate}
                  >
                    Apply
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </Portal>

      {/* Snackbar */}
      <Snackbar
        visible={isSnackBarVisible}
        onDismiss={() => setIsSnackBarVisible(false)}
        duration={3000}
        action={{
          label: "Close",
          onPress: () => setIsSnackBarVisible(false),
        }}
      >
        {errorMessage}
      </Snackbar>

      {/* Alert Dialog */}
      <WarningDialog
        title="Confirm delete lab?"
        visible={isWarnDialog}
        setVisible={setIsWarnDialog}
        onConfirm={handleDeleteLab}
      />
    </ImageBackground>
  );
};

export default ProfileScreen;

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 55,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "flex-start",
    alignSelf: "stretch",
    marginHorizontal: 30,
    alignItems: "center",
  },
  adminName: {
    fontFamily: "Poppins-SemiBold",
    maxWidth: 200,
    maxHeight: 60,
  },
  content: {
    flex: 1,
    minWidth: "88%",
    maxWidth: 333,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 25,
  },
  smallContainer: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: 5,
  },
  smallTitle: {
    fontFamily: "Poppins-Medium",
  },
  smallBodyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    alignSelf: "stretch",
  },
  smallBody: {
    fontFamily: "Poppins-Light",
  },
  smallAction: {
    fontFamily: "Poppins-Regular",
    color: "#1B61B5",
  },
  inputForm: {
    gap: 3,
  },
  inputField: {
    maxHeight: 77,
    width: 300,
    backgroundColor: "#F2F6FC",
  },
  portal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "#F5F5F5",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: 350,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 20,
    gap: 20,
  },
  buttonContainer: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginTop: "auto",
    alignSelf: "stretch",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContent: {
    width: 100,
  },
  error: {
    marginLeft: 2,
    color: "red",
    fontFamily: "Poppins-Light",
    fontSize: 12,
  },
});
