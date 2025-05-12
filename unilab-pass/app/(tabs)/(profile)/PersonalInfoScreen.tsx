// Core
import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import {
  Button,
  Portal,
  Snackbar,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

// App
import ScreenHeader from "components/ScreenHeader";
import { useAuthStore, useUserStore } from "stores";
import { PersonalInformationFormType } from "constants/userInfor.type";
import { PersonalInformationFormSchema } from "constants/userInfor.constant";
import {
  MyUserControllerApi,
  MyUserControllerApiUpdateMyUserRequest,
} from "api/index";
import { getFullName, splitFullName } from "lib/utils";

// Types
type Props = {};

// Component
const PersonalInfoScreen = (props: Props) => {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState("");
  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Store
  const { appUserPhotoURL, appUserId, appUserName, setAppUser } =
    useUserStore();

  // Server
  const myUserControllerApi = new MyUserControllerApi();

  // Forms
  // Lab information form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInformationFormType>({
    resolver: zodResolver(PersonalInformationFormSchema),
    defaultValues: {
      fullName: appUserName ?? undefined,
    },
  });

  // Methods
  //   Handle pick image
  const handlePickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // Handle update my user info
  const handleUpdateMyUser = async (data: PersonalInformationFormType) => {
    const { appToken } = useAuthStore.getState();
    if ((photoUri === "" && data.fullName === appUserName) || isLoading) return;
    setIsLoading(true);
    try {
      const file = {
        uri: photoUri,
        type: "image/jpeg",
        name: `${appUserId}_${Date.now()}_update_user_photo.jpg`,
      };
      const { firstName, lastName } = splitFullName(
        data.fullName ?? appUserName ?? ""
      );
      const param: MyUserControllerApiUpdateMyUserRequest = {
        userId: appUserId ?? "",
        request: {
          firstName: firstName,
          lastName: lastName,
        },
        file: photoUri ? file : undefined,
      };
      await myUserControllerApi.updateMyUser(param, {
        headers: { Authorization: `Bearer ${appToken}` },
      });
      handleGetMyInformation();
    } catch (err: any) {
      if (err.response) {
        setAlertMessage(err.response.data.message);
      } else {
        setAlertMessage("Something was wrong");
      }
      setIsSnackBarVisible(true);
      setIsLoading(false);
    }
  };

  // Handle get my info
  const handleGetMyInformation = async () => {
    const { appToken } = useAuthStore.getState();
    try {
      const response = await myUserControllerApi.getMyInfo({
        headers: { Authorization: `Bearer ${appToken}` },
      });
      const userData = response.data.result;
      console.log(response.data.result);
      setAppUser({
        userEmail: userData?.email,
        userId: userData?.id,
        userName: getFullName({
          lastName: userData?.lastName,
          firstName: userData?.firstName,
        }),
        userPhotoURL: userData?.photoURL,
      });
      setAlertMessage("Successfully update info");
      setIsSnackBarVisible(true);
    } catch (error: any) {
      setAlertMessage("Something was wrong");
      setIsSnackBarVisible(true);
    }
    setIsLoading(false);
  };

  // Template
  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader title="Personal Info" />

      {/* Avatar */}
      <TouchableRipple
        rippleColor={"#fcfcfc"}
        style={{
          borderRadius: 200,
          backgroundColor: "#e9e9e9",
          justifyContent: "center",
          overflow: "hidden",
          width: 186,
          height: 186,
        }}
        onPress={handlePickImage}
      >
        <Image
          style={{ width: 186, height: 186 }}
          source={
            photoUri
              ? photoUri
              : appUserPhotoURL
              ? appUserPhotoURL
              : require("../../../assets/images/profile-avatar.png")
          }
          contentFit="cover"
          transition={0}
        />
        {/* <Image
          style={{ width: 186, height: 186 }}
          source={
            photoUri
              ? { uri: photoUri, cache: "reload" }
              : appUserPhotoURL
              ? { uri: appUserPhotoURL, cache: "reload" }
              : require("../../../assets/images/profile-avatar.png")
          }
          defaultSource={require("../../../assets/images/profile-avatar.png")}
        /> */}
      </TouchableRipple>

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
              mode="flat"
              style={styles.inputField}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
              }}
              label="Full Name"
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

      {/* Act button */}
      <Button
        labelStyle={{ fontFamily: "Poppins-Medium" }}
        mode="contained"
        loading={isLoading}
        style={styles.actButton}
        onPress={handleSubmit(handleUpdateMyUser)}
      >
        Save
      </Button>

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
    </View>
  );
};

export default PersonalInfoScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 30,
    gap: 30,
    backgroundColor: "#fcfcfc",
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
    marginTop: "auto",
    borderRadius: 5,
    minWidth: 300,
    minHeight: 40,
  },
});
