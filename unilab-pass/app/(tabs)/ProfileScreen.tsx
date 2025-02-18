// Core
import { ImageBackground, StyleSheet, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import {
  Avatar,
  Button,
  Divider,
  Text,
  TouchableRipple,
} from "react-native-paper";

type Props = {};

// Component
const ProfileScreen = (props: Props) => {
  // Router
  const router = useRouter();

  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background-without-logo.png")}
      style={[styles.background]}
    >
      {/* Title */}
      <View style={styles.titleContainer}>
        <Avatar.Image
          size={72}
          source={require("../../assets/images/profile-avatar.png")}
        />

        <Text variant="titleLarge" style={styles.adminName}>
          Admin HPCC
        </Text>
      </View>

      {/* Line */}
      <Divider
        style={{
          height: 1,
          marginVertical: 20,
          width: "100%",
        }}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Lab information */}
        <View style={styles.smallContainer}>
          <Text variant="titleMedium" style={styles.smallTitle}>
            Current Lab
          </Text>
          <View style={styles.smallBodyContainer}>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Text variant="bodyMedium" style={styles.smallBody}>
                HPCC Lab
              </Text>
              <Text variant="bodyMedium" style={styles.smallBody}>
                -
              </Text>
              <TouchableRipple style={{ justifyContent: "center" }}>
                <Text
                  variant="bodySmall"
                  style={[styles.smallBody, { color: "#1B61B5" }]}
                >
                  Change name
                </Text>
              </TouchableRipple>
            </View>
            <TouchableRipple>
              <Text variant="bodyMedium" style={[styles.smallAction]}>
                Switch Lab
              </Text>
            </TouchableRipple>
          </View>
        </View>

        {/* Lab Mode */}
        <View style={styles.smallContainer}>
          <Text variant="titleMedium" style={styles.smallTitle}>
            Mode
          </Text>
          <View style={styles.smallBodyContainer}>
            <Text variant="bodyMedium" style={styles.smallBody}>
              Manage Lab Mode
            </Text>
            <TouchableRipple>
              <Text variant="bodyMedium" style={[styles.smallAction]}>
                Only scan mode
              </Text>
            </TouchableRipple>
          </View>
        </View>

        {/* Lab Mode */}
        <View style={styles.smallContainer}>
          <Text variant="titleMedium" style={styles.smallTitle}>
            Current Event
          </Text>
          <View style={styles.smallBodyContainer}>
            <Text variant="bodyMedium" style={styles.smallBody}>
              There is no event now
            </Text>
            <TouchableRipple>
              <Text variant="bodyMedium" style={[styles.smallAction]}>
                Add event
              </Text>
            </TouchableRipple>
          </View>
        </View>

        {/* Event */}
        <View style={styles.smallContainer}>
          <Text variant="titleMedium" style={styles.smallTitle}>
            Current Event
          </Text>
          <View style={styles.smallBodyContainer}>
            <Text variant="bodyMedium" style={styles.smallBody}>
              There is no event now
            </Text>
            <TouchableRipple>
              <Text variant="bodyMedium" style={[styles.smallAction]}>
                Add event
              </Text>
            </TouchableRipple>
          </View>
        </View>

        {/* Security */}
        <View style={styles.smallContainer}>
          <Text variant="titleMedium" style={styles.smallTitle}>
            Security
          </Text>
          <View style={styles.smallBodyContainer}>
            <Text variant="bodyMedium" style={styles.smallBody}>
              Password
            </Text>
            <TouchableRipple>
              <Text variant="bodyMedium" style={[styles.smallAction]}>
                Change password
              </Text>
            </TouchableRipple>
          </View>
        </View>

        {/* Log out */}
        <Button
          mode="contained"
          style={{ marginTop: 47 }}
          contentStyle={{ backgroundColor: "#FF3333" }}
          labelStyle={{ fontFamily: "Poppins-Medium" }}
          onPress={() => router.replace("/(auth)/LoginScreen")}
        >
          Log out
        </Button>
      </View>
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
    fontFamily: "Poppins-SemiBold",
  },
  content: {
    flex: 1,
    minWidth: "88%",
    maxWidth: 333,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 25,
  },
  smallContainer: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: 5,
  },
  smallTitle: {
    fontFamily: "Poppins-Medium",
  },
  smallBodyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
  smallBody: {
    fontFamily: "Poppins-Light",
  },
  smallAction: {
    fontFamily: "Poppins-Regular",
    color: "#1B61B5",
  },
});
