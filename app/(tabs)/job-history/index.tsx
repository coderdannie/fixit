import { EmptyJobHistory } from "@/assets/images/Icon";
import Icon from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- New Empty State Component ---
const EmptyState = ({ searchQuery }: { searchQuery: string }) => {
  const isSearching = searchQuery.trim().length > 0;

  return (
    <View style={styles.emptyContainer}>
      <EmptyJobHistory />
      <Text style={styles.emptyTitle}>
        {isSearching ? "No Matching Jobs Found" : "Your Job History is Empty"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {isSearching
          ? "Try a different search term or check for typos."
          : "When you finish your first job, you will see all the details stored in your history."}
      </Text>
    </View>
  );
};
// ---------------------------------

const JobHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  // To test the empty state, set jobs to an empty array:
  // const jobs = [];

  const jobs = [
    {
      id: 1,
      vehicle: "Toyota Corolla 2015",
      jobType: "Brake Repair",
      date: "20th August 2025, 4:05pm",
      status: "Completed",
    },
    {
      id: 2,
      vehicle: "Kia Rio 2017",
      jobType: "Cooling System Repair",
      date: "19th August 2025, 1:15pm",
      status: "Cancelled",
    },
    {
      id: 3,
      vehicle: "Ford Explorer 2018",
      jobType: "Oil Change",
      date: "17th August 2025, 10:25am",
      status: "Completed",
    },
    {
      id: 4,
      vehicle: "Toyota Corolla 2015",
      jobType: "AC Repair",
      date: "1st August 2025, 3:07pm",
      status: "Cancelled",
    },
    {
      id: 5,
      vehicle: "Toyota Corolla 2015",
      jobType: "AC Repair",
      date: "1st August 2025, 3:07pm",
      status: "Cancelled",
    },
    {
      id: 6,
      vehicle: "Toyota Corolla 2015",
      jobType: "AC Repair",
      date: "1st August 2025, 3:07pm",
      status: "Cancelled",
    },
  ];

  const filteredJobs = jobs.filter(
    (job) =>
      job.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (id: number) => {
    router.push(`/(tabs)/job-history/${id}`);
  };

  const renderJobItem = ({ item }: any) => (
    <View className="mb-4 pb-4 border-b border-[#E6E6E6]">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-1">
          <Text
            className={`${isTablet ? "text-xl" : "text-base"} font-medium  text-gray-900 mb-1`}
          >
            {item.vehicle}
          </Text>
          <Text
            className={`${isTablet ? "text-base" : "text-sm"}  text-[#666666] mb-1`}
          >
            Job type: {item.jobType}
          </Text>
          <Text
            className={`${isTablet ? "text-sm" : "text-xs"}  text-[#666666] mb-1`}
          >
            {item.date}
          </Text>
        </View>

        <View
          className={`px-3 py-1 rounded-full ${
            item.status === "Completed"
              ? " border border-[#37953B]"
              : " border border-[#CC0000]"
          }`}
        >
          <Text
            className={`text-xs  ${
              item.status === "Completed" ? "text-[#37953B]" : "text-[#CC0000]"
            }`}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className="justify-center items-center pb-3 pt-5"
        onPress={() => handleViewDetails(item.id)}
      >
        <Text className="text-primary text-sm font-medium">View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className={`flex-1 mt-6 ${isTablet ? "px-10" : "px-6"} `}>
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <View className="pt-4">
              <Text
                className={`${
                  isTablet ? "text-3xl" : "text-2xl"
                } font-semibold text-textPrimary mb-2`}
              >
                Job History
              </Text>
              <View className="flex-row gap-2 mt-6 items-center border border-[#E6E6E6] rounded-full   px-4 py-4 mb-5">
                <Icon type="Feather" name="search" color="#1B417E" size={20} />
                <TextInput
                  className="flex-1 text-base text-gray-900"
                  placeholder="Search by vehicle, job type..."
                  placeholderTextColor="#666666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>
          }
          ListEmptyComponent={<EmptyState searchQuery={searchQuery} />}
          showsVerticalScrollIndicator={false}
          // Use style for content container to ensure the empty component centers correctly
          contentContainerStyle={
            filteredJobs.length === 0
              ? styles.emptyContentPadding
              : { paddingBottom: 120 }
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default JobHistory;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  // This is crucial to make the EmptyState component fill the remaining vertical space
  emptyContentPadding: {
    flexGrow: 1,
  },
});
