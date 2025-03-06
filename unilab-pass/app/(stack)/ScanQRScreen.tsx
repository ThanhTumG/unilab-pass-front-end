// Core
import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Snackbar,
  Text,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";

// App
import useBackHandler from "utils/useBackHandler";
import { useAuthStore, useUserStore } from "stores";
import {
  EventGuestControllerApi,
  LabMemberControllerApi,
  MyUserResponse,
} from "api/index";
import { isNumberCharList } from "lib/utils";
import useEventStore from "stores/useEventStore";

// Types
type Props = {};

// Component
const ScanScreen = (props: Props) => {
  // Stated
  const [idDetected, setIdDetected] = useState<string>();
  const [isPendingGetMem, setIsPendingGetMem] = useState<boolean>();
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);

  // Camera permission
  const [permission, requestPermission] = useCameraPermissions();

  // Router
  const router = useRouter();

  // Record type
  const { recordType } = useLocalSearchParams();

  // Server
  const labMemberControllerApi = new LabMemberControllerApi();
  const eventGuestControllerApi = new EventGuestControllerApi();

  // Store
  const { appToken } = useAuthStore();
  const { appLabId } = useUserStore();
  const { appIsEvent, appEventId } = useEventStore();

  // Methods
  // Handle get id
  const handleOnDetectId = (id: string) => {
    if (isNumberCharList(id)) {
      setIdDetected(id);
      return;
    }
    setAlertMessage("Wrong qr/barcode format");
    setIsAlert(true);
  };

  // Handle back
  useBackHandler(() => {
    router.replace("/(tabs)/RecordActivityScreen");
    return true;
  });

  // Effects
  useEffect(() => {
    if (!idDetected) return;

    const handleGetGuest = async () => {
      if (isPendingGetMem) return;
      setIsPendingGetMem(true);
      try {
        const response = await eventGuestControllerApi.getListEventGuests1(
          {
            eventId: appEventId ?? "",
            guestId: idDetected,
          },
          { headers: { Authorization: `Bearer ${appToken}` } }
        );

        console.log("Successful get guest:", response.data.result);
        router.replace({
          pathname: "/(stack)/ScanFaceScreen",
          params: {
            id: idDetected,
            firstName: response.data.result?.guestName,
            recordType,
          },
        });
      } catch (error: any) {
        setAlertMessage(error.response.data.message);
        setIsAlert(true);
      }
    };

    const handleGetDetailMember = async () => {
      if (isPendingGetMem) return;
      setIsPendingGetMem(true);
      try {
        const response = await labMemberControllerApi.getLabMemberDetailInfo(
          {
            labId: appLabId ?? "",
            memberId: idDetected,
          },
          { headers: { Authorization: `Bearer ${appToken}` } }
        );

        if (response.data.result?.status === "ACTIVE") {
          const { firstName, lastName, email, id }: MyUserResponse =
            response.data.result?.myUserResponse ?? {};
          router.replace({
            pathname: "/(stack)/ScanFaceScreen",
            params: { firstName, lastName, email, id, recordType },
          });
        } else {
          setAlertMessage("This member status is BLOCKED");
          setIsAlert(true);
        }
      } catch (error: any) {
        setAlertMessage(error.response.data.message);
        setIsAlert(true);
      }
      setIsPendingGetMem(false);
    };

    if (appIsEvent) {
      handleGetGuest();
      return;
    }
    handleGetDetailMember();
  }, [idDetected]);

  if (!permission) {
    // Camera permissions are still loading.
    return <ActivityIndicator animating={true} style={{ top: 100 }} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.message}>
          We need your permission to access the camera
        </Text>
        <Button onPress={requestPermission}>Grant permission</Button>
      </View>
    );
  }

  // Template
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <CameraView
        style={[StyleSheet.absoluteFillObject]}
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
});
