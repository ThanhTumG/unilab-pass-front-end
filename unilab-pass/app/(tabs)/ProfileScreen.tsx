// Core
import {
  ImageBackground,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Avatar,
  Button,
  Divider,
  Portal,
  Snackbar,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// App
import { useAuthStore, useUserStore } from "stores";
import {
  AuthenticationControllerApi,
  EventControllerApi,
  LaboratoryControllerApi,
  LaboratoryControllerApiUpdateLabRequest,
  LogoutRequest,
} from "api/index";
import { WarningDialog } from "components/CustomDialog";
import { LabInformationFormType } from "constants/userInfor.type";
import { LabInformationFormSchema } from "constants/userInfor.constant";
import useEventStore from "stores/useEventStore";

// Types
type Props = {};

// Component
const ProfileScreen = (props: Props) => {
  // States
  const [loading, setLoading] = useState({
    logOut: false,
    updateLab: false,
    deleteLab: false,
    getEvent: false,
  });
  const [isWarnDialog, setIsWarnDialog] = useState<boolean>(false);
  const [confirmDelEventDialog, setConfirmDelEventDialog] =
    useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Router
  const router = useRouter();

  // Theme
  const theme = useTheme();

  // Store
  const { setAppIsLoggedIn, appToken, removeAppToken } = useAuthStore();
  const {
    appUserName,
    appLabName,
    appLabId,
    setAppUser,
    appLabLocation,
    removeAppUser,
  } = useUserStore();
  const {
    appEventName,
    appEventId,
    appIsEvent,
    setAppIsEvent,
    removeAppEvent,
    setAppEvent,
  } = useEventStore();

  // Server
  const authenticationControllerApi = new AuthenticationControllerApi();
  const laboratoryControllerApi = new LaboratoryControllerApi();
  const eventControllerApi = new EventControllerApi();

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
    if (loading.deleteLab) return;
    setLoading((prev) => ({ ...prev, deleteLab: true }));
    const param = appLabId ?? "";
    await laboratoryControllerApi
      .deleteLab(
        { labId: param },
        { headers: { Authorization: `Bearer ${appToken}` } }
      )
      .then((response) => {
        console.log("Successful delete lab: ", response.data.result);
        setAppUser({ labId: undefined, labName: undefined });
        setAppIsEvent(false);
        removeAppEvent();
        setIsWarnDialog(false);
        router.replace("/SelectLabScreen");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    setLoading((prev) => ({ ...prev, deleteLab: false }));
  };

  // Handle remove event
  const handleDeleteEvent = async () => {
    try {
      const response = await eventControllerApi.deleteEvent(
        { eventId: appEventId ?? "" },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );

      console.log("Successful delete event:", response.data.result);
      setAppIsEvent(false);
      removeAppEvent();
      setIsSnackBarVisible(true);
      setConfirmDelEventDialog(false);
      setAlertMessage("Successful delete event");
    } catch (error: any) {
      setAlertMessage(error.response.data.message);
      setIsSnackBarVisible(true);
    }
  };

  // Handle submit update lab info
  const handleSubmitLabInfoForm = async (data: LabInformationFormType) => {
    if (loading.updateLab) return;
    setLoading((prev) => ({ ...prev, updateLab: true }));
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
        setAlertMessage("Successful update lab");
        setIsSnackBarVisible(true);
      })
      .catch((error) => {
        setAlertMessage(error.response.data.message);
        setIsSnackBarVisible(true);
      });
    setLoading((prev) => ({ ...prev, updateLab: false }));
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
    if (loading.logOut) return;
    setLoading((prev) => ({ ...prev, logOut: true }));

    const param: LogoutRequest = {
      token: appToken as string,
    };
    await authenticationControllerApi
      .logout({ logoutRequest: param })
      .then((response) => {
        console.log("Log out successfully");
        setAppIsLoggedIn(false);
        setAppIsEvent(false);
        removeAppUser();
        removeAppEvent();
        removeAppToken();
        router.replace("/(auth)/LoginScreen");
      })
      .catch((error) => console.error(error));
    setLoading((prev) => ({ ...prev, logOut: false }));
  };

  // Handle switch lab
  const handleSwitchLab = () => {
    setAppIsEvent(false);
    removeAppEvent();
    router.replace("/SelectLabScreen");
  };

  // Handle get current event
  const handleGetCurrentEv = useCallback(async () => {
    if (loading.getEvent) return;
    setLoading((prev) => ({ ...prev, getEvent: true }));
    try {
      const { appToken } = useAuthStore.getState();
      const response = await eventControllerApi.getCurrentEvent(
        { labId: appLabId ?? "" },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );

      console.log("Success get current event:", response.data.result);
      const event = response.data.result;
      if (event?.id) {
        setAppIsEvent(true);
        setAppEvent({
          eventId: event.id,
          eventName: event.name,
          startTime: event.startTime,
          endTime: event.endTime,
        });
      }
    } catch (error: any) {
      console.error(error.response.data);
    }
    setLoading((prev) => ({ ...prev, getEvent: false }));
  }, [appToken]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    handleGetCurrentEv();
  }, [handleGetCurrentEv]);

  // Effects
  useFocusEffect(
    useCallback(() => {
      handleGetCurrentEv();
    }, [handleGetCurrentEv])
  );

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

        <Text variant="titleMedium" style={styles.adminName} numberOfLines={2}>
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

      <ScrollView
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            refreshing={loading.getEvent}
            onRefresh={onRefresh}
          />
        }
      >
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
              <View style={{ gap: 4 }}>
                <TouchableRipple
                  onPress={handleSwitchLab}
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 4,
                }}
              >
                <Text
                  variant="bodyMedium"
                  numberOfLines={2}
                  style={[styles.smallBody, { maxWidth: 100 }]}
                >
                  {appIsEvent ? appEventName : "No event now"}
                </Text>
                {appIsEvent && (
                  <>
                    <Text variant="bodyMedium" style={styles.smallBody}>
                      -
                    </Text>
                    <TouchableRipple
                      style={{
                        justifyContent: "center",
                      }}
                      onPress={() =>
                        router.replace("/(stack)/DetailEventScreen")
                      }
                      rippleColor={"#fcfcfc"}
                    >
                      <Text
                        variant="bodyMedium"
                        style={[styles.smallBody, { color: "#1B61B5" }]}
                      >
                        Detail info
                      </Text>
                    </TouchableRipple>
                  </>
                )}
              </View>

              {/* Add event button */}
              <View style={{ gap: 4 }}>
                <TouchableRipple
                  rippleColor={"#fcfcfc"}
                  onPress={() => router.replace("/(stack)/CreateEventScreen")}
                >
                  <Text variant="bodyMedium" style={styles.smallAction}>
                    Add event
                  </Text>
                </TouchableRipple>

                {appIsEvent && (
                  <TouchableRipple
                    rippleColor={"#fcfcfc"}
                    onPress={() => setConfirmDelEventDialog(true)}
                  >
                    <Text
                      variant="bodyMedium"
                      style={[styles.smallAction, { color: "#FF3333" }]}
                    >
                      Delete event
                    </Text>
                  </TouchableRipple>
                )}
              </View>
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
            disabled={loading.logOut}
            style={{ marginTop: 47 }}
            contentStyle={{ backgroundColor: "#FF3333" }}
            labelStyle={{ fontFamily: "Poppins-Medium" }}
            onPress={handleLogout}
            loading={loading.logOut}
          >
            Log out
          </Button>
        </View>
      </ScrollView>

      {/* Snackbar */}
      <Portal>
        <Snackbar
          visible={isSnackBarVisible}
          onDismiss={() => setIsSnackBarVisible(false)}
          duration={3000}
          action={{
            label: "Close",
            onPress: () => setIsSnackBarVisible(false),
          }}
        >
          {alertMessage}
        </Snackbar>
      </Portal>

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
                    loading={loading.updateLab}
                  >
                    Apply
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </Portal>

      {/* Alert Dialog */}
      <WarningDialog
        title="Confirm delete lab?"
        visible={isWarnDialog}
        setVisible={setIsWarnDialog}
        onConfirm={handleDeleteLab}
      />

      {/* Alert Dialog */}
      <WarningDialog
        title="Confirm delete event?"
        visible={confirmDelEventDialog}
        setVisible={setConfirmDelEventDialog}
        onConfirm={handleDeleteEvent}
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
    textAlign: "right",
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
