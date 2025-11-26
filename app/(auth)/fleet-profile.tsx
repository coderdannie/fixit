import { useFleetProfileSetupMutation } from "@/apis/accountSetupQuery";
import { useGetStatesQuery } from "@/apis/api";
import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import FormInput from "@/components/FormInput";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { FleetProfileFormType } from "@/types/app";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";

const FleetProfile = () => {
  const { showSuccess, showError } = useToast();
  const [fleetProfileSetup, { isLoading }] = useFleetProfileSetupMutation();
  const router = useRouter();

  const { data: statesData, isLoading: isLoadingStates } = useGetStatesQuery();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FleetProfileFormType>({
    defaultValues: {
      businessName: "",
      businessAddress: "",
      state: "",
      fleetSize: "",
    },
    mode: "onChange",
  });

  // Watch form values for validation
  const watchedValues = watch();

  // Transform states data for dropdown
  const stateOptions = useMemo(() => {
    if (!statesData?.data) return [];
    return statesData.data.map((state: any) => ({
      name: state.state,
      value: state.alias,
    }));
  }, [statesData]);

  const handleStateSelect = (value: string) => {
    setValue("state", value, { shouldValidate: true });
  };

  // Form submission
  const onSubmit = async (values: FleetProfileFormType) => {
    console.log("Form values:", values);
    try {
      const res = await fleetProfileSetup({
        businessName: values.businessName,
        businessAddress: values.businessAddress,
        state: values.state,
        fleetSize: Number(values.fleetSize),
      }).unwrap();

      if (res) {
        showSuccess("Success", res.message || "Profile created successfully");
        router.replace("/(auth)/upload-profile-picture");
      }
    } catch (error: any) {
      showError("Error", error?.data?.message || "Something went wrong");
    }
  };

  // Check if form is valid (all required fields filled)
  const isFormValid =
    watchedValues.businessName.trim() !== "" &&
    watchedValues.businessAddress.trim() !== "" &&
    watchedValues.state.trim() !== "" &&
    watchedValues.fleetSize.trim() !== "";

  return (
    <AuthLayout currentStep={1} showStepper totalSteps={2}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className={`flex-1 ${isTablet ? "px-10" : "px-6"} `}>
          <Text
            className={`${
              isTablet ? "text-3xl" : "text-2xl"
            } font-semibold text-textPrimary mb-2`}
          >
            Setup your profile
          </Text>
          <Text className="text-[#666666] pt-1 text-base mb-8">
            Tell us about your business and the vehicles you own to start
            tracking and maintaining them in one place.
          </Text>

          {/* Form Fields */}
          <View>
            {/* Business Name */}
            <FormInput
              label="Business Name"
              control={control}
              name="businessName"
              placeholder="Enter business name"
              rules={{ required: "Business name is required" }}
            />

            {/* Business Address */}
            <FormInput
              label="Business Address"
              control={control}
              name="businessAddress"
              placeholder="Enter business address"
              rules={{ required: "Business address is required" }}
              multiline={true}
            />

            {/* State - Using CustomDropdown */}
            <View className="gap-2 mb-6">
              <Text className="text-base font-medium text-textPrimary">
                State
              </Text>
              <CustomDropdown
                options={stateOptions}
                selectedValue={watchedValues.state}
                onSelect={handleStateSelect}
                placeholder="Select state"
                // loading={isLoadingStates}
              />
            </View>

            {/* Fleet Size */}
            <FormInput
              label="Fleet Size"
              control={control}
              name="fleetSize"
              placeholder="Enter fleet size"
              rules={{
                required: "Fleet size is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Please enter a valid number",
                },
              }}
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>

      {/* Continue Button - Fixed at bottom */}
      <View className={`${isTablet ? "px-10" : "px-6"} pb-8 bg-white`}>
        <CustomButton
          onPress={handleSubmit(onSubmit)}
          title="Continue"
          disabled={!isFormValid || isLoadingStates}
          loading={isLoading}
        />
      </View>
    </AuthLayout>
  );
};

export default FleetProfile;
