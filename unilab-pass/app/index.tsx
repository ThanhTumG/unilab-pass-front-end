// Core
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Store
import { useAuthStore } from "stores";

// Type
type Props = {};

// Component
const App = (props: Props) => {
  // Route
  const router = useRouter();

  // Store
  const { appIsLoggedIn, appToken } = useAuthStore();
  console.log(appIsLoggedIn, appToken);
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
        } else if (!appIsLoggedIn) {
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
