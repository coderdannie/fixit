import { CarIcon, NoJobs } from "@/assets/images/Icon";
import { ClockIcon } from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

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
];

const JobCard = ({ item, handleStart }: any) => {
  return (
    <View className="bg-white border-b border-gray-200 px-5 py-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <View className="bg-[#EAF0FB] w-12 h-12 rounded-xl items-center justify-center mr-4">
            <CarIcon />
          </View>

          <View className="flex-1">
            <Text
              className={`${isTablet ? "text-xl" : "text-lg"} font-medium  text-gray-900 mb-1`}
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
          className="bg-primary px-6 py-3 rounded-full "
          onPress={handleStart}
        >
          <Text className="text-white text-sm font-semibold">Start Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const UpcomingJobs = () => {
  const router = useRouter();

  const handleViewMore = () => {
    router.push("/(tabs)/home/jobs/upcoming-jobs");
  };

  const handleStartNow = () => {
    router.push("/(tabs)/home/jobs/start-job");
  };

  return (
    <View className="bg-white mt-5">
      <View className="flex-row justify-between items-center px-5 py-4">
        <Text
          className={` ${isTablet ? "text-2xl" : "text-xl"} font-semibold text-gray-900`}
        >
          Upcoming Jobs
        </Text>
        {upcomingJobsData.length && (
          <TouchableOpacity onPress={handleViewMore}>
            <Text
              className={`text-[#666666] ${isTablet ? "text-xl" : "text-base"}`}
            >
              View All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        className={`${!upcomingJobsData.length && "border"}  border-[#E6E6E6] rounded-xl overflow-hidden ${isTablet ? "mx-10" : "mx-5"}`}
      >
        {upcomingJobsData.length ? (
          <FlatList
            data={upcomingJobsData}
            renderItem={({ item }) => (
              <JobCard item={item} handleStart={handleStartNow} />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          />
        ) : (
          <View className="items-center justify-center">
            <NoJobs />
          </View>
        )}
      </View>
    </View>
  );
};

export default UpcomingJobs;
