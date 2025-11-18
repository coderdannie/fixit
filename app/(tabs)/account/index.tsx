import { useLogoutMutation } from "@/apis/authQuery";
import Icon from "@/components/Icon";
import LogoutBottomSheet from "@/components/modals/LogoutModal";
import useToast from "@/hooks/useToast";
import { clearAuth } from "@/store/slices/authSlice";
import { isTablet } from "@/utils/utils";
import BottomSheet from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const Account = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();
  const logoutRef = useRef<BottomSheet>(null);

  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

  const menuItems = [
    {
      id: 1,
      icon: "bell",
      iconType: "Feather",
      label: "Notification settings",
      route: "/account/notification-settings",
    },
    {
      id: 2,
      icon: "money-bill-1",
      iconType: "FontAwesome6",
      label: "Billing History",
      route: "/account/billing-history",
    },
    {
      id: 3,
      icon: "shield-check-outline",
      iconType: "MaterialCommunityIcons",
      label: "Privacy Policy",
      route: "/privacy-policy",
    },
    {
      id: 4,
      icon: "earphones-alt",
      iconType: "SimpleLineIcons",
      label: "Help & Support",
      route: "/help-support",
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleUpgrade = () => {
    router.push("/");
  };

  const handleDeleteAccount = () => {
    router.push("/(tabs)/account/delete-account");
  };

  // 1. Initial log out press (Opens the bottom sheet)
  const handleLogOutPress = () => {
    logoutRef.current?.expand();
  };

  // 2. Confirmed log out (Performs the API call)
  const handleConfirmLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearAuth());
      router.replace("/(auth)/login");
    } catch (error: any) {
      const errorMessage = error?.data?.message?.toLowerCase().trim();

      console.log(errorMessage);

      // If token expired, clear auth and redirect
      if (
        errorMessage?.includes("invalid token") ||
        errorMessage?.includes("token expired")
      ) {
        dispatch(clearAuth());
        router.replace("/(auth)/login");
        return;
      }

      showError(
        "Error",
        error?.data?.message || "Failed to log out. Please try again."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className={`flex-1 ${isTablet ? "px-10" : "px-6"}`}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-6">
          {/* <BackBtn /> */}

          <Text
            className={`${
              isTablet ? "text-3xl" : "text-2xl"
            } font-semibold text-textPrimary mt-4 mb-6`}
          >
            My Account
          </Text>

          {/* User Profile Card */}
          <View className="rounded-[10px] overflow-hidden mb-6">
            <LinearGradient
              colors={["#2964C2", "#003466"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <ImageBackground
                source={require("../../../assets/images/Pattern.png")}
                className="p-5"
                resizeMode="cover"
                imageStyle={{
                  resizeMode: "cover",
                  width: "50%",
                  height: "100%",
                  right: 0,
                  left: "auto",
                }}
              >
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 rounded-full bg-white items-center justify-center mr-3">
                    <Icon
                      type="Feather"
                      name="user"
                      color="#1B417E"
                      size={24}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-base font-semibold mb-1">
                      Sarah Repairs
                    </Text>
                    <Text className="text-white/80 text-sm">
                      sarahjohn123@gmail.com
                    </Text>
                  </View>
                </View>

                <View className="border-t border-white pt-4">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-white text-sm font-medium mb-1">
                        Free Plan
                      </Text>
                      <Text className="text-white text-xs">
                        Access to basic features
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="bg-white px-4 py-2 rounded-full"
                      onPress={handleUpgrade}
                    >
                      <Text className="text-primary text-sm font-medium">
                        Upgrade Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </LinearGradient>
          </View>

          {/* General Settings Section */}
          <Text
            className={`${
              isTablet ? "text-xl" : "text-base"
            } font-semibold text-textPrimary mb-4`}
          >
            General Settings
          </Text>

          {/* Menu Items */}
          <View className="">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center justify-between py-4 ${
                  index !== menuItems.length - 1
                    ? "border-b border-[#E6E6E6]"
                    : ""
                }`}
                onPress={() => handleNavigation(item.route)}
              >
                <View className="flex-row items-center flex-1">
                  <Icon
                    type={item.iconType as any}
                    name={item.icon}
                    color="#000"
                    size={20}
                  />
                  <Text
                    className={`text-textPrimary ml-3 ${isTablet ? "text-base" : "text-sm"}`}
                  >
                    {item.label}
                  </Text>
                </View>
                <Icon
                  type="Feather"
                  name="chevron-right"
                  color="#000"
                  size={20}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Delete Account Button */}
          <TouchableOpacity
            className="flex-row items-center pb-4 pt-6 border-t border-[#E6E6E6]"
            onPress={handleDeleteAccount}
          >
            <Icon type="Feather" name="trash-2" color="#CC0000" size={20} />
            <Text className="text-[#CC0000] text-base ml-3">
              Delete Account
            </Text>
          </TouchableOpacity>

          {/* Log Out Button */}
          <TouchableOpacity
            className="flex-row items-center py-4 mb-8"
            onPress={handleLogOutPress}
            disabled={isLogoutLoading}
          >
            <Icon type="Feather" name="log-out" color="#CC0000" size={20} />
            <Text className="text-[#CC0000] text-base ml-3">Log Out</Text>
            {isLogoutLoading && (
              <ActivityIndicator
                size="small"
                color="#CC0000"
                className="ml-2"
              />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Bottom Sheet */}
      <LogoutBottomSheet
        ref={logoutRef}
        onConfirm={handleConfirmLogout}
        onClose={() => console.log("Logout bottom sheet closed")}
      />
    </SafeAreaView>
  );
};

export default Account;
