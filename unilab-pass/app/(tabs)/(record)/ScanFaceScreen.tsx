// Core
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
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
  EventLogControllerApi,
  EventLogControllerApiAddEventLogRequest,
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

// Audio
const audioSource = require("../../../assets/sounds/doorbell-tone.mp3");

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
  const [isSuccessDialog, setIsSuccessDialog] = useState<boolean>(false);
  const [isErrorDialog, setIsErrorDialog] = useState<boolean>(false);
  const [isVerifyErr, setIsVerifyErr] = useState<boolean>(false);
  const [isFailDialog, setIsFailDialog] = useState<boolean>(false);
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "front"
  );
  const [sound, setSound] = useState<Audio.Sound>();

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
  const device = useCameraDevice(cameraPosition);
  const { detectFaces } = useFaceDetector(faceDetectionOptions);

  // Camera permission
  const { hasPermission, requestPermission } = useCameraPermission();

  // Router
  const router = useRouter();

  // Server
  const modelControllerApi = new ModelControllerApi();
  const eventLogControllerApi = new EventLogControllerApi();

  // Store
  const { appToken } = useAuthStore();
  const { appLabId, setAppIsFetchedRecord, setAppIsFetchedMember } =
    useUserStore();
  const { appVisitorId, appRecordType, removeAppRecord, appIsEvRecord } =
    useRecordStore();
  const { appEventId } = useEventStore();

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
    } catch (error) {
      console.log("Camera Error:", error);
    }
  };

  // Handle play success sound
  const handlePlaySound = async () => {
    try {
      console.log("Starting to play sound...");
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(audioSource);
      setSound(newSound);
      await newSound.playAsync();
      console.log("Sound played successfully");
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Cleanup sound on unmount
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading sound...");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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
        name: `${appVisitorId}_${Date.now()}_photo.jpg`,
      };
      const param: ModelControllerApiVerifyRequest = {
        userId: appVisitorId ?? "",
        image1: file,
        recordType: appRecordType ?? "CHECKIN",
        labId: appLabId ?? "",
      };
      const response = await modelControllerApi.verify(param, {
        headers: {
          Authorization: `Bearer ${appToken}`,
        },
      });
      const isVerify = response.data.result as VerifyResult;
      if (isVerify.isIllegal) {
        setIsFailDialog(true);
        setAppIsFetchedRecord(false);
        setAppIsFetchedMember(false);
      } else {
        if (isVerify?.result.samePerson) {
          handlePlaySound();
          setPhotoUri([]);
          setAppIsFetchedRecord(false);
          setIsSuccessDialog(true);
        } else {
          setIsErrorDialog(true);
        }
      }
    } catch (error: any) {
      if (error.response) {
        console.log("Error verify:", error.response.data);
        setAlertMessage(error.response.data.message);
        setIsAlert(true);
      } else {
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

  // Handle toggle camera
  const handleToggleCamera = () => {
    setCameraPosition((current) => (current === "front" ? "back" : "front"));
  };

  // Handle save guest face if is event
  const handlePostGuestRecord = async () => {
    if (isUpload || !photoUri[0]) return;
    setIsUpload(true);
    console.log(photoUri[0]);
    try {
      const fileUri = photoUri[photoUri.length - 1];
      const file = {
        uri: fileUri,
        type: "image/jpeg",
        name: `guest_${appVisitorId}_${Date.now()}_event_record_photo.jpg`,
      };
      const param: EventLogControllerApiAddEventLogRequest = {
        request: {
          eventId: appEventId ?? "",
          guestId: appVisitorId ?? "",
          recordType: appRecordType ?? undefined,
        },
        file: file,
      };
      await eventLogControllerApi.addEventLog(param, {
        headers: { Authorization: `Bearer ${appToken}` },
      });
      setPhotoUri([]);
      handlePlaySound();
      setIsSuccessDialog(true);
    } catch (error: any) {
      if (error.response) {
        setAlertMessage(error.response.data.message);
        setIsAlert(true);
      }
    } finally {
      setIsUpload(false);
    }
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
    if (appIsEvRecord) handlePostGuestRecord();
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
            {appIsEvRecord ? "Face capture " : "Face recognition"}
          </Text>
        </View>

        {/* Flip camera button */}
        <IconButton
          icon="camera-flip"
          size={20}
          iconColor="#fff"
          style={styles.flipBtn}
          onPress={handleToggleCamera}
        />
      </View>

      {/* Overlay */}
      {<FaceScannerOverlay />}
      {/* Face message */}
      {!isCapturing && (
        <Text variant="bodyMedium" style={styles.faceMgs}>
          {faceMsg}
        </Text>
      )}

      {isUpload && (
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
            Please wait a little...
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
        content={"Record activity successfully"}
        visible={isSuccessDialog}
        setVisible={setIsSuccessDialog}
        onCloseDialog={() => {
          router.dismissAll();
          removeAppRecord();
        }}
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
  flipBtn: {
    position: "absolute",
    right: 10,
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
