// Core
import { ImageSourcePropType } from "react-native";

export type ImageSliderType = {
  title: string;
  image: ImageSourcePropType;
  description: string;
};

export const OnboardingData = [
  {
    title: "Instant Access",
    image: require("../assets/images/onboarding1.png"),
    description:
      "Use student card & face for quick and convenient access. Simply scan and you're ready to go",
  },
  {
    title: "Double authentication",
    image: require("../assets/images/onboarding2.png"),
    description:
      "Ultimate security by using the most advanced facial recognition and QR code technology",
  },
  {
    title: "Monitor Easily",
    image: require("../assets/images/onboarding3.png"),
    description:
      "With history and dashboard, user can monitor all entry or exit activities of student easier",
  },
];
