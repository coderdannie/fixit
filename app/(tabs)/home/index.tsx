import Icon from "@/components/Icon";
import ActiveJobsScreen from "@/components/modules/Home/ActiveJobs";
import QuickActions from "@/components/modules/Home/QuickActions";
import UpcomingJobs from "@/components/modules/Home/UpcomingJobs";
import { useGetUserProfile } from "@/hooks/userGetUserProfile";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Badge } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const router = useRouter();

  const { userProfile } = useGetUserProfile() as any;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View
        className={` bg-white mt-6 w-full flex-row items-center justify-between ${isTablet ? "px-10" : "px-5"}`}
      >
        <View className={`flex-row items-center justify-center gap-[10px] `}>
          <View
            className={`rounded-full overflow-hidden  ${isTablet ? " w-20 h-20" : "w-16 h-16"}`}
          >
            <Image
              style={{
                resizeMode: "cover",
              }}
              source={{ uri: userProfile?.picture }}
              className="w-full h-full"
            />
          </View>
          <Text
            className={`text-textPrimary font-medium  ${isTablet ? "text-xl" : "text-lg"}`}
          >
            {userProfile?.profile?.businessName}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.push("/home/notifications")}
        >
          <Badge size={18} className={"absolute -top-2 -right-1"}>
            4
          </Badge>
          <Icon
            type="Ionicons"
            name="notifications-outline"
            color="black"
            size={isTablet ? 32 : 26}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <QuickActions />
        <ActiveJobsScreen />
        <UpcomingJobs />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
