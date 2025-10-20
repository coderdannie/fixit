import { NoActiveIcon } from "@/assets/images/Icon";
import BackBtn from "@/components/BackBtn";
import JobCard from "@/components/common/JobCard";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    vehicle: "Toyota Hilux 2020",
    jobType: "Brake Inspection",
    progress: 0,
    status: "Pending",
  },
  {
    id: "4",
    vehicle: "Toyota Hilux 2020",
    jobType: "Brake Inspection",
    progress: 0,
    status: "Pending",
  },
  {
    id: "5",
    vehicle: "Toyota Hilux 2020",
    jobType: "Brake Inspection",
    progress: 0,
    status: "Pending",
  },
];

export default function ActiveJobsList() {
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    router.push(`/(tabs)/home/jobs/${id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom", "left"]}>
      <View className={`flex-1 ${isTablet ? "px-10" : "px-6"}`}>
        <View className="pt-6 pb-4">
          <BackBtn isMarginBottom />

          <Text
            className={`${
              isTablet ? "text-3xl" : "text-2xl"
            } font-semibold text-textPrimary mb-4`}
          >
            Active Jobs
          </Text>
        </View>

        {jobsData.length > 0 ? (
          <FlatList
            data={jobsData}
            renderItem={({ item }) => (
              <JobCard item={item} handleView={handleViewDetails} isShow />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{}}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          />
        ) : (
          <View className="items-center justify-center py-10">
            <NoActiveIcon />
            <Text
              className={`${
                isTablet ? "text-2xl" : "text-lg"
              } font-semibold text-gray-900 mt-4 mb-2`}
            >
              No Active Jobs Yet
            </Text>
            <Text
              className={`${
                isTablet ? "text-base" : "text-sm"
              } text-[#666666] text-center px-8`}
            >
              When a customer assigns you a repair, it will appear here.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
