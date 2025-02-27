// Core
import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button, IconButton, Text } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";

// App
import useBackHandler from "utils/useBackHandler";

// Types
type Props = {};

// Component
const ScanScreen = (props: Props) => {
  // Stated
  const [idDetected, setIdDetected] = useState<string>();

  // Camera permission
  const [permission, requestPermission] = useCameraPermissions();

  // Router
  const router = useRouter();

  // Record type
  const { recordType } = useLocalSearchParams();

  // Methods
  // Handle get id
  const handleOnDetectId = (id: string) => {
    setIdDetected(id);
  };

  // Handle back
  useBackHandler(() => {
    router.replace("/(tabs)/RecordActivityScreen");
    return true;
  });

  // Effects
  useEffect(() => {
    if (!idDetected) return;
    router.replace({
      pathname: "/(stack)/RecordScreen",
      params: { idDetected, recordType },
    });
  }, [idDetected]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>grant permission</Button>
      </View>
    );
  }

  // Template
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <CameraView
        style={[StyleSheet.absoluteFillObject]}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        facing={"back"}
        videoStabilizationMode="auto"
        onBarcodeScanned={({ data }) => handleOnDetectId(data)}
      >
        {/* Header */}
        <View
          style={{
            position: "absolute",
            zIndex: 10,
            top: 0,
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingVertical: 20,
          }}
        >
          {/* Go back button */}
          <IconButton
            icon={"close"}
            size={20}
            iconColor="#fff"
            style={styles.backBtn}
            onPress={() => router.replace("/(tabs)/RecordActivityScreen")}
          />
          {/* Title */}
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text variant="titleMedium" style={styles.title}>
              Scan QR/Barcode
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "flex-start",
  },
  backBtn: {
    position: "absolute",
    left: 10,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, .15)",
  },
  title: {
    fontFamily: "Poppins-Medium",
    backgroundColor: "rgba(255, 255, 255, .15)",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    color: "#fff",
    textAlign: "center",
  },

  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    maxHeight: 400,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
