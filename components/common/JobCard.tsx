import { CarIcon } from "@/assets/images/Icon";
import { isTablet } from "@/utils/utils";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const JobCard = ({ item, handleView, isShow }: any) => (
  <View
    className={`bg-white rounded-2xl border-2 border-primary pt-6 px-6 ${isShow ? "pb-6" : "pb-1"}  w-full mr-4`}
  >
    <View className="flex-row justify-between items-center mb-4">
      <View
        className={`${isTablet ? "w-16 h-16 " : "w-10 h-10 "} bg-[#EAF0FB] rounded-xl items-center justify-center`}
      >
        <CarIcon />
      </View>
      <View className="border border-[#F46A07] rounded-full px-4 py-1.5">
        <Text className="text-[#F46A07] text-sm font-medium">
          {item.status}
        </Text>
      </View>
    </View>

    <Text
      className={`${isTablet ? "text-xl" : "text-lg"} font-medium text-gray-900 mb-1`}
    >
      {item.vehicle}
    </Text>

    <Text className="text-gray-600 text-sm mb-3">Job type: {item.jobType}</Text>

    {item.currentDeadline && (
      <Text className="text-gray-600 text-sm mb-1">
        Current deadline:{" "}
        <Text className="text-[#990000]">{item.currentDeadline}</Text>
      </Text>
    )}

    {item.elapsedTime && (
      <Text className="text-gray-600 text-sm mb-3">
        Elapsed time: <Text className="text-[#990000]">{item.elapsedTime}</Text>
      </Text>
    )}

    <View className="flex-row items-center gap-2 mb-5">
      <View className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-primary rounded-full"
          style={{ width: `${item.progress}%` }}
        />
      </View>
      <Text className="text-sm text-gray-600">{item.progress}% complete</Text>
    </View>

    {isShow && (
      <TouchableOpacity
        className="w-full bg-primary py-4 rounded-full items-center"
        onPress={() => handleView(item.id)}
      >
        <Text className="text-white text-base">View Job Details</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default JobCard;
