// Core
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Worklets } from "react-native-worklets-core";
import React, { useEffect, useRef, useState } from "react";
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
  useFrameProcessor,
} from "react-native-vision-camera";
import {
  Face,
  useFaceDetector,
  FaceDetectionOptions,
} from "react-native-vision-camera-face-detector";

// App
import { useAuthStore, useUserStore } from "stores";
import {
  LogControllerApi,
  LogControllerApiCreateNewLogRequest,
  ModelControllerApi,
  ModelControllerApiVerifyRequest,
} from "api/index";
import { checkFaceViewIsFrontal } from "lib/utils";
import { FaceScannerOverlay } from "components/ui/Overlay";
import { ErrorDialog, SuccessDialog } from "components/CustomDialog";
import useRecordStore from "stores/useRecordStore";
import useEventStore from "stores/useEventStore";

// Types
type Props = {};

interface VerifyResult {
  isIllegal: boolean;
  result: {
    code: number;
    samePerson: boolean;
  };
}

// Component
const ScanFaceScreen = (props: Props) => {
  // Stated
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [photoUri, setPhotoUri] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceMsg, setFaceMsg] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [isPostIllegalLog, setIsPostIllegalLog] = useState<boolean>(false);
  const [isSuccessDialog, setIsSuccessDialog] = useState<boolean>(false);
  const [isErrorDialog, setIsErrorDialog] = useState<boolean>(false);
  const [isVerifyErr, setIsVerifyErr] = useState<boolean>(false);
  const [isFailDialog, setIsFailDialog] = useState<boolean>(false);

  // Ref
  const camera = useRef<Camera>(null);

  // Time stamp
  const conditionStartTime = useRef<number | null>(null);

  // Face detect option config
  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: "fast",
    landmarkMode: "all",
    contourMode: "none",
  }).current;
  const device = useCameraDevice("front");
  const { detectFaces } = useFaceDetector(faceDetectionOptions);

  // Camera permission
  const { hasPermission, requestPermission } = useCameraPermission();

  // Router
  const router = useRouter();

  // Server
  const modelControllerApi = new ModelControllerApi();
  const logControllerApi = new LogControllerApi();

  // Store
  const { appToken } = useAuthStore();
  const { appLabId, setAppIsFetchedRecord, setAppIsFetchedMember } =
    useUserStore();
  const { appVisitorId, appRecordType, setAppRecord, removeAppRecord } =
    useRecordStore();
  const { appIsEvent } = useEventStore();

  // Methods
  // Handle take photo
  const handleTakePhoto = async () => {
    try {
      conditionStartTime.current = null;
      if (!camera.current || isCapturing) return;
      const photo = await camera.current.takePhoto();
      setIsCapturing(true);
      const newPhotoUri = "file://" + photo.path;
      setPhotoUri((prev) => [...prev, newPhotoUri]);
      console.log("Photo:", photo.path);
    } catch (error) {
      console.log("Camera Error:", error);
    }
  };

  // Handle post illegal log
  const handleIllegalRecord = async (token?: string) => {
    setIsPostIllegalLog(true);
    const finalToken = token || appToken;
    try {
      const file = {
        uri: photoUri[photoUri.length - 1],
        type: "image/jpeg",
        name: `${appVisitorId}_normal_record_photo.jpg`,
      };
      const param: LogControllerApiCreateNewLogRequest = {
        request: {
          labId: appLabId ?? "",
          userId: appVisitorId ?? "",
          recordType: appRecordType ?? undefined,
          logType: "ILLEGAL",
        },
        file: file,
      };
      console.log(param);
      await logControllerApi.createNewLog(param, {
        headers: { Authorization: `Bearer ${finalToken}` },
      });
      setIsFailDialog(true);
      setAppIsFetchedRecord(false);
      setAppIsFetchedMember(false);
      removeAppRecord();
    } catch (error: any) {
      if (error.response) {
        setAlertMessage(error.response.data.message);
        setIsAlert(true);
      }
    }
    setIsPostIllegalLog(false);
  };

  // Handle verify face
  const handleVerifyFace = async () => {
    if (isUpload || !photoUri[0]) return;
    setIsUpload(true);
    console.log(photoUri[0]);

    try {
      const fileUri = photoUri[photoUri.length - 1];
      const file = {
        uri: fileUri,
        type: "image/jpeg",
        name: `${appVisitorId}_photo.jpg`,
      };
      const param: ModelControllerApiVerifyRequest = {
        userId: appVisitorId ?? "",
        image1: file,
        labId: appLabId ?? "",
      };
      const response = await modelControllerApi.verify(param, {
        headers: {
          Authorization: `Bearer ${appToken}`,
        },
      });
      const isVerify = response.data.result as VerifyResult;
      if (isVerify.isIllegal) {
        const { appToken: latestToken } = useAuthStore.getState();
        handleIllegalRecord(latestToken ?? "");
      } else {
        if (isVerify?.result.samePerson) {
          setAppRecord({ recordImg: fileUri });
          setPhotoUri([]);
          setIsSuccessDialog(true);
        } else {
          setIsErrorDialog(true);
        }
      }
    } catch (error: any) {
      if (error.response) {
        console.log("Error:", error.response.data);
        setIsVerifyErr(true);
      }
    } finally {
      setIsUpload(false);
    }
  };

  // Handle detect face
  const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[]) => {
    if (!camera.current || isCapturing) return;
    const currentTime = Date.now();

    if (faces.length > 0) {
      const detectFace: Face = faces[0];

      if (checkFaceViewIsFrontal(detectFace)) {
        if (conditionStartTime.current === null) {
          conditionStartTime.current = currentTime;
        }
        const elapsedTime = currentTime - (conditionStartTime.current || 0);
        setFaceMsg("Keep your face steady");
        if (elapsedTime >= 1500) {
          console.log("snap");
          handleTakePhoto();
        }
      } else {
        setFaceMsg("Please center your face in the screen");
        conditionStartTime.current = null;
      }
    } else {
      setFaceMsg("Can't detect any face");
      conditionStartTime.current = null;
    }
  });

  // Handle save guest face if is event
  const handleSaveGuestFace = () => {
    if (!photoUri[0]) return;
    setAppRecord({ recordImg: photoUri[photoUri.length - 1] });
    setIsSuccessDialog(true);
  };

  // Handle verify face again
  const handleVerifyAgain = () => {
    setPhotoUri([]);
    setIsCapturing(false);
    setIsErrorDialog(false);
  };

  // Frame processor
  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      if (isCapturing || !isActive) return;
      const faces = detectFaces(frame);
      handleDetectedFaces(faces);
    },
    [handleDetectedFaces, isActive, isCapturing]
  );

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
    setIsActive(true);
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    if (!isCapturing) return;
    if (appIsEvent) handleSaveGuestFace();
    else handleVerifyFace();
  }, [isCapturing]);

  // If no permission
  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If no device
  if (!device) {
    return (
      <View style={styles.center}>
        <Text>No front camera available</Text>
      </View>
    );
  }

  // Finally
  return (
    <View style={styles.container}>
      {/* Camera */}
      <Camera
        ref={camera}
        photo={true}
        isMirrored
        style={[StyleSheet.absoluteFill]}
        device={device}
        isActive={isActive}
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
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
            {appIsEvent ? "Face capture " : "Face recognition"}
          </Text>
        </View>
      </View>

      {/* Overlay */}
      {<FaceScannerOverlay />}
      {/* Face message */}
      {!isCapturing && (
        <Text variant="bodyMedium" style={styles.faceMgs}>
          {faceMsg}
        </Text>
      )}

      {(isUpload || isPostIllegalLog) && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0, 0, 0, 0.57)",
              justifyContent: "center",
              alignItems: "center",
              gap: 7,
              zIndex: 50,
            },
          ]}
        >
          <ActivityIndicator color="#f6f6f6" animating={true} size={28} />
          <Text
            variant="bodyMedium"
            style={{ fontFamily: "Poppins-Regular", color: "#f6f6f6" }}
          >
            Waiting for verification...
          </Text>
        </View>
      )}

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

      {/* Success Dialog */}
      <SuccessDialog
        title={"Success"}
        content={
          appIsEvent
            ? "Take guest photo successfully"
            : "Verify face successfully"
        }
        visible={isSuccessDialog}
        setVisible={setIsSuccessDialog}
        onCloseDialog={() => router.push("/RecordScreen")}
      />

      {/* Error Dialog */}
      <ErrorDialog
        title="Failed"
        content={`Face verification failed, please try again.`}
        visible={isErrorDialog}
        setVisible={setIsErrorDialog}
        onConfirm={handleVerifyAgain}
      />

      {/* Error Dialog */}
      <ErrorDialog
        title="Error"
        content={"Something was wrong, please try again later."}
        visible={isVerifyErr}
        setVisible={setIsVerifyErr}
        onConfirm={() => {
          setIsVerifyErr(false), router.dismissAll();
        }}
        onCloseDialog={() => router.dismissAll()}
      />

      {/* Record Fail Dialog */}
      <ErrorDialog
        title="Error"
        content={
          "Face authentication failed too many times. Access temporarily locked."
        }
        visible={isFailDialog}
        setVisible={setIsFailDialog}
        onConfirm={() => {
          setIsFailDialog(false), router.dismissAll();
        }}
        onCloseDialog={() => router.dismissAll()}
      />
    </View>
  );
};

export default ScanFaceScreen;

// Styles
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fcfcfc",
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
  faceMgs: {
    fontFamily: "Poppins-Regular",
    position: "absolute",
    bottom: 85,
    color: "#FCFCFC",
  },
});
