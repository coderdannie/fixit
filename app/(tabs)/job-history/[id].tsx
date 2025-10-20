import BackBtn from "@/components/BackBtn";
import { jobDetails } from "@/components/common/constant";
import Icon from "@/components/Icon";
import { formatCurrency, isTablet } from "@/utils/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const JobDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className={`flex-1 ${isTablet ? "px-10" : "px-6"}`}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="pt-6 pb-4">
          <BackBtn isMarginBottom />

          <Text
            className={`${
              isTablet ? "text-3xl" : "text-xl"
            } font-semibold text-textPrimary mb-4`}
          >
            Job Details
          </Text>
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
          <View
            className={` px-3 py-1 rounded-full border ${
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

        {/* Job Timeline */}
        <View className="mb-6">
          <Text
            className={`${
              isTablet ? "text-xl" : "text-base"
            } font-medium text-textPrimary mb-2`}
          >
            Job Timeline
          </Text>
          {jobDetails.timeline.map((item, index) => (
            <View key={index} className="flex-row items-start">
              <View className="items-center mr-3">
                {/* Circle with checkmark */}
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,

                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#EAF0FB",
                  }}
                >
                  <Icon
                    type="Feather"
                    name="check-circle"
                    color="#1B417E"
                    size={14}
                  />
                </View>

                {/* Dotted line connector using individual dots */}
                {index < jobDetails.timeline.length - 1 && (
                  <View style={{ alignItems: "center", marginTop: 2 }}>
                    {[...Array(8)].map((_, i) => (
                      <View
                        key={i}
                        style={{
                          width: 2,
                          height: 2,
                          borderRadius: 1,
                          backgroundColor: "#1B417E",
                          marginVertical: 2,
                        }}
                      />
                    ))}
                  </View>
                )}
              </View>

              <View className="flex-1 pb-4">
                <Text
                  className={`${
                    isTablet ? "text-base" : "text-sm"
                  } font-medium text-gray-900`}
                >
                  {item.title}
                </Text>
                <Text
                  className={`${
                    isTablet ? "text-sm" : "text-xs"
                  } text-[#666666]`}
                >
                  {item.time}
                </Text>
              </View>
            </View>
          ))}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobDetails;
