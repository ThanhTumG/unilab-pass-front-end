// Core
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { Button, TextInput } from "react-native-paper";

// App

// Types
type Props = {};

// Component
const Login = (props: Props) => {
  // States
  const [isHidePassword, setIsHidePassword] = useState<boolean>(true);

  // Template
  return (
    <KeyboardAvoidingView
      style={[styles.container, styles.alignCenter]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        style={styles.logo}
        source={require("assets/images/unilab-pass-logo.png")}
      />
      <View style={[styles.formField, styles.alignCenter]}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          textColor="#333333"
          outlineStyle={{ borderRadius: 5 }}
          outlineColor="#F2F6FC"
          activeOutlineColor="#2B56F0"
          mode="outlined"
          style={styles.inputField}
          contentStyle={{ fontFamily: "Poppins-Regular" }}
          label="Email"
        />
        <TextInput
          textColor="#333333"
          activeOutlineColor="#2B56F0"
          outlineColor="#F2F6FC"
          mode="outlined"
          outlineStyle={{ borderRadius: 5 }}
          style={styles.inputField}
          contentStyle={{ fontFamily: "Poppins-Regular" }}
          secureTextEntry={isHidePassword}
          right={
            <TextInput.Icon
              icon="eye"
              onPress={() => setIsHidePassword(!isHidePassword)}
              color={isHidePassword ? "" : "#555"}
            />
          }
          label="Password"
        />

        <Button
          style={[styles.submitButton, styles.alignCenter]}
          buttonColor="rgba(27, 97, 181, 0.89)"
          mode="contained"
          textColor="#F5F5F5"
          labelStyle={{ fontFamily: "Poppins-SemiBold", fontSize: 18 }}
        >
          Sign In
        </Button>

        <View style={[{ flexDirection: "row" }, styles.alignCenter]}>
          <Text style={{ fontFamily: "Poppins-Regular", color: "#444" }}>
            Don't have an account?
          </Text>
          <Button
            mode="text"
            style={{ margin: -5 }}
            labelStyle={{
              fontSize: 15,
              fontFamily: "Poppins-SemiBold",
              color: "#3385ff",
            }}
          >
            Sign Up
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

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
    fontSize: 30,
  },
  inputField: {
    maxHeight: 77,
    width: 300,
    backgroundColor: "#F2F6FC",
  },
  submitButton: {
    width: 300,
    height: 50,
    borderRadius: 5,
    marginTop: 25,
  },
});
