// Core
import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { Face } from "react-native-vision-camera-face-detector";

// Types
type Props = {
  face: Face;
};

// Component
const FaceFrame = ({ face }: Props) => {
  const { bounds } = face;

  const adjustedX = bounds.x / 2;
  const adjustedY = bounds.y - bounds.height * 0.1;
  const adjustedWidth = bounds.width;
  const adjustedHeight = bounds.height * 1.2;

  // Template
  return (
    <Svg height="100%" width="100%" style={{ position: "absolute" }}>
      <Rect
        x={adjustedX}
        y={adjustedY}
        width={adjustedWidth}
        height={adjustedHeight}
        fill="none"
        stroke="red"
        strokeWidth="2"
      />
    </Svg>
  );
};

export default FaceFrame;

const styles = StyleSheet.create({});
