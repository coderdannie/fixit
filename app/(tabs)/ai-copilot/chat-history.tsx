import BackBtn from "@/components/BackBtn";
import Icon from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ChatHistoryItem {
  id: string;
  question: string;
  timestamp: string;
  date: string;
}

interface HeaderItem {
  type: "header";
  title: string;
}

interface DataItem extends ChatHistoryItem {
  type: "item";
}

type ListItem = HeaderItem | DataItem;

const ChatHistory = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChatHistoryItem | null>(
    null
  );

  // Sample data - replace with your actual data
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: "1",
      question:
        "What could the issue be, if a toyota corolla 2015 model's Ac suddenly stops working...",
      timestamp: "1:10pm",
      date: "Today",
    },
    {
      id: "2",
      question:
        "What could the issue be, if a toyota corolla 2015 model's Ac suddenly stops working...",
      timestamp: "1:10pm",
      date: "Today",
    },
    {
      id: "3",
      question:
        "What could the issue be, if a toyota corolla 2015 model's Ac suddenly stops working...",
      timestamp: "1:10pm",
      date: "Today",
    },
    {
      id: "4",
      question:
        "What could the issue be, if a toyota corolla 2015 model's Ac suddenly stops working...",
      timestamp: "1:10pm",
      date: "Yesterday",
    },
    {
      id: "5",
      question:
        "What could the issue be, if a toyota corolla 2015 model's Ac suddenly stops working...",
      timestamp: "1:10pm",
      date: "Yesterday",
    },
  ]);

  const handleDeletePress = (item: ChatHistoryItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setChatHistory((prev) =>
        prev.filter((item) => item.id !== selectedItem.id)
      );
      setShowDeleteModal(false);
      setSelectedItem(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const handleCardPress = (item: ChatHistoryItem) => {
    // Navigate to chat detail - adjust route as needed
    router.push({
      pathname: "/(tabs)/ai-copilot",
      params: { chatId: item.id },
    });
  };

  const handleClearHistory = () => {
    // Implement clear all history functionality
    setChatHistory([]);
  };

  const filteredHistory = chatHistory.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group items by date
  const groupedData = filteredHistory.reduce(
    (acc, item) => {
      const existing = acc.find((group) => group.title === item.date);
      if (existing) {
        existing.data.push(item);
      } else {
        acc.push({ title: item.date, data: [item] });
      }
      return acc;
    },
    [] as { title: string; data: ChatHistoryItem[] }[]
  );

  const renderItem = ({ item }: { item: ChatHistoryItem }) => (
    <Pressable
      onPress={() => handleCardPress(item)}
      className="bg-white mx-4 mb-3 p-4 rounded-xl border border-gray-100"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text
            className={`${isTablet ? "text-base" : "text-sm"} text-gray-900 mb-1.5`}
            numberOfLines={2}
          >
            {item.question}
          </Text>
          <Text className="text-xs text-gray-500">{item.timestamp}</Text>
        </View>

        <TouchableOpacity
          onPress={() => handleDeletePress(item)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="p-2"
        >
          <Icon
            type="MaterialCommunityIcons"
            name="delete-outline"
            size={22}
            color="#EF4444"
          />
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View className="px-4 py-2 bg-gray-50">
      <Text className="text-xs font-semibold text-gray-600 uppercase">
        {section.title}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Icon
        type="MaterialCommunityIcons"
        name="message-text-outline"
        size={64}
        color="#D1D5DB"
      />
      <Text className="text-gray-500 mt-4 text-base">
        {searchQuery ? "No conversations found" : "No chat history yet"}
      </Text>
      <Text className="text-gray-400 mt-2 text-sm text-center px-8">
        {searchQuery
          ? "Try a different search term"
          : "Start a conversation with Fixit AI Copilot"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="">
        <View
          className={`flex-row items-center justify-between ${isTablet ? "px-8" : "px-4"} py-4`}
        >
          <BackBtn />

          <View className="flex-1 items-center">
            <Text
              className={`${isTablet ? "text-lg" : "text-base"} font-semibold text-gray-900`}
            >
              History
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleClearHistory}
            activeOpacity={0.7}
            disabled={chatHistory.length === 0}
          >
            <Text
              className={`${isTablet ? "text-base" : "text-sm"} ${
                chatHistory.length === 0 ? "text-gray-300" : "text-blue-600"
              } font-medium`}
            >
              Clear History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className={`${isTablet ? "px-8" : "px-4"} pb-4`}>
          <View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
            <Icon type="Ionicons" name="search" size={20} color="#9CA3AF" />
            <TextInput
              className={`flex-1 ml-2 ${isTablet ? "text-base" : "text-sm"} text-gray-900`}
              placeholder="Search past conversations"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Icon
                  type="Ionicons"
                  name="close-circle"
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Chat History List */}
      <FlatList
        data={groupedData.flatMap((group): ListItem[] => [
          { type: "header", title: group.title },
          ...group.data.map((item): DataItem => ({ type: "item", ...item })),
        ])}
        renderItem={({ item }) => {
          if (item.type === "header") {
            return (
              <View className="px-4 py-2 bg-gray-50">
                <Text className="text-xs font-semibold text-gray-600 uppercase">
                  {item.title}
                </Text>
              </View>
            );
          }
          return renderItem({ item: item as ChatHistoryItem });
        }}
        keyExtractor={(item, index) =>
          item.type === "header"
            ? `header-${(item as HeaderItem).title}`
            : (item as DataItem).id || `item-${index}`
        }
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 20,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <Pressable
          className="flex-1 bg-black/50 items-center justify-center"
          onPress={handleCancelDelete}
        >
          <Pressable
            className="bg-white mx-6 rounded-2xl p-6 w-5/6 max-w-sm"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center mb-4">
              <View className="w-14 h-14 bg-red-100 rounded-full items-center justify-center mb-3">
                <Icon
                  type="MaterialCommunityIcons"
                  name="delete-outline"
                  size={28}
                  color="#EF4444"
                />
              </View>
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Delete Conversation?
              </Text>
              <Text className="text-sm text-gray-600 text-center">
                This will permanently delete this conversation. This action
                cannot be undone.
              </Text>
            </View>

            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleConfirmDelete}
                activeOpacity={0.8}
                className="bg-red-600 rounded-xl py-3.5"
              >
                <Text className="text-white text-center font-semibold text-base">
                  Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCancelDelete}
                activeOpacity={0.8}
                className="bg-gray-100 rounded-xl py-3.5"
              >
                <Text className="text-gray-900 text-center font-semibold text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default ChatHistory;
