// Core
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Button, IconButton, Text } from "react-native-paper";
import { ImageBackground, StyleSheet, View } from "react-native";

// App
import { useUserStore } from "stores";
import useBackHandler from "utils/useBackHandler";
import VerifyPasswordModal from "components/VerifyPasswordModal";

// Types
type Props = {};

// Component
const RecordActivityScreen = (props: Props) => {
  // States
  const [isVerifyPassModal, setIsVerifyPassModal] = useState(false);

  // Route
  const router = useRouter();

  // Store
  const { appIsOnlyScanMode } = useUserStore();

  // Methods
  // handle back
  useBackHandler(() => {
    if (appIsOnlyScanMode) {
      return true;
    }
    router.back();
    return true;
  });

  // Handle route scan screen
  const handleRouteScanScreen = (isCheckIn: boolean) => {
    router.push({
      pathname: "/ScanQRScreen",
      params: { recordType: isCheckIn ? "CHECKIN" : "CHECKOUT" },
    });
  };

  // Template
  return (
    <ImageBackground
      source={require("../../../assets/images/background-without-logo.png")}
      style={[styles.background]}
    >
      {/* Exit mode button */}
      {appIsOnlyScanMode && (
        <IconButton
          icon={"chevron-left"}
          size={28}
          iconColor="#808080"
          style={{ position: "absolute", left: 10, zIndex: 10 }}
          onPress={() => setIsVerifyPassModal(true)}
        />
      )}

      {/* Title */}
      <Text variant="headlineLarge" style={styles.title}>
        {appIsOnlyScanMode ? "Only Scan Mode" : "Select Record Type"}
      </Text>

      {/* Action button */}
      <View style={[styles.actionBtnContainer, styles.alignCenter]}>
        <Button
          mode="outlined"
          style={{ borderRadius: 5, borderColor: "#44CC77", borderWidth: 1.25 }}
          textColor="#44CC77"
          contentStyle={{ width: 270, height: 55 }}
          buttonColor="rgba(204, 255, 204, .75)"
          onPress={() => handleRouteScanScreen(true)}
          icon={"home-import-outline"}
          labelStyle={{ fontSize: 24 }}
        >
          <Text
            variant="bodyLarge"
            style={[styles.buttonLabel, { color: "#44CC77" }]}
          >
            Check In
          </Text>
        </Button>
        <Button
          mode="outlined"
          style={{ borderRadius: 5, borderColor: "#FF6666", borderWidth: 1.25 }}
          textColor="#FF6666"
          buttonColor="rgba(255, 230, 230, .75)"
          contentStyle={{ width: 270, height: 55 }}
          icon={"home-export-outline"}
          labelStyle={{ fontSize: 24 }}
          onPress={() => handleRouteScanScreen(false)}
        >
          <Text
            variant="bodyLarge"
            style={[styles.buttonLabel, { color: "#FF6666" }]}
          >
            Check Out
          </Text>
        </Button>
      </View>

      {/* Verify password */}
      <VerifyPasswordModal
        visible={isVerifyPassModal}
        setVisible={setIsVerifyPassModal}
      />
    </ImageBackground>
  );
};

export default RecordActivityScreen;

// Styles
const styles = StyleSheet.create({
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 150,
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: "#1B61B5",
  },
  actionBtnContainer: {
    marginTop: 90,
    gap: 32,
  },
  buttonLabel: {
    fontFamily: "Poppins-SemiBold",
  },
});
