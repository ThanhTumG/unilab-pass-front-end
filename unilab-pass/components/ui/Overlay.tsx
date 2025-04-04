// Core
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { ClipPath, Defs, Ellipse, G, Path, Rect } from "react-native-svg";

// Screen
const { width, height } = Dimensions.get("window");

const CORNER_SIZE = 30;
const CORNER_THICKNESS = 4;
const QR_OVERLAY_WIDTH = width * 0.7;
const QR_OVERLAY_HEIGHT = height * 0.4;

const ellipseWidth = width * 0.82;
const ellipseHeight = height * 0.55;

// Component
// QRScannerOverlay Component
const QRScannerOverlay = () => {
  return (
    <View style={styles.container}>
      <Svg height={QR_OVERLAY_HEIGHT} width={QR_OVERLAY_WIDTH}>
        <Path
          d={`M${CORNER_THICKNESS},${
            CORNER_SIZE + CORNER_THICKNESS
          } V${CORNER_THICKNESS} H${CORNER_SIZE + CORNER_THICKNESS}`}
          stroke="white"
          strokeWidth={CORNER_THICKNESS}
          fill="none"
        />

        <Path
          d={`M${
            QR_OVERLAY_WIDTH - CORNER_SIZE - CORNER_THICKNESS
          },${CORNER_THICKNESS} H${QR_OVERLAY_WIDTH - CORNER_THICKNESS} V${
            CORNER_SIZE + CORNER_THICKNESS
          }`}
          stroke="white"
          strokeWidth={CORNER_THICKNESS}
          fill="none"
        />

        <Path
          d={`M${CORNER_THICKNESS},${
            QR_OVERLAY_HEIGHT - CORNER_SIZE - CORNER_THICKNESS
          } V${QR_OVERLAY_HEIGHT - CORNER_THICKNESS} H${
            CORNER_SIZE + CORNER_THICKNESS
          }`}
          stroke="white"
          strokeWidth={CORNER_THICKNESS}
          fill="none"
        />

        <Path
          d={`M${QR_OVERLAY_WIDTH - CORNER_SIZE - CORNER_THICKNESS},${
            QR_OVERLAY_HEIGHT - CORNER_THICKNESS
          }  H${QR_OVERLAY_WIDTH - CORNER_THICKNESS}
          
          V${QR_OVERLAY_HEIGHT - CORNER_SIZE - CORNER_THICKNESS}`}
          stroke="white"
          strokeWidth={CORNER_THICKNESS}
          fill="none"
        />
      </Svg>
    </View>
  );
};

// FaceScannerOverlay Component
const FaceScannerOverlay = () => {
  // Template
  return (
    <View style={styles.container}>
      {/* SVG Overlay */}
      <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
        <Defs>
          <ClipPath id="clip">
            <Rect x={0} y={0} width={width} height={height} />
            <Ellipse
              cx={width / 2}
              cy={height / 2}
              rx={ellipseWidth / 2}
              ry={ellipseHeight / 2}
            />
          </ClipPath>
        </Defs>

        <G clipPath="url(#clip)">
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="rgba(0, 0, 0, 0.5)"
          />
        </G>

        <Ellipse
          cx={width / 2}
          cy={height / 2}
          rx={ellipseWidth / 2}
          ry={ellipseHeight / 2}
          fill="none"
          stroke="white"
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
};

export { QRScannerOverlay, FaceScannerOverlay };

// Styles
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
