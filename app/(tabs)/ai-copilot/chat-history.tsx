import { useGetAllConversationsQuery } from "@/apis/aiChatQuery";
import BackBtn from "@/components/BackBtn";
import Icon, { DeleteIcon } from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
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

  // State for pagination
  const [cursorCreatedAt, setCursorCreatedAt] = useState<string | undefined>();
  const [cursorId, setCursorId] = useState<string | undefined>();

  // Helper function to format date
  const formatMessageDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = messageDate.toDateString() === today.toDateString();
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Fetch conversations using RTK Query
  const {
    data: conversationsData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetAllConversationsQuery({
    limit: 20,
    type: "FRONTEND_BACKEND_AI",
    ...(cursorCreatedAt && { cursorCreatedAt }),
    ...(cursorId && { cursorId }),
  });

  // Check if there are more conversations to load
  const hasMoreOlder = conversationsData?.data?.hasMoreOlder ?? false;

  // Transform API data to chat history format
  const chatHistory = useMemo(() => {
    if (!conversationsData?.data?.items) return [];

    return conversationsData.data.items
      .filter((conversation) => conversation.lastMessage)
      .map((conversation) => {
        const lastMessage = conversation.lastMessage;
        const messagePreview = lastMessage?.text
          ? lastMessage.text.split(".")[0] + "..."
          : "No message content";

        return {
          id: conversation.id,
          question: messagePreview.substring(0, 100),
          timestamp: new Date(conversation.lastMessageAt).toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }
          ),
          date: formatMessageDate(conversation.lastMessageAt),
        };
      });
  }, [conversationsData]);

  // Load more conversations
  const loadMoreConversations = useCallback(() => {
    if (
      !isLoading &&
      !isFetching &&
      hasMoreOlder &&
      conversationsData?.data?.nextOlderCursor
    ) {
      const cursor = conversationsData.data.nextOlderCursor;
      setCursorCreatedAt(cursor.createdAt);
      setCursorId(cursor.id);
    }
  }, [isLoading, isFetching, hasMoreOlder, conversationsData]);

  const handleDeletePress = (item: ChatHistoryItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedItem) {
      // TODO: Implement delete API call
      setShowDeleteModal(false);
      setSelectedItem(null);
      // Reset cursors and refetch
      setCursorCreatedAt(undefined);
      setCursorId(undefined);
      refetch();
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const handleCardPress = (item: ChatHistoryItem) => {
    router.push({
      pathname: "/(tabs)/ai-copilot",
      params: { conversationId: item.id },
    });
  };

  const handleClearHistory = async () => {
    // TODO: Implement clear all history API call
    setCursorCreatedAt(undefined);
    setCursorId(undefined);
    refetch();
  };

  const handleRefresh = () => {
    setCursorCreatedAt(undefined);
    setCursorId(undefined);
    refetch();
  };

  const filteredHistory = useMemo(() => {
    return chatHistory.filter((item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatHistory, searchQuery]);

  // Group items by date
  const groupedData = useMemo(() => {
    return filteredHistory.reduce(
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
  }, [filteredHistory]);

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
          <DeleteIcon />
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  const renderFooter = () => {
    if (!isFetching || isLoading) return null;

    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#3B82F6" />
        <Text className="text-gray-500 mt-2 text-sm">
          Loading more conversations...
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4 text-base">
            Loading conversations...
          </Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Icon
            type="MaterialCommunityIcons"
            name="alert-circle-outline"
            size={64}
            color="#EF4444"
          />
          <Text className="text-gray-500 mt-4 text-base">
            Failed to load conversations
          </Text>
          <TouchableOpacity
            onPress={handleRefresh}
            activeOpacity={0.7}
            className="mt-4 bg-blue-600 px-6 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
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
            : "Start a conversation with Nova"}
        </Text>
      </View>
    );
  };

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
            disabled={chatHistory.length === 0 || isLoading}
          >
            <Text
              className={`${isTablet ? "text-base" : "text-sm"} ${
                chatHistory.length === 0 || isLoading
                  ? "text-gray-300"
                  : "text-blue-600"
              } font-medium`}
            >
              Clear History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className={`${isTablet ? "px-8" : "px-4"} pb-4`}>
          <View className="border border-[#E6E6E6] rounded-3xl px-4 py-4 flex-row items-center">
            <Icon type="Ionicons" name="search" size={20} color="#9CA3AF" />
            <TextInput
              className={`flex-1 ml-2 ${isTablet ? "text-base" : "text-sm"} text-gray-900`}
              placeholder="Search past conversations"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              editable={!isLoading}
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
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreConversations}
        onEndReachedThreshold={0.5}
        refreshing={isLoading && !cursorCreatedAt}
        onRefresh={handleRefresh}
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
