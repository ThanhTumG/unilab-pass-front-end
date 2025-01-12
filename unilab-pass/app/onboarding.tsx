// Core
import React, { useRef, useState } from "react";
import { FlatList, StyleSheet, View, ViewToken } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";

// App
import SliderItem from "components/SliderItem";
import DotPagination from "components/DotPagination";
import PaginateButton from "components/PaginateButton";
import { ImageSliderType, OnboardingData } from "constants/OnboardingData";

// Component
export default function Onboarding() {
  // State
  const [paginationIndex, setPaginationIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList<ImageSliderType>>(null);

  const router = useRouter();

  const ResetCache = async () => {
    await AsyncStorage.removeItem("hasSeenOnboarding");
  };

  // Methods
  // Handle Scroll Slide
  const handleScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  // Handle Click Next Button
  const handleNextSlide = () => {
    if (paginationIndex < 2) {
      const nextIndex = paginationIndex + 1;
      setPaginationIndex(nextIndex);
      if (flatListRef.current !== null)
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
    if (paginationIndex == 2) router.replace("/(auth)/login");
  };

  // Handle Click Skip
  const handleSkip = () => {
    router.replace("/(auth)/login");
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0].index !== undefined && viewableItems[0].index !== null)
      setPaginationIndex(viewableItems[0].index);
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  // Template
  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={OnboardingData}
        renderItem={({ item, index }) => (
          <SliderItem index={index} item={item} />
        )}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />

      <DotPagination
        style={{ position: "absolute", bottom: 67 }}
        items={OnboardingData}
        scrollX={scrollX}
        paginationIndex={paginationIndex}
      />

      {paginationIndex != 2 && (
        <Button
          mode="text"
          labelStyle={styles.skipText}
          style={styles.skipButton}
          textColor="#6C6C6C"
          onPress={handleSkip}
        >
          Skip
        </Button>
      )}

      <PaginateButton
        onPressScroll={handleNextSlide}
        isLastSlide={paginationIndex == 2}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  skipButton: {
    position: "absolute",
    right: 5,
    top: 5,
  },
  skipText: {
    textDecorationLine: "underline",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
});
