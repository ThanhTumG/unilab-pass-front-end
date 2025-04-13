// Core
import { useLocalSearchParams, useRouter } from "expo-router";
import { Modal, StyleSheet, View } from "react-native";
import { Worklets } from "react-native-worklets-core";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  IconButton,
  Portal,
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
import { checkFaceViewIsFrontal } from "lib/utils";
import { FaceScannerOverlay } from "components/ui/Overlay";

// Types
type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPhotoUri: React.Dispatch<React.SetStateAction<string[]>>;
};

// Component
const ScanFaceModal = ({ visible, setVisible, setPhotoUri }: Props) => {
  // Stated
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceMsg, setFaceMsg] = useState("");
  const [isActive, setIsActive] = useState(false);

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
      console.error("Camera Error:", error);
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
    setVisible(false);
    setIsCapturing(false);
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
    <Portal>
      <View style={[styles.portal, { display: visible ? "flex" : "none" }]}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => setVisible(!visible)}
        >
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
                onPress={() => setVisible(false)}
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
                  Face Capture
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
        </Modal>
      </View>
    </Portal>
  );
};

export default ScanFaceModal;

// Styles
const styles = StyleSheet.create({
  portal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
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
