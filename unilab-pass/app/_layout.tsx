// Core
import "react-native-reanimated";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

// App
import { useAuthStore, useUserStore } from "stores";
import eventBus from "utils/eventBus";
import useRecordStore from "stores/useRecordStore";
import useEventStore from "stores/useEventStore";
import { ErrorDialog } from "components/CustomDialog";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Component
export default function RootLayout() {
  // Fonts
  const [loaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  // Store
  const { appIsLoggedIn, removeAppToken, appIsTokenErr, setAppIsTokenErr } =
    useAuthStore();
  const { removeAppUser } = useUserStore();
  const { removeAppRecord } = useRecordStore();
  const { removeAppEvent } = useEventStore();

  // Router
  const router = useRouter();

  // Method
  const handleLogout = () => {
    console.log("logout");
    setAppIsTokenErr(false);
    removeAppToken();
    removeAppEvent();
    removeAppRecord();
    removeAppUser();
    router.replace("/(auth)/LoginScreen");
  };

  // Effects
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    eventBus.on("logout", handleLogout);

    return () => {
      eventBus.off("logout", handleLogout);
    };
  }, []);

  if (!loaded) {
    return null;
  }

  // Theme
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: "#333",
      primary: "rgba(27, 97, 181, 0.89)",
      outline: "#6C6C6C",
      elevation: {
        level0: "transparent",
        level1: "#FAFCFF",
        level2: "#FAFCFF",
        level3: "#FAFCFF",
        level4: "#FAFCFF",
        level5: "#FAFCFF",
      },
    },
  };

  // Template
  return (
    <SafeAreaView style={styles.safeArea}>
      <PaperProvider theme={customTheme}>
        {!appIsLoggedIn ? (
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="OnboardingScreen"
              options={{ headerShown: false }}
            />
          </Stack>
        ) : (
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="OnboardingScreen"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SelectLabScreen"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        )}

        <StatusBar style="auto" />

        {/* Error Token */}
        <ErrorDialog
          visible={appIsTokenErr}
          setVisible={() => false}
          onCloseDialog={handleLogout}
          onConfirm={handleLogout}
          title="Error"
          content={`Your account is logged in on another device.`}
        />
      </PaperProvider>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
