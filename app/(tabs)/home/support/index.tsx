import BackBtn from "@/components/BackBtn";
import { chatData } from "@/components/common/constant";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data based on the screenshot

const Index = () => {
  const router = useRouter();

  const handleChatPress = (item: (typeof chatData)[0]) => {
    router.push(`/(tabs)/home/support/${item.id}`);
  };

  const renderChatItem = ({ item }: { item: (typeof chatData)[0] }) => (
    <TouchableOpacity
      className={`flex-row items-center mt-3 py-3 px-5 ${item.unreadCount > 0 && "bg-[#EAF0FB]"}`}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View className="relative">
        <View className="w-12 h-12 flex items-center justify-center rounded-full bg-[#003466] overflow-hidden">
          <Text className="text-white font-semibold">S</Text>
        </View>
      </View>

      {/* Chat Info */}
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-semibold text-gray-900">
            {item.name}
          </Text>
          <Text className="text-xs text-gray-500">{item.time}</Text>
        </View>
        <Text className="text-sm text-gray-600" numberOfLines={1}>
          {item.message}
        </Text>
      </View>

      {/* Unread Badge */}
      {item.unreadCount > 0 && (
        <View className="w-5 h-5 rounded-full bg-blue-600 items-center justify-center ml-2">
          <Text className="text-xs font-semibold text-white">
            {item.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className={`flex-1 ${isTablet ? "px-10" : ""}`}>
        {/* Header */}
        <View className={`${isTablet ? "" : "px-5"}`}>
          <BackBtn isMarginBottom />
          <View className="flex-row items-center gap-3 mb-4">
            <Text
              className={`${isTablet ? "text-2xl" : "text-xl"} font-semibold text-gray-900`}
            >
              Customer Support
            </Text>
          </View>
        </View>

        {/* Chat List */}
        <FlatList
          data={chatData}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerClassName={`${isTablet ? "px-5" : ""}`}
        />
      </View>
    </SafeAreaView>
  );
};

export default Index;
