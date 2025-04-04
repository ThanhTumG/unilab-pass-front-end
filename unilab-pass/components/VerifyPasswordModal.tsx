// Core
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  Portal,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";

// App
import { useAuthStore, useUserStore } from "stores";
import { VerifyPasswordFormType } from "constants/auth.type";
import {
  AuthenticationControllerApi,
  AuthenticationControllerApiCheckPasswordRequest,
} from "api/index";
import {
  DEFAULT_VERIFY_PASSWORD_FORM_VALUES,
  VerifyPasswordFormSchema,
} from "constants/auth.constant";

// Types
type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

// Component
const VerifyPasswordModal = ({ visible, setVisible }: Props) => {
  // States
  const [isHidePassword, setIsHidePassword] = useState<boolean>(true);
  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Router
  const router = useRouter();

  // Server
  const authenticationControllerApi = new AuthenticationControllerApi();

  // Store
  const { appToken } = useAuthStore();
  const { appIsOnlyScanMode, setAppIsOnlyScanMode } = useUserStore();

  // Forms
  // Lab information form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VerifyPasswordFormType>({
    resolver: zodResolver(VerifyPasswordFormSchema),
    defaultValues: DEFAULT_VERIFY_PASSWORD_FORM_VALUES,
  });

  // Methods
  // Handle verify password
  const handleVerifyPassword = async (data: VerifyPasswordFormType) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const param: AuthenticationControllerApiCheckPasswordRequest = {
        request: {
          password: data.password,
        },
      };
      await authenticationControllerApi.checkPassword(param, {
        headers: { Authorization: `Bearer ${appToken}` },
      });
      reset();
      router.replace("/(tabs)/(record)/RecordActivityScreen");
      setAppIsOnlyScanMode(!appIsOnlyScanMode);
      setVisible(false);
    } catch (error: any) {
      setAlertMessage(error.response.data.message);
      setIsSnackBarVisible(true);
    }
    setIsLoading(false);
  };

  // Handle cancel modal
  const handleCancelModal = () => {
    setVisible(false);
    reset();
  };

  // Template
  return (
    //Modal
    // Lab information
    <Portal>
      <View style={[styles.portal, { display: visible ? "flex" : "none" }]}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => setVisible(!visible)}
        >
          <View style={[styles.modalContainer]}>
            {/* Model Content */}
            <View style={styles.modalView}>
              {/* Close */}
              <IconButton
                icon={"close"}
                size={20}
                iconColor="#333"
                style={styles.backBtn}
                onPress={handleCancelModal}
              />
              {/* Title */}
              <View style={styles.titleContainer}>
                <Text
                  style={{ fontFamily: "Poppins-SemiBold" }}
                  variant="bodyLarge"
                >
                  Authentication
                </Text>
                <Text variant="bodySmall" style={styles.body}>
                  Please verify that it’s you
                </Text>
              </View>

              {/* Content */}
              <View style={styles.labInfoContainer}>
                {/* Form */}
                {/* Password */}
                <Controller
                  control={control}
                  name="password"
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
                        label="Password"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        secureTextEntry={isHidePassword}
                        right={
                          <TextInput.Icon
                            icon={isHidePassword ? "eye-off" : "eye"}
                            onPress={() => setIsHidePassword(!isHidePassword)}
                            color="#777"
                          />
                        }
                        error={!!errors.password}
                      />
                      {errors.password && (
                        <Text
                          style={styles.error}
                        >{`${errors.password.message}`}</Text>
                      )}
                    </View>
                  )}
                />
              </View>

              {/* Bottom button */}
              <Button
                mode="contained"
                style={styles.submitBtn}
                contentStyle={styles.buttonContent}
                onPress={handleSubmit(handleVerifyPassword)}
                loading={isLoading}
              >
                Verify
              </Button>
            </View>
          </View>
        </Modal>
      </View>

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
    </Portal>
  );
};

export default VerifyPasswordModal;

// Styles
const styles = StyleSheet.create({
  portal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  backBtn: {
    position: "absolute",
    top: 5,
    left: 5,
  },
  titleContainer: {
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 40,
    marginLeft: 10,
  },
  body: { fontFamily: "Poppins-Regular", color: "#888" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#FCFCFC",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 10,
    minHeight: 300,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 20,
  },
  submitBtn: {
    alignSelf: "flex-end",
    borderRadius: 4,
  },
  buttonContent: {
    width: 100,
  },
  labInfoContainer: {
    marginTop: 10,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
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
