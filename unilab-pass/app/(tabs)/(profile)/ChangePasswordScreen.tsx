// Core
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageBackground, StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";

// App
import { ChangePasswordFormType } from "constants/auth.type";
import { useAuthStore } from "stores";
import {
  AuthenticationControllerApi,
  AuthenticationControllerApiChangePasswordRequest,
} from "api/index";
import {
  ChangePasswordFormSchema,
  DEFAULT_CHANGE_PASSWORD_FORM_VALUES,
} from "constants/auth.constant";

// Types
type Props = {};

// Component
const ChangePasswordScreen = (props: Props) => {
  // States
  const [isHideNewPassword, setIsHideNewPassword] = useState<boolean>(false);
  const [isHideOldPassword, setIsHideOldPassword] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Router
  const router = useRouter();

  // Server
  const authenticationControllerApi = new AuthenticationControllerApi();

  // Store
  const { appToken } = useAuthStore();

  // Forms
  // Change password form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormType>({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: DEFAULT_CHANGE_PASSWORD_FORM_VALUES,
  });

  // Methods
  // Handle change password
  const handleChangePassword = async (data: ChangePasswordFormType) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const param: AuthenticationControllerApiChangePasswordRequest = {
        changePasswordRequest: {
          oldPassword: data.password.oldPassword,
          newPassword: data.password.newPassword,
        },
      };
      await authenticationControllerApi.changePassword(param, {
        headers: { Authorization: `Bearer ${appToken}` },
      });
      reset();
      setAlertMessage("Successfully change password");
      setIsAlert(true);
    } catch (error: any) {
      if (error.response.data.code === 1006) {
        setAlertMessage("Old password is entered incorrectly");
      } else {
        setAlertMessage("Something was wrong");
      }
      setIsAlert(true);
    }
    setIsLoading(false);
  };

  // Template
  return (
    <ImageBackground
      source={require("../../../assets/images/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <IconButton
          icon={"chevron-left"}
          style={{ position: "absolute", top: 10, left: 10 }}
          size={32}
          iconColor="#808080"
          onPress={() => router.back()}
        />

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text variant="titleLarge" style={styles.title}>
            Change your password
          </Text>
          <Text variant="bodySmall" style={styles.body}>
            Your new password must be different from previous used password.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formField}>
          {/* Old password */}
          <Controller
            control={control}
            name="password.oldPassword"
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
                  label="Old password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry={isHideOldPassword}
                  right={
                    <TextInput.Icon
                      icon={isHideOldPassword ? "eye-off" : "eye"}
                      onPress={() => setIsHideOldPassword(!isHideOldPassword)}
                      color="#777"
                    />
                  }
                  error={!!errors.password?.oldPassword}
                />
                {errors.password?.oldPassword && (
                  <Text
                    style={styles.error}
                  >{`${errors.password?.oldPassword.message}`}</Text>
                )}
              </View>
            )}
          />

          {/* New password */}
          <Controller
            control={control}
            name="password.newPassword"
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
                  label="New password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry={isHideNewPassword}
                  right={
                    <TextInput.Icon
                      icon={isHideNewPassword ? "eye-off" : "eye"}
                      onPress={() => setIsHideNewPassword(!isHideNewPassword)}
                      color="#777"
                    />
                  }
                  error={!!errors.password?.newPassword}
                />
                {errors.password?.newPassword && (
                  <Text
                    style={styles.error}
                  >{`${errors.password?.newPassword.message}`}</Text>
                )}
              </View>
            )}
          />

          {/* Verify button */}
          <Button
            style={styles.submitButton}
            mode="contained"
            textColor="#F5F5F5"
            labelStyle={{ fontFamily: "Poppins-Medium", fontSize: 16 }}
            contentStyle={{ width: 300, height: 50 }}
            onPress={handleSubmit(handleChangePassword)}
            loading={isLoading}
          >
            Create new password
          </Button>
        </View>
      </View>

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
    </ImageBackground>
  );
};

export default ChangePasswordScreen;

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 101,
  },
  body: { fontFamily: "Poppins-Regular", color: "#888" },
  titleContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "stretch",
    marginHorizontal: 25,
    gap: 15,
  },
  title: { fontFamily: "Poppins-SemiBold" },
  inputForm: {
    gap: 3,
  },
  formField: {
    marginTop: 47,
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  inputField: {
    maxHeight: 77,
    width: 300,
    backgroundColor: "#F2F6FC",
  },
  error: {
    marginLeft: 2,
    color: "red",
    fontFamily: "Poppins-Light",
    fontSize: 12,
  },
  submitButton: {
    borderRadius: 5,
    marginTop: 26,
    justifyContent: "center",
    alignItems: "center",
  },
});
