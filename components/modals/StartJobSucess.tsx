import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../CustomButton";

// Success Modal Component
interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  onViewActiveJobs?: () => void;
  onReturnToDashboard?: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export const JobStartedSuccessModal = ({
  isVisible,
  onClose,
  onViewActiveJobs,
  onReturnToDashboard,
  isLoading,
  title = "Job Started Successfully!",
  description = "You have started the repair for Toyota Camry 2017 Estimated completion: 2 Days",
}: SuccessModalProps) => {
  const router = useRouter();
  const handleViewActiveJobs = () => {
    router.push("/(tabs)/home/jobs/upcoming-jobs");
    onClose();
  };

  const handleReturnToDashboard = () => {
    router.push("/(tabs)/home");
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {isLoading ? (
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-white rounded-3xl p-10 items-center w-full max-w-[400px]">
            {/* Loading Spinner */}
            <View className="mb-6">
              <ActivityIndicator size="large" color="#2964C2" />
            </View>

            {/* Title */}
            <Text
              className={`${
                isTablet ? "text-xl" : "text-lg"
              } font-semibold text-[#1F2937] mb-2 text-center`}
            >
              Starting job...
            </Text>

            {/* Subtitle */}
            <Text className="text-sm text-[#666666] text-center">
              This may take a few seconds.
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-white rounded-3xl p-8 items-center w-full max-w-[450px]">
            {/* Success Icon */}
            {/* <View className="mb-6 bg-[#37953B] rounded-full w-20 h-20 items-center justify-center">
              <Icon
                type="MaterialCommunityIcons"
                name="check"
                size={48}
                color="#FFFFFF"
              />
            </View> */}
            <View className="w-28 h-28 rounded-full items-center justify-center mb-6">
              <Image
                className="w-28 h-28"
                source={require("../../assets/images/success.gif")}
              />
            </View>

            {/* Title */}
            <Text
              className={`${
                isTablet ? "text-2xl" : "text-xl"
              } font-semibold text-[#1F2937] mb-3 text-center`}
            >
              {title}
            </Text>

            {/* Description */}
            <Text className="text-sm text-[#666666] text-center leading-5 mb-8">
              {description}
            </Text>

            {/* View Active Jobs Button */}
            <CustomButton
              title="View Active Jobs"
              onPress={handleViewActiveJobs}
            />
            {/* Return to Dashboard Button */}
            <TouchableOpacity
              className="py-4 px-8 w-full mt-5 items-center border border-[#E6E6E6] rounded-full"
              onPress={handleReturnToDashboard}
              activeOpacity={0.6}
            >
              <Text className="text-primary text-base font-medium">
                Return to Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Modal>
  );
};
