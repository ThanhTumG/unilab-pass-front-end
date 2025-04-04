// Core
import { Button, Text } from "react-native-paper";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// App
import { useUserStore } from "stores";
import useBackHandler from "utils/useBackHandler";
import VerifyPasswordModal from "components/VerifyPasswordModal";
import useRecordStore from "stores/useRecordStore";

// Types
type Props = {};

// Component
const RecordActivityScreen = (props: Props) => {
  // States
  const [isVerifyPassModal, setIsVerifyPassModal] = useState(false);
  const swipeBtnWidth = useRef(new Animated.Value(45)).current;
  const [isShowSwipeBtn, setIsShowSwipeBtn] = useState(false);

  // Route
  const router = useRouter();

  // Store
  const { appIsOnlyScanMode } = useUserStore();
  const { setAppRecord } = useRecordStore();

  // Methods
  // handle back
  useBackHandler(() => {
    if (appIsOnlyScanMode) {
      return true;
    }
    router.back();
    return true;
  });

  // Handle route scan screen
  const handleRouteScanScreen = (isCheckIn: boolean) => {
    setAppRecord({ recordType: isCheckIn ? "CHECKIN" : "CHECKOUT" });
    router.push({
      pathname: "/ScanQRScreen",
    });
  };

  // Handle dismiss exit button
  const collapseButton = () => {
    setIsShowSwipeBtn(false);
    Animated.timing(swipeBtnWidth, {
      toValue: 45,
      duration: 350,
      useNativeDriver: false,
    }).start();
  };

  // Animate
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 1) {
          Animated.timing(swipeBtnWidth, {
            toValue: 150,
            duration: 350,
            useNativeDriver: false,
          }).start(() => setIsShowSwipeBtn(true));
        } else if (gestureState.dx < -15) {
          setIsShowSwipeBtn(false);
          Animated.timing(swipeBtnWidth, {
            toValue: 45,
            duration: 350,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Effects
  useFocusEffect(
    useCallback(() => {
      if (!appIsOnlyScanMode) return;
      return () => {
        Animated.spring(swipeBtnWidth, {
          toValue: 45,
          useNativeDriver: false,
        }).start();
        setIsShowSwipeBtn(false);
      };
    }, [appIsOnlyScanMode])
  );

  // Template
  return (
    <TouchableWithoutFeedback onPress={collapseButton}>
      <ImageBackground
        source={require("../../../assets/images/background-without-logo.png")}
        style={[styles.background]}
      >
        {/* Title */}
        <Text variant="headlineLarge" style={styles.title}>
          {appIsOnlyScanMode ? "Only Scan Mode" : "Select Record Type"}
        </Text>

        {appIsOnlyScanMode && (
          <Animated.View
            style={[styles.container, { width: swipeBtnWidth }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.item}>
              {isShowSwipeBtn && (
                <Button
                  icon={"close-circle-outline"}
                  style={styles.swipeBtn}
                  contentStyle={{
                    flexDirection: "row-reverse",
                    flex: 1,
                  }}
                  onPress={() => setIsVerifyPassModal(true)}
                  labelStyle={{ color: "#FF6666", fontSize: 18 }}
                >
                  <Text style={styles.exitText} variant="bodyMedium">
                    Exit mode
                  </Text>
                </Button>
              )}
            </View>
          </Animated.View>
        )}

        {/* Action button */}
        <View style={[styles.actionBtnContainer, styles.alignCenter]}>
          <Button
            mode="outlined"
            style={{
              borderRadius: 5,
              borderColor: "#44CC77",
              borderWidth: 1.25,
            }}
            textColor="#44CC77"
            contentStyle={{ width: 270, height: 55 }}
            buttonColor="rgba(204, 255, 204, .75)"
            onPress={() => handleRouteScanScreen(true)}
            icon={"home-import-outline"}
            labelStyle={{ fontSize: 24 }}
          >
            <Text
              variant="bodyLarge"
              style={[styles.buttonLabel, { color: "#44CC77" }]}
            >
              Check In
            </Text>
          </Button>
          <Button
            mode="outlined"
            style={{
              borderRadius: 5,
              borderColor: "#FF6666",
              borderWidth: 1.25,
            }}
            textColor="#FF6666"
            buttonColor="rgba(255, 230, 230, .75)"
            contentStyle={{ width: 270, height: 55 }}
            icon={"home-export-outline"}
            labelStyle={{ fontSize: 24 }}
            onPress={() => handleRouteScanScreen(false)}
          >
            <Text
              variant="bodyLarge"
              style={[styles.buttonLabel, { color: "#FF6666" }]}
            >
              Check Out
            </Text>
          </Button>
        </View>

        {/* Verify password */}
        <VerifyPasswordModal
          visible={isVerifyPassModal}
          setVisible={setIsVerifyPassModal}
        />
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default RecordActivityScreen;

// Styles
const styles = StyleSheet.create({
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 150,
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: "#1B61B5",
  },
  actionBtnContainer: {
    marginTop: 90,
    gap: 32,
  },
  buttonLabel: {
    fontFamily: "Poppins-SemiBold",
  },
  container: {
    position: "absolute",
    top: 20,
    left: 0,
    height: 50,
    paddingRight: 35,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 50,
  },
  item: {
    flex: 1,
    alignSelf: "stretch",
    minWidth: 10,
    backgroundColor: "white",
    borderColor: "#185b97",
    borderLeftWidth: 0,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderCurve: "continuous",
  },
  swipeBtn: {
    borderRadius: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderCurve: "continuous",
  },
  exitText: {
    fontFamily: "Poppins-Medium",
  },
});
