// Core
import { Image, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Button,
  TextInput,
  Text,
  TouchableRipple,
  Snackbar,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// App
import { LoginFormType } from "../../constants/auth.type";
import {
  DEFAULT_LOGIN_FORM_VALUES,
  LoginFormSchema,
} from "../../constants/auth.constant";
import {
  AuthenticationControllerApi,
  AuthenticationRequest,
  MyUserControllerApi,
} from "api/index";
import { useAuthStore, useUserStore } from "stores";
import { getFullName } from "lib/utils";

// Types
type Props = {};

// Component
const LoginScreen = (props: Props) => {
  // States
  const [isHidePassword, setIsHidePassword] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [visible, setVisible] = useState(false);

  // Router
  const router = useRouter();

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: DEFAULT_LOGIN_FORM_VALUES,
  });

  // Store
  const { setAppIsLoggedIn, setAppToken, appToken } = useAuthStore();
  const { setAppUser } = useUserStore();

  // Server
  const authenticationControllerApi = new AuthenticationControllerApi();
  const myUserControllerApi = new MyUserControllerApi();

  // Methods
  // Handle submit form
  const handleOnSubmit = async (data: LoginFormType) => {
    if (isLoading) return;

    const param: AuthenticationRequest = {
      email: data.email,
      password: data.password,
    };
    setIsLoading(true);
    await authenticationControllerApi
      .authenticate({ authenticationRequest: param })
      .then((response) => {
        console.info("Successful: ", response.data.result);
        const token = response.data.result?.token as string;
        handleGetMyInformation(token);
      })
      .catch((error) => {
        setErrorMessage("Email or Password is incorrect");
        setVisible(true);
      });
    setIsLoading(false);
  };

  // Handle get my information
  const handleGetMyInformation = async (token: string) => {
    await myUserControllerApi
      .getMyInfo({ headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log("Successful get my info: ", response.data.result);
        setAppUser({
          userEmail: response.data.result?.email,
          userId: response.data.result?.id,
          userName: getFullName({
            lastName: response.data.result?.lastName,
            firstName: response.data.result?.firstName,
          }),
        });
        setAppIsLoggedIn(true);
        setAppToken({ token: token });
        router.replace("/SelectLabScreen");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  // Handle sign up
  const handleSignup = () => {
    router.replace("/(auth)/SignUpScreen");
  };

  // Template
  return (
    <View style={[styles.container, styles.alignCenter]}>
      {/* Logo */}
      <Image
        style={styles.logo}
        source={require("assets/images/unilab-pass-logo.png")}
      />
      <View style={[styles.formField, styles.alignCenter]}>
        <Text variant="headlineLarge" style={styles.title}>
          Login
        </Text>

        {/* Form */}
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
          name="password"
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
                secureTextEntry={isHidePassword}
                right={
                  <TextInput.Icon
                    icon={isHidePassword ? "eye-off" : "eye"}
                    onPress={() => setIsHidePassword(!isHidePassword)}
                    color="#777"
                  />
                }
                label="Password"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={!!errors.password}
              />
              {errors.password && (
                <Text style={styles.error}>{`${errors.password.message}`}</Text>
              )}
            </View>
          )}
        />

        {/* Sign in button */}
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
          Sign In
        </Button>

        <View style={[{ flexDirection: "row" }, styles.alignCenter]}>
          <Text
            variant="bodySmall"
            style={{ fontFamily: "Poppins-Regular", color: "#444" }}
          >
            Don't have an account?
          </Text>

          {/* Sign up button */}
          <TouchableRipple
            onPress={handleSignup}
            rippleColor={"#FCFCFC"}
            style={{ marginLeft: 4 }}
          >
            <Text
              variant="bodySmall"
              style={{
                fontSize: 14,
                fontFamily: "Poppins-SemiBold",
                color: "#3385ff",
              }}
            >
              Sign Up
            </Text>
          </TouchableRipple>
        </View>
      </View>

      {/* Snackbar */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        action={{
          label: "Close",
          onPress: () => setVisible(false),
        }}
      >
        {errorMessage}
      </Snackbar>
    </View>
  );
};

export default LoginScreen;

// Styles
const styles = StyleSheet.create({
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingBottom: 200,
  },
  logo: { resizeMode: "contain", width: 183 },
  formField: {
    marginTop: 40,
    gap: 15,
    height: 200,
  },
  title: {
    fontFamily: "Poppins-Bold",
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
  submitButton: {
    borderRadius: 5,
    marginTop: 25,
  },
  error: {
    marginLeft: 2,
    color: "red",
    fontFamily: "Poppins-Light",
    fontSize: 12,
  },
});
