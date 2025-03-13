// Core
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const scannerSize = 250;

// Component
const QRScannerOverlay = () => {
  // Template
  return (
    <View style={styles.overlay}>
      <View style={styles.top} />
      <View style={styles.middle}>
        <View style={styles.side} />
        <View style={styles.scannerArea} />
        <View style={styles.side} />
      </View>
      <View style={styles.bottom} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  top: { width: "100%", height: (height - scannerSize) / 2 },
  middle: {
    flexDirection: "row",
    alignItems: "center",
  },
  side: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scannerArea: {
    width: scannerSize,
    height: scannerSize,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  bottom: { width: "100%", flex: 1 },
});

export default QRScannerOverlay;
