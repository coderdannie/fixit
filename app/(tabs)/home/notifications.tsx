import {
  EmptyNotification,
  JobUpdateIcon,
  WarningIcon,
} from "@/assets/images/Icon";
import BackBtn from "@/components/BackBtn";
import { isTablet } from "@/utils/utils";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Notification {
  id: number;
  type: "job" | "system";
  title: string;
  description: string;
  time: string;
  isNew: boolean;
  section: "today" | "earlier";
}

interface NotificationItemProps {
  type: "job" | "system";
  title: string;
  description: string;
  time: string;
  isNew: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  description,
  time,
  isNew,
}) => {
  const isJobUpdate = type === "job";

  return (
    <TouchableOpacity
      className={`flex-row items-start ${isNew && "bg-[#F2F2F2]"} rounded-xl p-4 mb-3`}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
          isJobUpdate ? "bg-[#ECF8ED]" : "bg-[#FEF0E6]"
        }`}
      >
        {isJobUpdate ? <JobUpdateIcon /> : <WarningIcon />}
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-base font-medium text-textPrimary mb-1">
          {title}
        </Text>
        <Text className="text-sm text-[#666666] leading-5">{description}</Text>
      </View>

      {/* Unread indicator */}
      <View>
        {isNew && (
          <View className="w-2 h-2 rounded-full bg-blue-500  ml-auto mt-2" />
        )}
        <Text className="text-[#666666] text-sm">2m ago</Text>
        <Text
          className={`text-xs mt-2 ${isNew ? "text-[#990000]" : "text-gray-400"}`}
        >
          {time}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- New Empty State Component ---
const EmptyState: React.FC = () => (
  <View style={styles.emptyContainer}>
    <EmptyNotification />
    <Text style={styles.emptyTitle}>No Notifications Yet</Text>
    <Text style={styles.emptySubtitle}>
      Job alerts and updates will appear here once customers assign you a task.
    </Text>
  </View>
);
// ---------------------------------

const Notifications: React.FC = () => {
  const notifications: Notification[] = [
    {
      id: 1,
      type: "job",
      title: "Job Update",
      description: "New booking for a Honda Civic 2018.",
      time: "01:54:03",
      isNew: true,
      section: "today",
    },
    {
      id: 2,
      type: "job",
      title: "Job Update",
      description: "New booking for a Honda Civic 2018.",
      time: "02:30:10",
      isNew: true,
      section: "today",
    },
    {
      id: 3,
      type: "job",
      title: "Job Update",
      description: "New booking for a Honda Civic 2018.",
      time: "2w ago",
      isNew: false,
      section: "today",
    },
    {
      id: 4,
      type: "system",
      title: "System Alert",
      description: "Your subscription is expiring in 3 days.",
      time: "3w ago",
      isNew: false,
      section: "earlier",
    },
  ];

  const renderHeader = () => (
    <>
      <View className="pt-6 pb-4">
        <BackBtn isMarginBottom />
      </View>

      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">Notifications</Text>
        {/* <TouchableOpacity>
          <Icon type="Feather" name="settings" color="#00000" size={24} />
        </TouchableOpacity> */}
      </View>
    </>
  );

  const renderSectionHeader = (section: string) => (
    <View className="mb-3 mt-2">
      <Text className="text-sm font-medium text-gray-500">{section}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Notification }) => {
    // NOTE: This section header logic is complex and relies on item.id being sequential.
    // For a robust solution, you should use SectionList or pre-process your data to
    // explicitly determine the first item in each section.
    const isFirstInSection =
      item.id === 1 ||
      (item.id === 4 &&
        notifications.find((n) => n.id === item.id - 1)?.section !==
          item.section);

    return (
      <>
        {isFirstInSection &&
          renderSectionHeader(item.section === "today" ? "Today" : "Earlier")}
        <NotificationItem
          type={item.type}
          title={item.title}
          description={item.description}
          time={item.time}
          isNew={item.isNew}
        />
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom", "left"]}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          isTablet
            ? styles.contentContainerTablet
            : styles.contentContainerMobile,
          notifications.length === 0 && styles.emptyContentPadding,
        ]}
      />
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
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
  },
  contentContainerTablet: {
    paddingHorizontal: 40,
    paddingBottom: 120,
  },
  contentContainerMobile: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  emptyContentPadding: {
    flexGrow: 0,
  },
});
