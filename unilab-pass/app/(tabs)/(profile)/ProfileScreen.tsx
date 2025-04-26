// Core
import React, { useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Avatar,
  Button,
  Divider,
  Portal,
  Snackbar,
  Text,
} from "react-native-paper";

// App
import ProfileItem from "components/ProfileItem";
import useEventStore from "stores/useEventStore";
import useRecordStore from "stores/useRecordStore";
import { useAuthStore, useUserStore } from "stores";
import VerifyPasswordModal from "components/VerifyPasswordModal";
import { AuthenticationControllerApi, LogoutRequest } from "api/index";

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
  const [isVerifyPassModal, setIsVerifyPassModal] = useState(false);
  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Router
  const router = useRouter();

  // Store
  const { appToken, removeAppToken } = useAuthStore();
  const { appUserName, removeAppUser, resetAllFetchStatus } = useUserStore();
  const { removeAppEvent } = useEventStore();
  const { removeAppRecord } = useRecordStore();

  // Server
  const authenticationControllerApi = new AuthenticationControllerApi();

  // Methods
  // Handle log out
  const handleLogout = async () => {
    if (loading.logOut) return;
    setLoading((prev) => ({ ...prev, logOut: true }));

    const param: LogoutRequest = {
      token: appToken as string,
    };
    try {
      await authenticationControllerApi.logout({ logoutRequest: param });
      console.log("Log out successfully");
      removeAppRecord();
      removeAppUser();
      removeAppEvent();
      removeAppToken();
      router.replace("/(auth)/LoginScreen");
    } catch (error: any) {
      setAlertMessage(error.response.data.message);
      setIsSnackBarVisible(true);
    }
    setLoading((prev) => ({ ...prev, logOut: false }));
  };

  // Handle switch lab
  const handleSwitchLab = () => {
    removeAppRecord();
    removeAppEvent();
    resetAllFetchStatus();
    router.replace("/SelectLabScreen");
  };

  // Handle route change password
  const handleChangePassword = () => {
    router.push("/ChangePasswordScreen");
  };

  // Handle change scan mode
  const handleChangeMode = () => {
    setIsVerifyPassModal(true);
  };

  // Template
  return (
    <ImageBackground
      source={require("../../../assets/images/background-without-logo.png")}
      style={[styles.background]}
    >
      {/* Title */}
      <View style={styles.titleContainer}>
        <Avatar.Image
          size={72}
          source={require("../../../assets/images/profile-avatar.png")}
        />

        <Text variant="bodyLarge" style={styles.adminName} numberOfLines={2}>
          {appUserName}
        </Text>
      </View>

      {/* Line */}
      <Divider
        style={{
          height: 1,
          marginTop: 20,
          width: "100%",
        }}
      />

      {/* Content */}
      <ScrollView style={{ alignSelf: "stretch" }}>
        <View style={styles.content}>
          <ProfileItem title="Only Scan Mode" onPress={handleChangeMode} />

          <ProfileItem title="Switch Lab" onPress={handleSwitchLab} />

          <ProfileItem
            title="Lab Information"
            onPress={() => router.push("/LabManageScreen")}
          />

          <ProfileItem
            title="Manage Event"
            onPress={() => router.push("/EventViewScreen")}
          />

          <ProfileItem title="Change Password" onPress={handleChangePassword} />

          {/* Log out */}
          <Button
            mode="contained"
            disabled={loading.logOut}
            style={{ marginTop: 47 }}
            contentStyle={{ backgroundColor: "#FF6666" }}
            labelStyle={{ fontFamily: "Poppins-Medium" }}
            onPress={handleLogout}
            loading={loading.logOut}
          >
            Log out
          </Button>
        </View>
      </ScrollView>

      {/* Verify password */}
      <VerifyPasswordModal
        visible={isVerifyPassModal}
        setVisible={setIsVerifyPassModal}
      />

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
    fontFamily: "Poppins-Medium",
    maxWidth: 133,
    maxHeight: 62,
  },
  content: {
    marginTop: 10,
    paddingHorizontal: 15,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
    paddingBottom: 83,
  },
});
