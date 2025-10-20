import BackBtn from "@/components/BackBtn";
import Icon from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const JobSummary = () => {
  const router = useRouter();

  const jobData = {
    vehicle: "Toyota Camry 2017",
    jobType: "Engine Diagnostics",
    vin: "98765043211CCEG",
    plateNumber: "98765043821CCEG",
    dueDate: "01.54.03",
    customer: "Ralph James",
    reportedIssue:
      "Lorem ipsum dolor sit amet consectetur. Mauris eu magna egestas nullam eget placerat eu. Morbi diam id neque eget parturient urna eu.",
  };

  const handleAcceptJob = () => {
    console.log("Job accepted");
    router.push("/(tabs)/home/jobs/set-estimated-time");
  };

  const handleDeclineJob = () => {
    console.log("Job declined");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={["top"]}>
      <ScrollView
        className={`flex-1 ${isTablet ? "px-10" : "px-6"}`}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="pt-6 pb-4">
          <BackBtn isMarginBottom />
        </View>

        {/* Job Summary Card */}
        <View className="bg-white rounded-lg border border-[#E6E6E6]  mb-4 ">
          {/* Card Header */}
          <View className="flex-row items-center px-3 gap-2 border-b  border-[#E6E6E6] py-4">
            <View className="w-8 h-8  rounded items-center justify-center">
              <Icon type="SimpleLineIcons" name="notebook" size={16} />
            </View>
            <Text
              className={`${
                isTablet ? "text-xl" : "text-lg"
              } font-semibold text-textPrimary`}
            >
              Job Summary
            </Text>
          </View>
          <View className="p-3">
            {/* Vehicle Info */}
            <View className="mb-4">
              <Text
                className={`${
                  isTablet ? "text-lg" : "text-base"
                } font-semibold text-gray-900 mb-3`}
              >
                {jobData.vehicle}
              </Text>

              <View className="gap-2">
                <Text
                  className={`${
                    isTablet ? "text-base" : "text-sm"
                  } text-[#666666]`}
                >
                  Job type:{" "}
                  <Text className="text-gray-900">{jobData.jobType}</Text>
                </Text>
                <Text
                  className={`${
                    isTablet ? "text-base" : "text-sm"
                  } text-[#666666]`}
                >
                  VIN: <Text className="text-gray-900">{jobData.vin}</Text>
                </Text>
                <Text
                  className={`${
                    isTablet ? "text-base" : "text-sm"
                  } text-[#666666]`}
                >
                  Plate number:{" "}
                  <Text className="text-gray-900">{jobData.plateNumber}</Text>
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text
                    className={`${
                      isTablet ? "text-base" : "text-sm"
                    } text-[#666666]`}
                  >
                    Due at:
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Icon
                      type="MaterialCommunityIcons"
                      name="clock-outline"
                      size={16}
                      color="#CC0000"
                    />
                    <Text
                      className={`${
                        isTablet ? "text-base" : "text-sm"
                      } font-medium text-[#CC0000]`}
                    >
                      {jobData.dueDate}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Customer */}
            <View className="mb-4">
              <Text
                className={`${
                  isTablet ? "text-base" : "text-sm"
                } font-semibold text-gray-900 mb-1`}
              >
                Customer
              </Text>
              <Text
                className={`${isTablet ? "text-base" : "text-sm"} text-[#666666]`}
              >
                {jobData.customer}
              </Text>
            </View>

            {/* Reported Issue */}
            <View>
              <Text
                className={`${
                  isTablet ? "text-base" : "text-sm"
                } font-semibold text-gray-900 mb-1`}
              >
                Reported issue
              </Text>
              <Text
                className={`${
                  isTablet ? "text-base" : "text-sm"
                } text-[#666666] leading-5`}
              >
                {jobData.reportedIssue}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-4 py-3">
          <TouchableOpacity
            onPress={handleAcceptJob}
            className="w-full bg-primary py-4 px-4 rounded-full flex-row items-center justify-center gap-2 mb-4"
            activeOpacity={0.5}
          >
            <Icon
              type="Ionicons"
              name="checkmark-sharp"
              size={20}
              color="#FFFF"
            />
            <Text className="text-white font-medium text-base">Accept Job</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeclineJob}
            className="w-full bg-red-50 py-4 px-4 rounded-full flex-row items-center justify-center gap-2 border border-[#E6E6E6]"
            activeOpacity={0.8}
          >
            <Icon type="AntDesign" name="close" size={20} color="#990000" />
            <Text className="text-[#990000] font-medium text-base">
              Decline Job
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobSummary;
