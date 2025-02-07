// Core
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import { Button, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { SignupFormType } from "constants/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DEFAULT_SIGNUP_FORM_VALUES,
  SignupFormSchema,
} from "constants/auth.constant";

// Types
type Props = {};
type DataType = {
  email: string;
  fullName: string;
  password: { confirm: string; default: string };
};

// Component
const SignUpScreen = (props: Props) => {
  // States
  const [isHideDefaultPassword, setIsHideDefaultPassword] =
    useState<boolean>(true);
  const [isHideConfirmPassword, setIsHideConfirmPassword] =
    useState<boolean>(true);

  // Router
  const router = useRouter();

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
  const handleOnSubmit = (data: DataType) => {
    // console.log(data);
    router.replace({
      pathname: "/OTPVerificationScreen",
      params: { email: data.email },
    });
  };

  // Template
  return (
    <KeyboardAvoidingView
      style={[styles.container, styles.alignCenter]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
                <Text style={styles.error}>{`${errors.fullName.message}`}</Text>
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

        {/* Sign in button */}
        <Button
          style={[styles.submitButton, styles.alignCenter]}
          buttonColor="rgba(27, 97, 181, 0.89)"
          mode="contained"
          textColor="#F5F5F5"
          labelStyle={{ fontFamily: "Poppins-SemiBold", fontSize: 18 }}
          contentStyle={{ width: 300, height: 50 }}
          onPress={handleSubmit(handleOnSubmit)}
          // onPress={handleOnSubmit}
        >
          Sign Up
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

// Styles
const styles = StyleSheet.create({
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
    height: 200,
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
