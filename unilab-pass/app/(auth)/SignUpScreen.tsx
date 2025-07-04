// Core
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  IconButton,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";

// App
import { splitFullName } from "lib/utils";
import { SignupFormType } from "constants/auth.type";
import { MyUserControllerApi, MyUserCreationRequest } from "api/index";
import {
  DEFAULT_SIGNUP_FORM_VALUES,
  SignupFormSchema,
} from "constants/auth.constant";

// Types
type Props = {};

// Component
const SignUpScreen = (props: Props) => {
  // States
  const [isHideDefaultPassword, setIsHideDefaultPassword] =
    useState<boolean>(true);
  const [isHideConfirmPassword, setIsHideConfirmPassword] =
    useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);

  // Router
  const router = useRouter();

  // Server
  const myUserControllerApi = new MyUserControllerApi();

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormType>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: DEFAULT_SIGNUP_FORM_VALUES,
  });

  // Methods
  // Handle submit form
  const handleOnSubmit = async (data: SignupFormType) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { firstName, lastName } = splitFullName(data.fullName);
      const param: MyUserCreationRequest = {
        email: data.email,
        password: data.password.default,
        firstName: firstName,
        lastName: lastName,
      };
      await myUserControllerApi
        .createMyUser({ myUserCreationRequest: param })
        .then(() => {
          console.info("Successfully sign up");
          router.push({
            pathname: "/OTPVerificationScreen",
            params: { email: data.email },
          });
        });
    } catch (error: any) {
      if (error.response) {
        setAlertMessage(error.response.data.message);
        setIsAlert(true);
      }
    }
    setIsLoading(false);
  };

  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
    >
      <View style={[styles.container, styles.alignCenter]}>
        {/* Go back to sign up screen */}
        <IconButton
          icon={"chevron-left"}
          style={{ position: "absolute", top: 10, left: 10 }}
          size={32}
          iconColor="#808080"
          onPress={() => router.back()}
        ></IconButton>

        <View style={[styles.formField, styles.alignCenter]}>
          <Text variant="headlineLarge" style={styles.title}>
            Create account
          </Text>

          {/* Form */}
          {/* Fullname */}
          <Controller
            control={control}
            name="fullName"
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

          {/* Password */}
          <Controller
            control={control}
            name="password.default"
            render={({ field: { onBlur, onChange, value } }) => (
              <View style={styles.inputForm}>
                <TextInput
                  theme={{
                    colors: { primary: "#2B56F0", onSurfaceVariant: "#777" },
                  }}
                  textColor="#333"
                  outlineColor="#F2F6FC"
                  mode="outlined"
                  outlineStyle={{ borderRadius: 5 }}
                  style={styles.inputField}
                  contentStyle={{ fontFamily: "Poppins-Regular" }}
                  secureTextEntry={isHideDefaultPassword}
                  right={
                    <TextInput.Icon
                      icon={isHideDefaultPassword ? "eye-off" : "eye"}
                      onPress={() =>
                        setIsHideDefaultPassword(!isHideDefaultPassword)
                      }
                      color="#777"
                    />
                  }
                  label="Password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={!!errors.password?.default}
                />
                {errors.password?.default && (
                  <Text
                    style={styles.error}
                  >{`${errors.password.default.message}`}</Text>
                )}
              </View>
            )}
          />

          {/* Confirm Password */}
          <Controller
            control={control}
            name="password.confirm"
            render={({ field: { onBlur, onChange, value } }) => (
              <View style={styles.inputForm}>
                <TextInput
                  theme={{
                    colors: { primary: "#2B56F0", onSurfaceVariant: "#777" },
                  }}
                  textColor="#333"
                  outlineColor="#F2F6FC"
                  mode="outlined"
                  outlineStyle={{ borderRadius: 5 }}
                  style={styles.inputField}
                  contentStyle={{ fontFamily: "Poppins-Regular" }}
                  secureTextEntry={isHideConfirmPassword}
                  right={
                    <TextInput.Icon
                      icon={isHideConfirmPassword ? "eye-off" : "eye"}
                      onPress={() =>
                        setIsHideConfirmPassword(!isHideConfirmPassword)
                      }
                      color="#777"
                    />
                  }
                  label="Confirm Password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={!!errors.password?.confirm}
                />
                {errors.password?.confirm && (
                  <Text
                    style={styles.error}
                  >{`${errors.password.confirm.message}`}</Text>
                )}
              </View>
            )}
          />

          {/* Sign up button */}
          <Button
            style={[styles.submitButton, styles.alignCenter]}
            buttonColor="rgba(27, 97, 181, 0.89)"
            mode="contained"
            textColor="#F5F5F5"
            labelStyle={{ fontFamily: "Poppins-SemiBold", fontSize: 18 }}
            contentStyle={{ width: 300, height: 50 }}
            onPress={handleSubmit(handleOnSubmit)}
            loading={isLoading}
          >
            Sign Up
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

export default SignUpScreen;

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  logo: { resizeMode: "contain", width: 183 },
  formField: {
    marginTop: 40,
    gap: 15,
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: "#1B61B5",
  },
  submitButton: {
    borderRadius: 5,
    marginTop: 30,
  },
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
});
