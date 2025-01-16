// Core
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Type
type Props = {};

// Component
const App = (props: Props) => {
  const router = useRouter();

  // Effects
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(
          "hasSeenOnboarding"
        );
        if (hasSeenOnboarding === null) {
          router.replace("/(auth)/LoginScreen");
          await AsyncStorage.setItem("hasSeenOnboarding", "true");
        } else {
          router.replace("/OnboardingScreen");
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
