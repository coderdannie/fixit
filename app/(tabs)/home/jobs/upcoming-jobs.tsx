import { CarIcon, NoJobs } from "@/assets/images/Icon";
import BackBtn from "@/components/BackBtn";
import { ClockIcon } from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const upcomingJobsData = [
  {
    id: "1",
    vehicle: "Toyota Camry 2017",
    jobType: "Engine Diagnostics",
    dueTime: "01:54:03",
  },
  {
    id: "2",
    vehicle: "Honda Accord 2019",
    jobType: "Oil Change",
    dueTime: "03:20:15",
  },
  {
    id: "3",
    vehicle: "Honda Accord 2019",
    jobType: "Oil Change",
    dueTime: "03:20:15",
  },
  {
    id: "4",
    vehicle: "Toyota Hilux 2020",
    jobType: "Brake Inspection",
    dueTime: "05:10:30",
  },
  {
    id: "5",
    vehicle: "Kia Rio 2017",
    jobType: "Tire Service",
    dueTime: "02:45:20",
  },
];

const JobCard = ({ item, onStartNow }: any) => {
  return (
    <View className="bg-white border-b border-gray-200 px-5 py-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <View className="bg-[#EAF0FB] w-12 h-12 rounded-xl items-center justify-center mr-4">
            <CarIcon />
          </View>

          <View className="flex-1">
            <Text
              className={`${isTablet ? "text-xl" : "text-lg"} font-medium text-gray-900 mb-1`}
            >
              {item.vehicle}
            </Text>
            <Text className="text-gray-600 mb-1">Job type: {item.jobType}</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-700 text-sm">Due in: </Text>
              <Text className="text-[#990000] text-sm font-semibold">
                {item.dueTime}
              </Text>
              <ClockIcon />
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-full"
          onPress={() => onStartNow(item.id)}
        >
          <Text className="text-white text-sm font-semibold">Start Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function UpcomingJobsList() {
  const router = useRouter();

  const handleStartNow = (id: string) => {
    router.push(`/(tabs)/home/jobs/${id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1">
        {/* Header Section */}
        <View className={`bg-white px-5 pt-6 pb-4 ${isTablet && "px-10"}`}>
          <BackBtn isMarginBottom />
          <Text
            className={`${
              isTablet ? "text-3xl" : "text-2xl"
            } font-semibold text-gray-900`}
          >
            Upcoming Jobs
          </Text>
        </View>

        {/* Content Section */}
        <View className="flex-1 mt-5">
          <View
            className={`bg-white ${
              !upcomingJobsData.length && "border border-[#E6E6E6] rounded-xl"
            } overflow-hidden ${isTablet ? "mx-10" : "mx-5"}`}
          >
            {upcomingJobsData.length > 0 ? (
              <FlatList
                data={upcomingJobsData}
                renderItem={({ item }) => (
                  <JobCard item={item} onStartNow={handleStartNow} />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View className="items-center justify-center py-16">
                <NoJobs />
                <Text
                  className={`${
                    isTablet ? "text-2xl" : "text-xl"
                  } font-semibold text-gray-900 mt-6 mb-2`}
                >
                  No Upcoming Jobs
                </Text>
                <Text
                  className={`${
                    isTablet ? "text-lg" : "text-base"
                  } text-[#666666] text-center px-8`}
                >
                  Your upcoming scheduled jobs will appear here.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
