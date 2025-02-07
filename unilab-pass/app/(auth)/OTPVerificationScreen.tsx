// Core
import { StyleSheet, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Button, IconButton, Text } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { OtpInput } from "react-native-otp-entry";
import { useTimer } from "react-timer-hook";

// App
import { OTP_EXPIRED_DURATION_MILLISECONDS } from "constants/auth.constant";

// Types
type Props = {};

// Component
const OTPVerificationScreen = (props: Props) => {
  // States
  const [otpCode, setOtpCode] = useState<string>("");

  // Route
  const route = useRouter();

  // Timer
  const otpTimer = useTimer({
    expiryTimestamp: new Date(),
  });

  // Email
  const { email } = useLocalSearchParams();

  // Methods
  // Handle resend otp
  const handleResendOtp = () => {
    otpTimer.restart(new Date(Date.now() + OTP_EXPIRED_DURATION_MILLISECONDS));
  };
  // Handle on change otp
  const handleOnChangeOtp = (otp: string) => {
    setOtpCode(otp);
  };

  // Handle submit otp
  const handleSubmitOtpForm = () => {
    if (otpCode.length != 4) return;
    console.log(otpCode);
    console.log(otpTimer.totalSeconds);
    route.reload;
  };

  // Memos
  // Formatted otp countdown duration
  const formattedOtpCountdownDurationMemo = useMemo(() => {
    const minutes: number = Math.floor(otpTimer.totalSeconds / 60);
    const remainingSeconds: number = otpTimer.totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }, [otpTimer.totalSeconds]);

  // Is timer over
  const isTimerOverMemo = useMemo(() => {
    return otpTimer.totalSeconds === 0;
  }, [otpTimer.totalSeconds]);

  // Effects
  useEffect(() => {
    handleResendOtp();
  }, []);

  // Template
  return (
    <View style={styles.container}>
      {/* Go back to sign up screen */}
      <IconButton
        icon={"arrow-left-thin"}
        style={styles.backBtn}
        size={32}
        iconColor="#808080"
        onPress={
          () => route.replace("/SignUpScreen")
          // route.reload
        }
      ></IconButton>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text variant="bodyLarge" style={styles.title}>
          Verification Code
        </Text>
        <Text variant="bodySmall" style={styles.body}>
          We have sent the OTP verification code to email{" "}
          <Text style={styles.email}>{email}</Text>
        </Text>
      </View>

      {/* OTP */}
      <View style={styles.OTPContainer}>
        <OtpInput
          numberOfDigits={4}
          focusColor={"#3385FF"}
          focusStickBlinkingDuration={400}
          autoFocus={false}
          type="numeric"
          theme={{
            pinCodeContainerStyle: {
              backgroundColor: "#fcfcfc",
              width: 60,
              height: 65,
              borderRadius: 12,
            },
            pinCodeTextStyle: {
              fontFamily: "Poppins-Regular",
              color: "#333333",
            },
          }}
          onTextChange={handleOnChangeOtp}
        />

        <Text
          variant="titleSmall"
          style={{
            fontFamily: "Poppins-Regular",
            textAlign: "center",
            marginTop: 14,
            color: "#3385FF",
          }}
        >
          {formattedOtpCountdownDurationMemo}
        </Text>
      </View>

      {/* Verify Button */}
      <Button
        mode="contained"
        buttonColor="rgba(27, 97, 181, 0.89)"
        style={styles.verifyBtn}
        onPress={handleSubmitOtpForm}
        disabled={isTimerOverMemo}
        labelStyle={{ fontFamily: "Poppins-SemiBold", fontSize: 15 }}
      >
        Verify
      </Button>

      {/* Resend OTP */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 11 }}
      >
        <Text
          variant="bodySmall"
          style={{ fontFamily: "Poppins-Regular", color: "#888" }}
        >
          Didn't you receive any code?
        </Text>
        <Button
          labelStyle={{ fontFamily: "Poppins-Medium", fontSize: 14 }}
          style={{ justifyContent: "center" }}
          onPress={handleResendOtp}
        >
          Resend
        </Button>
      </View>
    </View>
  );
};

export default OTPVerificationScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 101,
  },
  backBtn: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "stretch",
    marginLeft: 30,
    gap: 3,
  },
  title: { fontFamily: "Poppins-SemiBold" },
  body: { fontFamily: "Poppins-Regular", color: "#888" },
  email: { fontFamily: "Poppins-Bold" },
  OTPContainer: {
    marginHorizontal: 35,
    marginTop: 40,
  },
  verifyBtn: {
    marginTop: 55,
    alignSelf: "stretch",
    marginHorizontal: 30,
    borderRadius: 20,
  },
});
