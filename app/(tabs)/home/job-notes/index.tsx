import { useGetAllNotesQuery } from "@/apis/jobQuery";
import BackBtn from "@/components/BackBtn";
import Icon from "@/components/Icon";
import {
  SkeletonLoader,
  SkeletonLoadingFooter,
} from "@/components/Loaders/NoteListLoader";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { formatDate, isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EmptyState = ({ searchQuery }: { searchQuery: string }) => {
  const isSearching = searchQuery.trim().length > 0;

  return (
    <View style={styles.emptyContainer}>
      <Icon
        type="MaterialCommunityIcons"
        name={isSearching ? "magnify-remove-outline" : "note-text-outline"}
        color="#999999"
        size={50}
      />
      <Text style={styles.emptyTitle}>
        {isSearching ? "No Matching Notes Found" : "No Job Notes Yet"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {isSearching
          ? "Try a different search term or check for typos."
          : "Your job notes and documentation will appear here."}
      </Text>
    </View>
  );
};

const JobNotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebouncedValue(searchQuery, 500);

  // Fetch notes with pagination
  const { data, isLoading, isFetching, isError } = useGetAllNotesQuery({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const notes = data?.data?.notes || [];
  const pageInfo = data?.data?.pageInfo;
  const hasMore = pageInfo ? page < pageInfo.totalPages : false;

  const handleViewDetails = (id: string) => {
    router.push(`/(tabs)/home/job-notes/${id}`);
  };

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetching]);

  const handleRefresh = useCallback(() => {
    setPage(1);
  }, []);

  const renderNoteItem = ({ item }: any) => (
    <TouchableOpacity
      className="mb-4 pb-4 border border-[#E6E6E6] rounded-[10px] py-3 px-[10px]"
      onPress={() => handleViewDetails(item.id)}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text
          className={`${isTablet ? "text-lg" : "text-base"} font-medium text-textPrimary flex-1`}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          className={`${isTablet ? "text-sm" : "text-xs"} text-[#666666] ml-2`}
        >
          {formatDate(item.createdAt)}
        </Text>
      </View>
      <Text
        className={`${isTablet ? "text-base" : "text-sm"} text-[#666666] leading-5`}
        numberOfLines={2}
      >
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  // Show skeleton loader on initial load
  if (isLoading && page === 1) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className={`flex-1 ${isTablet ? "px-10" : "px-5"}`}>
          <BackBtn />
          <SkeletonLoader itemCount={3} showSearch={true} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className={`flex-1 ${isTablet ? "px-10" : "px-5"}`}>
        {/* Header */}
        <BackBtn />
        <View className="flex-row justify-between items-center pt-4 pb-3">
          <View className="flex-row items-center gap-3">
            <Text
              className={`${isTablet ? "text-2xl" : "text-xl"} font-semibold text-gray-900`}
            >
              Job Notes
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleViewDetails("add")}
            className="bg-[#F2F2F2] p-1 rounded-md"
          >
            <Icon
              type="MaterialCommunityIcons"
              name="square-edit-outline"
              color="#000000"
              size={24}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row gap-2 mt-3 items-center border border-[#E6E6E6] rounded-full px-4 py-3 mb-4">
          <Icon type="Feather" name="search" color="#999999" size={18} />
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Search"
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon type="Feather" name="x" color="#999999" size={18} />
            </TouchableOpacity>
          )}
        </View>

        {/* Notes List */}
        {isError ? (
          <View style={styles.errorContainer}>
            <Icon
              type="MaterialCommunityIcons"
              name="alert-circle-outline"
              color="#EF4444"
              size={50}
            />
            <Text style={styles.errorText}>Failed to load notes</Text>
            <TouchableOpacity
              onPress={handleRefresh}
              className="mt-4 bg-primary px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={notes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<EmptyState searchQuery={debouncedSearch} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              notes.length === 0
                ? styles.emptyContentPadding
                : { paddingBottom: 20 }
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetching && page > 1 ? <SkeletonLoadingFooter /> : null
            }
            refreshing={isFetching && page === 1}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default JobNotes;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
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
  emptyContentPadding: {
    flexGrow: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 10,
  },
});
