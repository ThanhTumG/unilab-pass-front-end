// Core
import { StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ActivityIndicator,
  IconButton,
  Snackbar,
  Text,
} from "react-native-paper";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

// App
import { getFullName, isNumberCharList } from "lib/utils";
import useEventStore from "stores/useEventStore";
import { useAuthStore, useUserStore } from "stores";
import { QRScannerOverlay } from "components/ui/Overlay";
import {
  EventGuestControllerApi,
  LabMemberControllerApi,
  MyUserResponse,
} from "api/index";
import useRecordStore from "stores/useRecordStore";

// Types
type Props = {};

// Component
const ScanQRScreen = (props: Props) => {
  // Stated
  const [idDetected, setIdDetected] = useState<string>();
  const [isPendingGetMem, setIsPendingGetMem] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState<boolean>(false);

  // Camera permission
  const { hasPermission, requestPermission } = useCameraPermission();

  // Router
  const router = useRouter();

  // Server
  const labMemberControllerApi = new LabMemberControllerApi();
  const eventGuestControllerApi = new EventGuestControllerApi();

  // Store
  const { appToken } = useAuthStore();
  const { appLabId } = useUserStore();
  const { appIsEvent, appEventId } = useEventStore();
  const { setAppRecord } = useRecordStore();

  // Code scanner
  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "code-128"],
    onCodeScanned: (codes) => {
      handleOnDetectId(codes[0].value);
    },
  });

  // Device mode
  const device = useCameraDevice("back");

  // Methods
  // Handle get id
  const handleOnDetectId = (id: string | undefined) => {
    if (!id || id === idDetected) return;
    if (isNumberCharList(id)) {
      setIdDetected(id);
      return;
    }
    setAlertMessage("Wrong qr/barcode format");
    setIsAlert(true);
  };

  // Handle route face recognition screen
  const handleRouteFaceReg = () => {
    router.push({
      pathname: "/ScanFaceScreen",
    });
  };

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
        setAppRecord({
          visitorId: idDetected,
          visitorName: response.data.result?.guestName,
        });
        handleRouteFaceReg();
      } catch (error: any) {
        if (error.response) {
          setAlertMessage(error.response.data.message);
          setIsAlert(true);
        }
      }
      setIsPendingGetMem(false);
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
          console.log("User is in lab");
          const { firstName, lastName, email, id }: MyUserResponse =
            response.data.result?.myUserResponse ?? {};
          setAppRecord({
            visitorId: id,
            visitorName: getFullName({ firstName, lastName }),
            visitorEmail: email,
          });
          handleRouteFaceReg();
        } else {
          setAlertMessage("This member status is BLOCKED");
          setIsAlert(true);
        }
      } catch (error: any) {
        if (error.response) {
          setAlertMessage(error.response.data.message);
          setIsAlert(true);
        }
      }
      setIsPendingGetMem(false);
    };

    if (appIsEvent) {
      handleGetGuest();
    } else handleGetDetailMember();

    setIdDetected(undefined);
  }, [idDetected]);

  // Effects
  // Request Permission on Mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then((granted) => {
        if (!granted) {
          setAlertMessage("Camera permission denied");
          setIsAlert(true);
        }
      });
    }
  }, [hasPermission, requestPermission]);

  useFocusEffect(
    useCallback(() => {
      setIdDetected(undefined);
    }, [])
  );

  // If no permission
  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Template
  return (
    <View style={StyleSheet.absoluteFillObject}>
      {device && (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            isActive
            device={device}
            codeScanner={codeScanner}
          />
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
              onPress={() => router.back()}
            />
            {/* Title */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text variant="titleMedium" style={styles.title}>
                Scan QR/Barcode
              </Text>
            </View>
          </View>
        </>
      )}

      {/* Overlay */}
      <QRScannerOverlay />

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

export default ScanQRScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "flex-start",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
