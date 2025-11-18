import BackBtn from "@/components/BackBtn";
import Icon from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CancelPlan() {
  const [selectedReason, setSelectedReason] = useState("Other");
  const [feedback, setFeedback] = useState("");
  const [acknowledged, setAcknowledged] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownHeight = useSharedValue(0);
  const dropdownOpacity = useSharedValue(0);

  const reasons = [
    "Too expensive",
    "Not using the app enough",
    "Features didn't meet my needs",
    "Technical issues or bugs",
    "Switching to another platform",
    "Other",
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    dropdownHeight.value = withTiming(isDropdownOpen ? 0 : 1, {
      duration: 300,
    });
    dropdownOpacity.value = withTiming(isDropdownOpen ? 0 : 1, {
      duration: 300,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      maxHeight: dropdownHeight.value * 400, // Approximate height for 6 items
      opacity: dropdownOpacity.value,
      overflow: "hidden",
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom", "left"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={isTablet ? "px-10 pb-10" : "px-6 pb-10"}
      >
        <View className="pt-6 pb-4">
          <BackBtn isMarginBottom />
        </View>

        {/* Title */}
        <View className="mb-6">
          <Text
            className={`font-semibold text-gray-900 ${
              isTablet ? "text-[32px] leading-[40px]" : "text-2xl leading-8"
            }`}
          >
            Cancel Pro Plan
          </Text>
        </View>

        {/* Warning Box */}
        <View className="flex-row gap-3 bg-[#fff8f0] border border-[#F46A07] rounded-lg p-4 mb-6">
          <Icon
            type="Ionicons"
            name="warning-outline"
            color="#F46A07"
            size={isTablet ? 26 : 22}
          />
          <View className="flex-1">
            <Text className="text-[#191919] font-semibold text-base mb-2">
              You are about to cancel your Pro Plan
            </Text>
            <Text
              className={`text-[#666666] ${isTablet ? "text-base" : "text-sm"}`}
            >
              If you cancel, you will lose access to pro features at the end of
              your billing cycle on 1st November, 2025. After that, you will be
              downgraded to the free plan.
            </Text>
          </View>
        </View>

        {/* Reason Selection */}
        <View className="mb-6">
          <Text
            className={`font-semibold text-gray-900 mb-4 ${isTablet ? "text-lg" : "text-base"}`}
          >
            Please tell us why
          </Text>

          {/* Dropdown-style header */}
          <TouchableOpacity
            className="border border-gray-300 rounded-lg p-4 mb-4"
            onPress={toggleDropdown}
            activeOpacity={0.8}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Select a reason</Text>
              <Icon
                type="Ionicons"
                name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </View>
          </TouchableOpacity>

          {/* Reason Options with Animation */}
          <Animated.View style={animatedStyle}>
            <View
              className="space-y-3 border border-gray-100 px-1  bg-white"
              style={{
                shadowColor: "#E6E6E6",
                shadowOffset: {
                  width: 0,
                  height: 9,
                },
                shadowOpacity: 0.5,
                shadowRadius: 9,
                // For Android
                elevation: 9,
              }}
            >
              {reasons.map((reason) => (
                <Pressable
                  key={reason}
                  onPress={() => setSelectedReason(reason)}
                  className="flex-row items-center py-3 border-b border-gray-100"
                >
                  <View className="mr-3">
                    <Icon
                      type="Ionicons"
                      name={
                        selectedReason === reason
                          ? "checkmark-circle-sharp"
                          : "ellipse-outline"
                      }
                      color={selectedReason === reason ? "#2964C2" : "#999"}
                      size={isTablet ? 26 : 22}
                    />
                  </View>
                  <Text
                    className={`${isTablet ? "text-base" : "text-sm"} text-gray-900`}
                  >
                    {reason}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* Feedback Text Area */}
        {selectedReason === "Other" && (
          <View className="mb-6">
            <TextInput
              multiline
              numberOfLines={6}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Share your feedback here..."
              placeholderTextColor="#999"
              textAlignVertical="top"
              className={`border border-gray-300 rounded-lg p-4 ${
                isTablet ? "text-base min-h-[160px]" : "text-sm min-h-[140px]"
              }`}
            />
          </View>
        )}

        {/* Acknowledgment Checkbox */}
        <TouchableOpacity
          onPress={() => setAcknowledged(!acknowledged)}
          className="flex-row items-start mb-8"
        >
          <View
            className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
              acknowledged ? "bg-blue-600 border-blue-600" : "border-gray-300"
            }`}
          >
            {acknowledged && (
              <Icon type="Ionicons" name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <Text
            className={`flex-1 text-gray-700 ${isTablet ? "text-base" : "text-sm"}`}
          >
            I understand that I will lose access to the pro features after
            cancellation.
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className={`flex-row gap-4 ${isTablet ? "mb-8" : "mb-6"}`}>
          <TouchableOpacity
            className={`flex-1 bg-red-600 rounded-full items-center justify-center ${
              isTablet ? "py-5" : "py-4"
            }`}
          >
            <Text
              className={`text-white font-semibold ${isTablet ? "text-lg" : "text-base"}`}
            >
              Confirm Cancellation
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 bg-white border-2 border-[#E6E6E6] rounded-full items-center justify-center ${
              isTablet ? "py-5" : "py-4"
            }`}
          >
            <Text
              className={`text-primary font-semibold ${isTablet ? "text-lg" : "text-base"}`}
            >
              Keep my Plan
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
