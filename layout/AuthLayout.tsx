import Icon from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
  title?: string;
  page?: string;
  skip?: boolean;
  onPress?: () => void;
  currentStep?: number;
  totalSteps?: number;
  showStepper?: boolean;
  back?: boolean;
}

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
}

const Stepper = ({ currentStep, totalSteps }: StepperProps) => {
  const progressPercentage = totalSteps ? (currentStep / totalSteps) * 100 : 0;
  const stepperHeight = isTablet ? 12 : 10;

  return (
    <View key={`stepper-${currentStep}-${totalSteps}`}>
      {/* Simple Progress Bar */}
      <View className="relative w-full">
        {/* Gray Background Container */}
        <View
          className="w-full bg-[#E6E6E6] rounded-full"
          style={{ height: stepperHeight }}
        />

        {/* Blue Progress Fill */}
        <View
          className="absolute top-0 bg-primary rounded-full"
          style={{
            width: `${progressPercentage}%`,
            height: stepperHeight,
          }}
        />
      </View>
    </View>
  );
};

const AuthLayout = ({
  children,
  className,
  title,
  skip = false,
  onPress,
  currentStep,
  totalSteps = 4,
  showStepper = false,
  back,
}: AuthLayoutProps) => {
  const router = useRouter();
  return (
    <SafeAreaView className={`flex-1 bg-white`}>
      <View
        className={`${
          isTablet ? "px-10" : "px-5"
        } flex-row items-center justify-between mt-6 `}
      >
        {back && (
          <Pressable
            onPress={() => router.back()}
            style={{
              width: isTablet ? 42 : 32,
              height: isTablet ? 42 : 32,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              backgroundColor: "#F2F2F2",
            }}
          >
            <Icon
              type="Ionicons"
              name="chevron-back-outline"
              color="#00000"
              size={24}
            />
          </Pressable>
        )}
        {showStepper && (
          <View className="flex-1 flex-row justify-center items-center mb-6">
            {/* Back Button */}
            <Pressable onPress={() => router.back()}>
              <Icon
                type="Ionicons"
                name="chevron-back-outline"
                color="#00000"
                size={20}
              />
            </Pressable>
            {/* Stepper */}
            {showStepper && currentStep !== undefined && (
              <View className={`  flex-1  ${isTablet ? "px-10" : "px-10"}`}>
                <Stepper currentStep={currentStep} totalSteps={totalSteps} />
              </View>
            )}
            <Text>
              {currentStep}/{totalSteps}
            </Text>
          </View>
        )}

        {/* Page Indicator */}
        {skip && (
          <Text
            onPress={onPress}
            className={` font-dmsans font-bold text-black ${
              isTablet ? "text-xl" : "text-base"
            }`}
          >
            Skip
          </Text>
        )}
      </View>

      {/* Title */}
      {title && (
        <View className={`${isTablet ? "px-10" : "px-5"} mt-4`}>
          <Text
            className={`font-dmsans font-bold text-gray-900 ${
              isTablet ? "text-2xl" : "text-xl"
            }`}
          >
            {title}
          </Text>
        </View>
      )}

      {/* Scrollable Content */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className={`flex-1 w-full ${className}`}>{children}</View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AuthLayout;
