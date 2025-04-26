// Core
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";

// App
import useEventStore from "stores/useEventStore";
import { useAuthStore, useUserStore } from "stores";
import { WarningDialog } from "components/CustomDialog";
import { LabInformationFormType } from "constants/userInfor.type";
import { LabInformationFormSchema } from "constants/userInfor.constant";
import {
  LaboratoryControllerApi,
  LaboratoryControllerApiUpdateLabRequest,
} from "api/index";

// Types
type Props = {};

// Component
const LabManageScreen = (props: Props) => {
  // States
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isWarnDialog, setIsWarnDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState({
    updateLab: false,
    deleteLab: false,
  });

  // Router
  const router = useRouter();

  // Server
  const laboratoryControllerApi = new LaboratoryControllerApi();

  // Store
  const { appLabId, appLabName, appLabLocation, setAppUser } = useUserStore();
  const { setAppIsEvent, removeAppEvent } = useEventStore();

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
  // Handle submit update lab info
  const handleSubmitLabInfoForm = async (data: LabInformationFormType) => {
    const { appToken } = useAuthStore.getState();
    if (isLoading.updateLab) return;
    setIsLoading((prev) => ({ ...prev, updateLab: true }));
    try {
      const param: LaboratoryControllerApiUpdateLabRequest = {
        labId: appLabId ?? "",
        labUpdateRequest: {
          name: data.labName,
          location: data.location,
        },
      };
      await laboratoryControllerApi.updateLab(param, {
        headers: { Authorization: `Bearer ${appToken}` },
      });
      setAppUser({ labName: data.labName, labLocation: data.location });
      setAlertMessage("Successfully update lab");
      setIsSnackBarVisible(true);
      setIsEditMode(false);
    } catch (error: any) {
      setAlertMessage(error.response.data.message);
      setIsSnackBarVisible(true);
    }
    setIsLoading((prev) => ({ ...prev, updateLab: false }));
  };

  // Handle delete lab
  const handleDeleteLab = async () => {
    const { appToken } = useAuthStore.getState();
    if (isLoading.deleteLab) return;
    setIsLoading((prev) => ({ ...prev, deleteLab: true }));
    const param = appLabId ?? "";
    await laboratoryControllerApi
      .deleteLab(
        { labId: param },
        { headers: { Authorization: `Bearer ${appToken}` } }
      )
      .then((response) => {
        setAppUser({ labId: undefined, labName: undefined });
        setAppIsEvent(false);
        removeAppEvent();
        setIsWarnDialog(false);
        router.replace("/SelectLabScreen");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    setIsLoading((prev) => ({ ...prev, deleteLab: false }));
  };

  // handle toggle edit mode
  const handleToggleEdit = () => {
    if (isEditMode) reset();
    setIsEditMode(!isEditMode);
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
          style={{ position: "absolute", left: 10, zIndex: 10 }}
          size={32}
          iconColor="#808080"
          onPress={() => router.back()}
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
          Lab Information
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Form */}
          <View style={styles.formField}>
            {/* LabName */}
            <Controller
              control={control}
              name="labName"
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
                    label="Lab Name"
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

            {/* Location */}
            <Controller
              control={control}
              name="location"
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
                    label="Lab Location"
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

          {/* Action Button */}
          <View style={{ gap: 17 }}>
            <Button
              labelStyle={{ fontFamily: "Poppins-Medium" }}
              mode="contained"
              disabled={!isEditMode}
              style={styles.actButton}
              onPress={handleSubmit(handleSubmitLabInfoForm)}
              loading={isLoading.updateLab}
            >
              Save
            </Button>
            <Button
              labelStyle={{ fontFamily: "Poppins-Medium", color: "#d32f2f" }}
              mode="outlined"
              rippleColor={"transparent"}
              style={[styles.actButton, { borderColor: "#d32f2f" }]}
              onPress={() => setIsWarnDialog(true)}
              loading={isLoading.deleteLab}
            >
              Delete
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* Alert Dialog */}
      <WarningDialog
        title="Warning"
        content="Are you sure you want to delete this lab?"
        visible={isWarnDialog}
        setVisible={setIsWarnDialog}
        onConfirm={handleDeleteLab}
      />

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
        {alertMessage}
      </Snackbar>
    </View>
  );
};

export default LabManageScreen;

// Styles
const styles = StyleSheet.create({
  scrollView: {
    marginTop: 80,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingBottom: 30,
    minHeight: "100%",
  },
  formField: {
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
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
  actButton: {
    borderRadius: 5,
    minWidth: 300,
    minHeight: 40,
  },
});
