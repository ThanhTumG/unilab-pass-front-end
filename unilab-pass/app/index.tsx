// Core
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Type
type Props = {};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Component
const App = (props: Props) => {
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  // Route
  const router = useRouter();

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("myNotificationChannel", {
        name: "A channel is needed for the permissions prompt to appear",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error("Project ID not found");
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }
    return token;
  }

  useEffect(() => {
    const checkPushNotificationToken = async () => {
      try {
        const pushNotificationToken = await AsyncStorage.getItem(
          "pushNotificationToken"
        );
        if (pushNotificationToken === null) {
          registerForPushNotificationsAsync().then(async (token) => {
            token &&
              (await AsyncStorage.setItem("pushNotificationToken", token));
          });
          responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
              (response) => {
                console.log(response);
              }
            );
        } else {
          console.log("AsyncStorage", pushNotificationToken);
        }
      } catch (error) {
        console.error("Error AsyncStorage:", error);
      }
    };
    checkPushNotificationToken();

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Effects
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(
          "hasSeenOnboarding"
        );
        if (hasSeenOnboarding === null) {
          router.replace("/OnboardingScreen");
          await AsyncStorage.setItem("hasSeenOnboarding", "true");
        } else {
          router.replace("/(auth)/LoginScreen");
        }
      } catch (error) {
        console.error("Error AsyncStorage:", error);
      }
    };
    checkFirstLaunch();
  }, []);

  return;
};

export default App;
