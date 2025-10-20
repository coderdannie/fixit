import useOnboarding from "@/hooks/useOnboarding";
import { isTablet, width } from "@/utils/utils";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

interface OnboardingItem {
  id: number;
  img: any;
  title: string;
  des: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: 0,
    img: require("../../assets/images/slide1.png"),
    title: "AI Diagnostics",
    des: "Detect issues before they happen with AI-powered insights.",
  },
  {
    id: 1,
    img: require("../../assets/images/slide2.png"),
    title: "Predictive Maintenance",
    des: "Stay ahead with smart reminders and reduced downtime.",
  },
  {
    id: 2,
    img: require("../../assets/images/slide3.png"),
    title: "Fleet Management & Tracking",
    des: "Monitor, manage, and protect vehicles in real time.",
  },
  {
    id: 3,
    img: require("../../assets/images/slide4.png"),
    title: "Geo-Fencing & Security",
    des: "Prevent theft and control vehicle zones.",
  },
];

const Onboarding: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const pagerRef = useRef<PagerView>(null);
  const router = useRouter();

  const { updateIsOnboarded } = useOnboarding();

  const scrollToNext = (): void => {
    const nextIndex = activeIndex + 1;

    if (nextIndex < onboardingData.length) {
      pagerRef.current?.setPage(nextIndex);
      setActiveIndex(nextIndex);
    } else {
      updateIsOnboarded(true);
      navigateToMainScreen();
    }
  };

  const handleSkip = (): void => {
    updateIsOnboarded(true);
    navigateToMainScreen();
  };

  const navigateToMainScreen = (): void => {
    router.replace("/register");
  };

  const onPageSelected = (e: any): void => {
    setActiveIndex(e.nativeEvent.position);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <StatusBar
          translucent
          backgroundColor="white"
          barStyle="dark-content"
        />

        {/* Skip Button - positioned absolutely at top right, hidden on last slide */}
        {activeIndex !== onboardingData.length - 1 && (
          <View className="absolute top-8 right-3 z-10">
            <TouchableOpacity
              onPress={handleSkip}
              activeOpacity={0.7}
              className="backdrop-blur-sm rounded-full px-4 py-2 shadow-sm bg-white/80"
            >
              <Text className="text-textPrimary font-semibold text-base">
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={onPageSelected}
        >
          {onboardingData.map((item: OnboardingItem) => (
            <View
              key={item.id}
              style={{ width }}
              className="flex-1 items-center justify-between py-8"
            >
              <Image
                source={item.img}
                className="w-full h-[70%] mb-6"
                resizeMode="cover"
              />

              <View className="items-center">
                <Text
                  className={`${isTablet ? "text-4xl" : "text-3xl"} font-semibold text-[#191919] text-center`}
                >
                  {item.title}
                </Text>
                <Text className="text-xl text-textPrimary text-center mt-[6px] px-4">
                  {item.des}
                </Text>
              </View>

              <View className="w-full items-center mt-8">
                <View className="flex-row justify-between items-center mb-4 w-full px-3">
                  <View className="flex-row items-center gap-1">
                    {onboardingData.map((_, index: number) => (
                      <View
                        key={index}
                        className={`h-2 rounded-full ${
                          activeIndex === index
                            ? "w-5 bg-primary"
                            : "w-2 bg-[#E6E6E6]"
                        }`}
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    className="w-[60%]  py-4 bg-primary flex-row justify-center items-center rounded-[40px] gap-2"
                    onPress={scrollToNext}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white font-medium text-lg">
                      {activeIndex === onboardingData.length - 1
                        ? "Get Started"
                        : "Continue"}
                    </Text>

                    <Feather name="arrow-right" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </PagerView>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
