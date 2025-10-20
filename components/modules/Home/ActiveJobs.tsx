import { NoActiveIcon } from "@/assets/images/Icon";
import JobCard from "@/components/common/JobCard";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const jobsData = [
  {
    id: "1",
    vehicle: "Toyota Corolla 2015",
    jobType: "AC Repair",
    progress: 60,
    status: "In progress",
  },
  {
    id: "2",
    vehicle: "Kia Rio 2017",
    jobType: "Tire service",
    progress: 40,
    status: "In progress",
  },
  {
    id: "3",
    vehicle: "Kia Rio 2017",
    jobType: "Tire service",
    progress: 40,
    status: "In progress",
  },
];

export default function ActiveJobsList() {
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    router.push(`/(tabs)/home/jobs/${id}`);
  };

  const handleViewActiveJobs = () => {
    router.push("/(tabs)/home/jobs");
  };
  return (
    <View className={`pt-[30px] ${isTablet ? "pl-10" : "pl-5"}`}>
      <View
        className={`flex-row justify-between items-center mb-6 ${isTablet ? "pr-10" : "pr-5"}`}
      >
        <Text
          className={` ${isTablet ? "text-2xl" : "text-xl"} font-semibold text-gray-900`}
        >
          Active Jobs
        </Text>
        {jobsData.length && (
          <TouchableOpacity onPress={handleViewActiveJobs}>
            <Text
              className={`text-[#666666] ${isTablet ? "text-xl" : "text-base"}`}
            >
              View All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {jobsData.length ? (
        <FlatList
          data={jobsData}
          renderItem={({ item }) => (
            <View className="w-80">
              <JobCard item={item} handleView={handleViewDetails} isShow />
            </View>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16, gap: 16 }}
        />
      ) : (
        <View className="items-center justify-center">
          <NoActiveIcon />
          <Text className={` ${isTablet ? "text-2xl" : "text-x"} py-1`}>
            No Active Jobs Yet
          </Text>
          <Text className={`${isTablet ? "text-base" : "text-sm"}`}>
            When a customer assigns you a repair, it will appear here.
          </Text>
        </View>
      )}
    </View>
  );
}
