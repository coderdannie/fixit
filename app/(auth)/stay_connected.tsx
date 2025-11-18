import { useUserSettingsMutation } from "@/apis/accountSetupQuery";
import { ConnectedIcon } from "@/assets/images/Icon";
import CustomButton from "@/components/CustomButton";
import AccSetupSuccess from "@/components/modals/AccSetupSuccess";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, Text, View } from "react-native";

const StayConnected = () => {
  const { t } = useTranslation();
  const { showError } = useToast();

  const [enableNotifications, setEnableNotifications] = useState(false);
  const [allowLocationAccess, setAllowLocationAccess] = useState(true);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const [userSettings, { isLoading }] = useUserSettingsMutation();

  const handleCreateAccount = async () => {
    try {
      const res = await userSettings({
        enableNotification: enableNotifications,
        allowLocationAccess: allowLocationAccess,
      }).unwrap();

      if (res) {
        setIsVisible(true);
      }
    } catch (error: any) {
      // Use translated keys for the toast message
      showError(
        t("common.error"),
        error?.data?.message || t("stayConnectedScreen.failedToSaveSettings")
      );
      console.error("Error saving settings:", error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AuthLayout currentStep={4} showStepper={true}>
      <View className={`flex-1 ${isTablet ? "px-10" : "px-6"}`}>
        {/* Icon Section */}
        <View className="items-center mt-8 mb-8">
          <View className="w-32 h-32 bg-[#EAF0FB] rounded-full items-center justify-center mb-6">
            <View className="relative">
              <ConnectedIcon />
            </View>
          </View>
        </View>

        {/* Title and Description */}
        <View className="mb-8">
          <Text
            className={`${
              isTablet ? "text-3xl" : "text-2xl"
            } font-semibold text-textPrimary mb-2 mt-6`}
          >
            {t("stayConnectedScreen.title")}
          </Text>
          <Text
            className={`text-[#666666] ${isTablet ? "text-xl" : "text-base"}`}
          >
            {t("stayConnectedScreen.description")}{" "}
          </Text>
        </View>

        {/* Permission Toggles */}
        <View className="space-y-8 mb-12 border border-[#E6E6E6] rounded-xl bg-[#F7F9FD] px-5">
          {/* Enable Notifications */}
          <View className="flex-row items-center justify-between py-4">
            <Text
              className={`text-[#191919] ${isTablet ? "text-lg" : "text-base"}`}
            >
              {t("stayConnectedScreen.enableNotifications")}{" "}
            </Text>
            <Switch
              value={enableNotifications}
              onValueChange={setEnableNotifications}
              trackColor={{ false: "#E3E5E8", true: "#2964C2" }}
              thumbColor={enableNotifications ? "#FFFFFF" : "#FFFFFF"}
              ios_backgroundColor="#E5E7EB"
            />
          </View>

          {/* Allow Location Access */}
          <View className="flex-row items-center justify-between py-4">
            <Text
              className={`text-[#191919] ${isTablet ? "text-lg" : "text-base"}`}
            >
              {t("stayConnectedScreen.allowLocationAccess")}{" "}
              {/* <-- Translated Label */}
            </Text>
            <Switch
              value={allowLocationAccess}
              onValueChange={setAllowLocationAccess}
              trackColor={{ false: "#E3E5E8", true: "#2964C2" }}
              thumbColor={allowLocationAccess ? "#FFFFFF" : "#FFFFFF"}
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        </View>

        {/* Create Account Button */}
        <View className="mt-auto mb-8">
          <CustomButton
            title={t("stayConnectedScreen.createAccountButton")}
            onPress={handleCreateAccount}
            containerClassName="w-full"
            loading={isLoading}
          />
        </View>
        <AccSetupSuccess
          isVisible={isVisible}
          onClose={handleClose}
          onProceed={() => router.push("/(tabs)/home")}
        />
      </View>
    </AuthLayout>
  );
};

export default StayConnected;
