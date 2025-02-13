import { useEffect } from "react";
import { BackHandler, Alert } from "react-native";

export default function useBackHandler(callback: () => boolean) {
  useEffect(() => {
    const backAction = () => {
      return callback();
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [callback]);
}
