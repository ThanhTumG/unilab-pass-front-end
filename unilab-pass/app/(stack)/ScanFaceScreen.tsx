// Core
import { StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import useBackHandler from "utils/useBackHandler";
import { ActivityIndicator, Snackbar, Text } from "react-native-paper";
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
import { Worklets } from "react-native-worklets-core";
import Svg, { Rect } from "react-native-svg";

// Types
type Props = {};

// Component
const ScanFaceScreen = (props: Props) => {
  // Stated
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [faces, setFaces] = useState<Face[]>([]);

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

  // Methods
  // Handle back
  useBackHandler(() => {
    router.replace("/(tabs)/RecordActivityScreen");
    return true;
  });

  // Handle detect face
  const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[]) => {
    console.log("faces detected", faces);
    setFaces(faces);
  });

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      const faces = detectFaces(frame);
      if (faces.length > 0) {
        handleDetectedFaces(faces);
      }
    },
    [handleDetectedFaces]
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
  }, [hasPermission, requestPermission]);

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
    <View style={[StyleSheet.absoluteFillObject]}>
      {/* Camera */}
      <Camera
        style={[StyleSheet.absoluteFill]}
        device={device}
        isActive={hasPermission}
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
      />

      {/* Draw frame */}
      <Svg style={StyleSheet.absoluteFill}>
        {faces.map((face, index) => (
          <Rect
            key={index}
            x={face.bounds.x / 2}
            y={face.bounds.y}
            width={face.bounds.width}
            height={face.bounds.height}
            stroke="red"
            strokeWidth="3"
            fill="transparent"
          />
        ))}
      </Svg>

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
