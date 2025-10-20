import { useAddServicesMutation } from "@/apis/accountSetupQuery";
import { services } from "@/components/common/constant";
import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Service = () => {
  const { showSuccess, showError } = useToast();

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const router = useRouter();

  const [addServices, { isLoading }] = useAddServicesMutation();

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleContinue = async () => {
    console.log("Selected services:", selectedServices);

    const payload = { services: selectedServices };
    console.log("Payload:", JSON.stringify(payload));

    try {
      const res = await addServices(payload).unwrap();

      if (res) {
        showSuccess("Success", res.message || "Service(s) added successfully");
        router.push("/(auth)/stay_connected");
      }
    } catch (error: any) {
      console.error(
        "Validation errors:",
        JSON.stringify(error?.data?.errors, null, 2)
      );
      const errorMessage =
        error?.data?.message || "Failed to save services. Please try again.";
      showError("Error", errorMessage);
      console.error("Add services error:", error);
    }
  };

  const isSelected = (serviceId: string) =>
    selectedServices.includes(serviceId);

  return (
    <AuthLayout currentStep={3} showStepper={true}>
      <View className={`flex-1 ${isTablet ? "px-10" : "px-6"}`}>
        <Text
          className={`${
            isTablet ? "text-3xl" : "text-2xl"
          } font-semibold text-textPrimary mb-2`}
        >
          What services would you offer on Fixit?
        </Text>
        <Text
          className={`text-[#666666] pt-1 mb-8 ${isTablet ? "text-xl" : "text-base"}`}
        >
          Tell us what you're great at! From engine repairs to electrical work,
          choose the services you'd like to offer so drivers and fleet owners
          can connect with the right mechanic for the job.
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap gap-3">
            {services.map((service, index) => (
              <TouchableOpacity
                key={service.id}
                onPress={() => toggleService(service.id)}
                className={`
                  flex-row items-center px-4 py-3 rounded-full
                  ${isSelected(service.id) ? "bg-[#191919]" : "bg-[#E3E5E8]"}
                  ${isTablet ? "px-5 py-4" : "px-3 py-[13px]"}
                `}
                style={{ flexBasis: "auto" }}
                activeOpacity={0.9}
                disabled={isLoading}
              >
                <View
                  className={`
                    w-6 h-6 rounded-full items-center justify-center mr-2
                    ${isSelected(service.id) ? "bg-[#191919]" : "bg-white"}
                  `}
                >
                  <Icon
                    type={service.iconType as any}
                    name={service.iconName}
                    size={14}
                    color={isSelected(service.id) ? service.color : "#666"}
                  />
                </View>

                <Text
                  className={`
                    font-medium
                    ${isSelected(service.id) ? "text-white" : "text-[#464D53]"}
                    ${isTablet ? "text-base" : "text-sm"}
                  `}
                >
                  {service.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="pt-[50px]">
            <CustomButton
              onPress={handleContinue}
              disabled={selectedServices.length === 0 || isLoading}
              loading={isLoading}
            />
          </View>
        </ScrollView>
      </View>
    </AuthLayout>
  );
};

export default Service;
