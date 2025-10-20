import { useCreateAccountTypeMutation } from "@/apis/accountSetupQuery";
import { BusIcon, ToolIcon, UserIcon } from "@/assets/images/Icon";
import { languages, roleOptions } from "@/components/common/constant";
import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import Icon from "@/components/Icon";
import useToast from "@/hooks/useToast";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RoleSelection = () => {
  const { showSuccess, showError } = useToast();

  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const [createAccountType, { isLoading }] = useCreateAccountTypeMutation();

  const router = useRouter();

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = async () => {
    try {
      const res = await createAccountType({
        role: selectedRole.toUpperCase(),
      }).unwrap();

      if (res) {
        showSuccess("Success", res.message || "Account created successfully");
        if (selectedRole.includes("mechanic")) {
          router.push("/(auth)/mechanic-profile-setup");
        }
      }
    } catch (error: any) {
      showError("Error", error?.data?.message || "Something went wrong");
    }
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className={`flex-1 ${isTablet ? "px-10" : "px-6"} py-6`}>
          {/* Header with Language Selector */}
          <View className="flex-row justify-end mb-8 ">
            <View className="w-[130px]">
              <CustomDropdown
                options={languages}
                selectedValue={selectedLanguage}
                onSelect={handleLanguageSelect}
              />
            </View>
          </View>

          {/* Title and Description */}
          <View className="mb-8">
            <Text
              className={`${
                isTablet ? "text-3xl" : "text-2xl"
              } font-semibold text-textPrimary mb-2`}
            >
              How will you be using Fixit?
            </Text>
            <Text className="text-base text-[#666666] leading-6">
              Choose how you will use FIXIT. You can change your selection
              anytime in your profile settings.
            </Text>
          </View>

          {/* Role Options */}
          <View className="space-y-4 gap-4 mb-8">
            {roleOptions.map((role, i) => (
              <TouchableOpacity
                key={role.id}
                onPress={() => handleRoleSelect(role.id)}
                className={`border-2 rounded-2xl p-6 ${
                  selectedRole === role.id
                    ? "border-primary bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    {/* Icon */}
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                        selectedRole === role.id ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      {i === 0 ? (
                        <UserIcon />
                      ) : i === 1 ? (
                        <BusIcon />
                      ) : (
                        <ToolIcon />
                      )}
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900 mb-1">
                        {role.title}
                      </Text>
                      <Text className="text-sm text-gray-600 leading-5">
                        {role.description}
                      </Text>
                    </View>
                  </View>

                  {/* Radio Button */}
                  {selectedRole === role.id ? (
                    <Icon
                      type="AntDesign"
                      name="check-circle"
                      size={20}
                      color="#2964C2"
                    />
                  ) : (
                    <View
                      className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                        selectedRole === role.id
                          ? ""
                          : "border-gray-300 bg-white"
                      }`}
                    ></View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Continue Button - Fixed at bottom */}
      <View className={`${isTablet ? "px-10" : "px-6"} pb-8 bg-white`}>
        <CustomButton
          onPress={handleContinue}
          title="Proceed"
          disabled={!selectedRole}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default RoleSelection;
