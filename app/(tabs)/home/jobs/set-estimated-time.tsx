import BackBtn from "@/components/BackBtn";
import CustomButton from "@/components/CustomButton";
import RequestSentModal from "@/components/modals/RequestSent";
import { JobStartedSuccessModal } from "@/components/modals/StartJobSucess";
import { isTablet } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SetEstimatedTime = () => {
  const [hours, setHours] = useState("");
  const [days, setDays] = useState("");
  const [reason, setReason] = useState("");
  const [restartProgress, setRestartProgress] = useState(false);
  const [visibile, setVisible] = useState(false);
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    console.log({ hours, days, reason, restartProgress });
    // Handle submission logic here
  };

  const incrementValue = (value: string, setter: (val: string) => void) => {
    const currentValue = parseInt(value) || 0;
    setter(String(currentValue + 1));
  };

  const decrementValue = (value: string, setter: (val: string) => void) => {
    const currentValue = parseInt(value) || 0;
    if (currentValue > 0) {
      setter(String(currentValue - 1));
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleNavigate = () => {
    router.push("/(tabs)/home");
    setVisible(false);
  };

  const handleStartJob = () => {
    setShowLoading(false);
    setShowSuccess(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className={`flex-1 ${isTablet ? "px-10" : "px-6"}`}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-6 pb-4">
          <BackBtn isMarginBottom />
          <Text
            className={`${
              isTablet ? "text-3xl" : "text-2xl"
            } font-semibold text-textPrimary mb-4 mt-2`}
          >
            Set Estimated Completion Time
          </Text>
          <Text>Tell the customer how long this repair will take.</Text>
          {/* Select New Estimated Completion Time */}
          <View className="mt-6 mb-6">
            <View className="flex-row gap-4">
              {/* Hours */}
              <View className="flex-1">
                <Text className="text-sm text-textPrimary mb-2">Hours</Text>
                <View className="relative">
                  <TextInput
                    placeholder="Select"
                    value={hours}
                    onChangeText={setHours}
                    keyboardType="numeric"
                    className="w-full px-12 py-3.5 border border-[#E6E6E6] rounded-full text-textPrimary bg-white text-center"
                    placeholderTextColor="#9ca3af"
                    editable={false}
                  />
                  <TouchableOpacity
                    onPress={() => decrementValue(hours, setHours)}
                    className="absolute left-2 top-2 w-9 h-9 bg-[#E3E5E8] rounded-full items-center justify-center"
                  >
                    <Ionicons name="remove" size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => incrementValue(hours, setHours)}
                    className="absolute right-2 top-2 w-9 h-9 bg-primary rounded-full items-center justify-center"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Days */}
              <View className="flex-1">
                <Text className="text-sm text-textPrimary mb-2">Days</Text>
                <View className="relative">
                  <TextInput
                    placeholder="Select"
                    value={`${days || "0"} day${days !== "1" ? "s" : ""}`}
                    onChangeText={setDays}
                    keyboardType="numeric"
                    className="w-full px-12 py-3.5 border border-[#E6E6E6] rounded-full text-textPrimary bg-white text-center"
                    placeholderTextColor="#9ca3af"
                    editable={false}
                  />
                  <TouchableOpacity
                    onPress={() => decrementValue(days, setDays)}
                    className="absolute left-2 top-2 w-9 h-9 bg-[#E3E5E8] rounded-full items-center justify-center"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="remove" size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => incrementValue(days, setDays)}
                    className="absolute right-2 top-2 w-9 h-9 bg-primary rounded-full items-center justify-center"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Reason for Extension */}
          <View className="mb-6 mt-2">
            <Text className="text-base  text-textPrimary mb-2">
              Additional Notes (Optional)
            </Text>
            <TextInput
              placeholder="Waiting for part delivery, complex diagnosis, etc."
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="w-full px-4 py-3 border border-[#E6E6E6] rounded-lg text-textPrimary bg-white"
              placeholderTextColor="#9ca3af"
              style={{ minHeight: 100 }}
            />
          </View>

          {/* Submit Button */}
          <CustomButton title="Start Job" onPress={handleStartJob} />
          <RequestSentModal
            visible={visibile}
            onClose={handleClose}
            handleNavigate={handleNavigate}
          />
        </View>
        <JobStartedSuccessModal
          isVisible={showSuccess}
          onClose={() => setShowSuccess(false)}
          isLoading={showLoading}
          onViewActiveJobs={() => console.log("View Active Jobs")}
          onReturnToDashboard={() => console.log("Return to Dashboard")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SetEstimatedTime;
