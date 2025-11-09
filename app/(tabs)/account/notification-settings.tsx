import BackBtn from "@/components/BackBtn";
import {
  AssignedIcon,
  BanIcon,
  CicleAlert,
  CreditCardIcon,
  FileSpreadSheet,
  ScanIcon,
  TimeLineIcon,
  TriangleAlertIcon,
  UpdatesIcon,
} from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface NotificationSetting {
  id: string;
  title: string;
  iconType: any;
  enabled: boolean;
  section: "job" | "diagnostics" | "subscription";
}

interface SettingItemProps {
  title: string;
  iconType: any;
  enabled: boolean;
  onToggle: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  iconType,
  enabled,
  onToggle,
}) => {
  const IconComponent = iconType;

  return (
    <View
      className="flex-row mt-3 px-3 rounded-xl items-center justify-between py-[15px] border-b border-gray-100 bg-white"
      style={{
        shadowColor: "#E6E6E6",
        shadowOffset: {
          width: 0,
          height: 9,
        },
        shadowOpacity: 0.5,
        shadowRadius: 9,
        // For Android
        elevation: 9,
      }}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-6 h-6 items-center justify-center mr-3">
          <IconComponent color="#007AFF" size={20} />
        </View>
        <Text className="text-base text-textPrimary">{title}</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: "#E3E5E8", true: "#2964C2" }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E3E5E8"
      />
    </View>
  );
};

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "new_job",
      title: "New Job Assigned",
      iconType: AssignedIcon,
      enabled: true,
      section: "job",
    },
    {
      id: "deadline",
      title: "Job Deadline Alert",
      iconType: TimeLineIcon,
      enabled: false,
      section: "job",
    },
    {
      id: "completion",
      title: "Job Completion Confirmation",
      iconType: ScanIcon,
      enabled: true,
      section: "job",
    },
    {
      id: "cancelled",
      title: "Job Cancelled or Reassigned",
      iconType: BanIcon,
      enabled: true,
      section: "job",
    },
    {
      id: "scan_completed",
      title: "Scan Completed",
      iconType: ScanIcon,
      enabled: true,
      section: "diagnostics",
    },
    {
      id: "critical_fault",
      title: "Critical Fault Found",
      iconType: CicleAlert,
      enabled: false,
      section: "diagnostics",
    },
    {
      id: "report_ready",
      title: "Diagnostic Report Ready",
      iconType: FileSpreadSheet,
      enabled: true,
      section: "diagnostics",
    },
    {
      id: "subscription",
      title: "Subscription Renewal Reminder",
      iconType: CreditCardIcon,
      enabled: true,
      section: "subscription",
    },
    {
      id: "plan_expiring",
      title: "Plan Expiring",
      iconType: TriangleAlertIcon,
      enabled: false,
      section: "subscription",
    },
    {
      id: "app_updates",
      title: "App Updates",
      iconType: UpdatesIcon,
      enabled: true,
      section: "subscription",
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const jobSettings = settings.filter((s) => s.section === "job");
  const diagnosticsSettings = settings.filter(
    (s) => s.section === "diagnostics"
  );
  const subscriptionSettings = settings.filter(
    (s) => s.section === "subscription"
  );

  const renderSection = (title: string, items: NotificationSetting[]) => (
    <View className="mb-4">
      <Text className=" font-semibold text-textPrimary mb-2 pt-4">{title}</Text>
      {items.map((item) => (
        <SettingItem
          key={item.id}
          title={item.title}
          iconType={item.iconType}
          enabled={item.enabled}
          onToggle={() => toggleSetting(item.id)}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom", "left"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          isTablet
            ? styles.contentContainerTablet
            : styles.contentContainerMobile
        }
      >
        <View className="pt-6 pb-4">
          <BackBtn isMarginBottom />
        </View>

        <View className="mb-4">
          <Text className="text-2xl font-semibold text-gray-900">
            Notification Settings
          </Text>
        </View>

        {renderSection("Job Updates", jobSettings)}
        {renderSection("Diagnostics", diagnosticsSettings)}
        {renderSection("Subscription & System Alerts", subscriptionSettings)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationSettings;

const styles = StyleSheet.create({
  contentContainerTablet: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  contentContainerMobile: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});
