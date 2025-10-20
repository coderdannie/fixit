import BackBtn from "@/components/BackBtn";
import { jobDetails } from "@/components/common/constant";
import Icon from "@/components/Icon";
import { formatCurrency, isTablet } from "@/utils/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const JobDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const handleChatWithCustomer = () => {};

  const handleCancelJob = () => {};

  const handlePress = () => {
    router.push("/(tabs)/home/jobs/request-extension");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className={`flex-1 ${isTablet ? "px-10" : "px-6"}`}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="pt-6 pb-4">
          <BackBtn isMarginBottom />
          <View className="flex flex-row items-center mb-4 justify-between">
            <Text
              className={`${
                isTablet ? "text-3xl" : "text-xl"
              } font-semibold text-textPrimary `}
            >
              Job Details
            </Text>

            <TouchableOpacity
              onPress={handlePress}
              className="bg-[#F2F2F2] p-1 rounded-md"
            >
              <Icon
                type="MaterialCommunityIcons"
                name="square-edit-outline"
                color="#000000"
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Vehicle Info */}
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text
              className={`${
                isTablet ? "text-xl" : "text-base"
              }  text-gray-900 mb-2 font-medium`}
            >
              {jobDetails.vehicle}
            </Text>
            <Text
              className={`${
                isTablet ? "text-base" : "text-sm"
              } text-[#666666] mb-1`}
            >
              Job type: {jobDetails.jobType}
            </Text>
            <Text
              className={`${
                isTablet ? "text-base" : "text-sm"
              } text-[#666666] mb-1`}
            >
              VIN: {jobDetails.vin}
            </Text>
            <Text
              className={`${
                isTablet ? "text-base" : "text-sm"
              } text-[#666666] mb-1`}
            >
              Plate number: {jobDetails.plateNumber}
            </Text>
            <Text
              className={`${
                isTablet ? "text-base" : "text-sm"
              } text-[#666666] mb-3`}
            >
              {jobDetails.date}
            </Text>
          </View>

          {/* Status Badge */}
          <View className="gap-5 flex-1">
            <View
              className={`self-end  px-3 py-1 rounded-full border ${
                jobDetails.status === "Completed"
                  ? "border-[#37953B]"
                  : "border-[#CC0000]"
              }`}
            >
              <Text
                className={`text-xs ${
                  jobDetails.status === "Completed"
                    ? "text-[#37953B]"
                    : "text-[#CC0000]"
                }`}
              >
                {jobDetails.status}
              </Text>
            </View>
            <View className="mb-6 self-end flex-row items-center gap-2">
              <View className="h-2 w-[30%] bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${80}%` }}
                />
              </View>
              <Text className="text-sm text-gray-600">{80}% complete</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="mb-5">
          <Text
            className={`${
              isTablet ? "text-xl" : "text-base"
            } font-medium text-textPrimary mb-1`}
          >
            Description
          </Text>
          <Text
            className={`${
              isTablet ? "text-base" : "text-sm"
            } text-[#666666] leading-5`}
          >
            {jobDetails.description}
          </Text>
        </View>

        {/* Cost Breakdown */}
        <View className="mb-5">
          <Text
            className={`${
              isTablet ? "text-xl" : "text-base"
            } font-medium text-textPrimary mb-1`}
          >
            Cost Breakdown
          </Text>
          {jobDetails.costBreakdown.map((item, index) => (
            <View
              key={index}
              className="flex-row border-b border-[#E6E6E6] py-[10px] justify-between items-center mb-2"
            >
              <Text
                className={`${
                  isTablet ? "text-base" : "text-sm"
                } text-[#666666]`}
              >
                {item.item}
              </Text>
              <Text
                className={`${
                  isTablet ? "text-base" : "text-sm"
                } font-medium text-gray-900`}
              >
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}

          {/* Total */}
          <View className="flex-row border-b border-[#E6E6E6] pb-[10px] justify-between items-center mt-3  ">
            <Text
              className={`${isTablet ? "text-base" : "text-sm"} text-[#003466]`}
            >
              Total Breakdown
            </Text>
            <Text
              className={`${
                isTablet ? "text-lg" : "text-base"
              } font-semibold text-[#003466]`}
            >
              {formatCurrency(jobDetails.total)}
            </Text>
          </View>
        </View>

        {/* Mechanic Notes */}
        <View className="mb-8">
          <Text
            className={`${
              isTablet ? "text-xl" : "text-base"
            } font-medium text-textPrimary mb-1`}
          >
            Mechanic Notes
          </Text>
          <Text
            className={`${
              isTablet ? "text-base" : "text-sm"
            } text-[#666666] leading-5`}
          >
            {jobDetails.mechanicNotes}
          </Text>
        </View>
        <View className="px-4 py-3">
          <TouchableOpacity
            onPress={handleChatWithCustomer}
            className="w-full bg-primary py-4 px-4 rounded-full flex-row items-center justify-center gap-2 mb-4"
            activeOpacity={0.5}
          >
            <Icon
              type="Ionicons"
              name="chatbubble-ellipses-outline"
              size={20}
              color="#FFFF"
            />
            <Text className="text-white font-medium text-base">
              Chat With Customer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancelJob}
            className="w-full bg-red-50 py-4 px-4 rounded-full flex-row items-center justify-center gap-2 border border-[#E6E6E6]"
            activeOpacity={0.8}
          >
            <Icon type="AntDesign" name="close" size={20} color="#990000" />
            <Text className="text-[#990000] font-medium text-base">
              Cancel Job
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobDetails;
