import BackBtn from "@/components/BackBtn";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data based on the screenshot
const chatData = [
  {
    id: "1",
    name: "Jason Alex",
    message: "Okay, thank you",
    time: "2 hours ago",
    unreadCount: 3,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "John Bull",
    message: "Hi Sarah, how is the going?",
    time: "3 hours ago",
    unreadCount: 2,
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Ralph James",
    message: "Thank you so much Sarah",
    time: "Yesterday",
    unreadCount: 0,
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "4",
    name: "Rose Peter",
    message: "Really? I hope to get a high quality job done",
    time: "Monday",
    unreadCount: 0,
    avatar: "https://i.pravatar.cc/150?img=4",
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleChatPress = (item: (typeof chatData)[0]) => {
    // Navigate to chat detail screen with the chat data
    router.push(`/(tabs)/home/chats/${item.id}`);
  };

  const renderChatItem = ({ item }: { item: (typeof chatData)[0] }) => (
    <TouchableOpacity
      className={`flex-row items-center mt-3 py-3 px-5 ${item.unreadCount > 0 && "bg-[#EAF0FB]"}`}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View className="relative">
        <View className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
          <Image
            source={{ uri: item.avatar }}
            className="w-full h-full"
            resizeMode="cover"
          />
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
              Chats
            </Text>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-2">
            <Text className="text-gray-400 mr-2">🔍</Text>
            <TextInput
              placeholder="Search conversations"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
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
