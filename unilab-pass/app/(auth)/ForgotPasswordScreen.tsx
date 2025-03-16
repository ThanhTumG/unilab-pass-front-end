// Core
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageBackground, StyleSheet, View } from "react-native";

// App
import { SuccessDialog } from "components/CustomDialog";
import {
  AuthenticationControllerApi,
  AuthenticationControllerApiSendResetPasswordRequest,
} from "api/index";
import { ForgotPasswordFormType } from "constants/auth.type";
import {
  DEFAULT_FORGOT_PASSWORD_FORM_VALUES,
  ForgotPasswordFormSchema,
} from "constants/auth.constant";

// Types
type Props = {};

// Component
const ForgotPasswordScreen = (props: Props) => {
  // States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccessDialog, setIsSuccessDialog] = useState<boolean>(false);

  // Server
  const authenticationControllerApi = new AuthenticationControllerApi();

  // Router
  const router = useRouter();

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: DEFAULT_FORGOT_PASSWORD_FORM_VALUES,
  });

  // Methods
  // Handle request password reset
  const handleRequestPasswordReset = async (data: ForgotPasswordFormType) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const param: AuthenticationControllerApiSendResetPasswordRequest = {
        request: {
          email: data.email,
        },
      };
      await authenticationControllerApi.sendResetPassword(param);
      setIsSuccessDialog(true);
    } catch (error: any) {
      console.error(error.response.data);
    }
    setIsLoading(false);
  };

  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Go back to sign in screen */}
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
            Forgot your password?
          </Text>
          <Text variant="bodySmall" style={styles.body}>
            Provide the email address linked with your account to reset your
            password
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formField}>
          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputForm}>
                <TextInput
                  theme={{
                    colors: { primary: "#2B56F0", onSurfaceVariant: "#777" },
                  }}
                  textColor="#333"
                  outlineColor="#F2F6FC"
                  outlineStyle={{ borderRadius: 5 }}
                  mode="outlined"
                  style={styles.inputField}
                  contentStyle={{ fontFamily: "Poppins-Regular" }}
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

          {/* Verify button */}
          <Button
            style={styles.submitButton}
            mode="contained"
            textColor="#F5F5F5"
            labelStyle={{ fontFamily: "Poppins-Medium", fontSize: 16 }}
            contentStyle={{ width: 300, height: 50 }}
            onPress={handleSubmit(handleRequestPasswordReset)}
            loading={isLoading}
          >
            Request Password Reset
          </Button>
        </View>
      </View>

      {/* Success Dialog */}
      <SuccessDialog
        title={"Success"}
        content="We have sent a reset password to your email"
        visible={isSuccessDialog}
        setVisible={setIsSuccessDialog}
        onCloseDialog={() => router.replace("/(auth)/LoginScreen")}
      />
    </ImageBackground>
  );
};

export default ForgotPasswordScreen;

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
  formField: {
    marginTop: 77,
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  body: { fontFamily: "Poppins-Regular", color: "#888" },
  titleContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "stretch",
    marginHorizontal: 25,
    gap: 15,
  },
  title: { fontFamily: "Poppins-SemiBold", width: 150 },
  inputForm: {
    gap: 3,
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
