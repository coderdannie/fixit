import { useMechanicProfileSetupMutation } from "@/apis/accountSetupQuery";
import { experienceOptions } from "@/components/common/constant";
import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import CustomTimePicker from "@/components/CustomTimePicker";
import FormInput from "@/components/FormInput";
import Icon from "@/components/Icon";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { MechanicProfileFormType } from "@/types/app";
import { isTablet } from "@/utils/utils";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// --- NEW UTILITY FUNCTION TO CONVERT 12HR (e.g., "9:00 AM") TO 24HR (e.g., "09:00") FOR API ---
const convertTo24Hour = (time12: string): string => {
  if (!time12 || !time12.includes(" ")) return "";

  const [time, period] = time12.split(" ");
  let [hours, minutes] = time.split(":");
  let h = parseInt(hours, 10);

  if (period === "PM" && h !== 12) {
    h += 12;
  } else if (period === "AM" && h === 12) {
    h = 0;
  }

  return `${h.toString().padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};
// -------------------------------------------------------------------------------------------------

const MechanicProfileSetup = () => {
  const { showSuccess, showError } = useToast();

  const [mechanicProfileSetup, { isLoading, error }] =
    useMechanicProfileSetupMutation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<MechanicProfileFormType>({
    defaultValues: {
      businessName: "",
      businessAddress: "",
      yearsOfExperience: "",
      availabilityFrom: "",
      availabilityTo: "",
    },
    mode: "onChange",
  });

  // Watch form values for validation
  const watchedValues = watch();

  // Bottom sheet refs (only for time pickers now)
  const fromTimePickerRef = useRef<BottomSheet>(null);
  const toTimePickerRef = useRef<BottomSheet>(null);

  // --- REMOVED convertTo12Hour function - it is no longer needed for display ---

  // Handle experience selection
  const handleExperienceSelect = (value: string) => {
    setValue("yearsOfExperience", value, { shouldValidate: true });
  };

  // Handle time selection - CustomTimePicker now outputs 12-hour string with AM/PM
  const handleFromTimeSelect = useCallback(
    (time: string) => {
      setValue("availabilityFrom", time, { shouldValidate: true });
    },
    [setValue]
  );

  const handleToTimeSelect = useCallback(
    (time: string) => {
      setValue("availabilityTo", time, { shouldValidate: true });
    },
    [setValue]
  );

  // Open time picker
  const openFromTimePicker = () => {
    fromTimePickerRef.current?.expand();
  };

  const openToTimePicker = () => {
    toTimePickerRef.current?.expand();
  };

  // Form submission
  const onSubmit = async (values: MechanicProfileFormType) => {
    console.log("Form values:", values);
    try {
      const res = await mechanicProfileSetup({
        businessName: values?.businessName,
        businessAddress: values?.businessAddress,
        yearsOfExperience: Number(values?.yearsOfExperience),

        // --- REVISED: Convert 12-hour state value to 24-hour API value ---
        availabilityStartTime: convertTo24Hour(values?.availabilityFrom),
        availabilityEndTime: convertTo24Hour(values?.availabilityTo),
        // ----------------------------------------------------------------
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
    watchedValues.yearsOfExperience !== "" &&
    watchedValues.availabilityFrom !== "" &&
    watchedValues.availabilityTo !== "";

  return (
    <>
      <AuthLayout currentStep={1} showStepper={true}>
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
              Mechanic profile setup
            </Text>
            <Text className="text-[#666666] pt-1 text-base mb-8">
              Tell us more about your skills and experience so we can connect
              you with the right repair jobs. Setting up your profile makes it
              easier for you to get matched with service requests faster.
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

              {/* Years of Experience - Now using CustomDropdown */}
              <View className="gap-2 mb-6">
                <Text className="text-base font-medium text-textPrimary">
                  Years of Experience
                </Text>
                <CustomDropdown
                  options={experienceOptions}
                  selectedValue={watchedValues.yearsOfExperience}
                  onSelect={handleExperienceSelect}
                  placeholder="Select years of experience"
                />
              </View>

              {/* Availability Section */}
              <View className="gap-4 pt-6">
                <Text className="text-base font-medium text-textPrimary">
                  Select Availability
                </Text>

                <View className="flex-row gap-4">
                  {/* From Time */}
                  <View className="flex-1 gap-2">
                    <TouchableOpacity
                      onPress={openFromTimePicker}
                      className={`border  px-4 py-4 flex-row items-center justify-between border-[#E6E6E6] bg-white  rounded-[50px]`}
                      activeOpacity={0.7}
                    >
                      <Text
                        className={`text-base ${
                          watchedValues.availabilityFrom
                            ? "text-textPrimary"
                            : "text-gray-400"
                        }`}
                      >
                        {/* --- REVISED DISPLAY LOGIC --- */}
                        {watchedValues.availabilityFrom
                          ? watchedValues.availabilityFrom // Use state value directly (e.g., "9:00 AM")
                          : "From"}
                        {/* ----------------------------- */}
                      </Text>
                      <Icon
                        type="Feather"
                        name="chevron-down"
                        size={18}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* To Time */}
                  <View className="flex-1 gap-2">
                    <TouchableOpacity
                      onPress={openToTimePicker}
                      className={`border  px-4 py-4 flex-row items-center justify-between border-[#E6E6E6] bg-white  rounded-[50px]`}
                      activeOpacity={0.7}
                    >
                      <Text
                        className={`text-base ${
                          watchedValues.availabilityTo
                            ? "text-textPrimary"
                            : "text-gray-400"
                        }`}
                      >
                        {/* --- REVISED DISPLAY LOGIC --- */}
                        {watchedValues.availabilityTo
                          ? watchedValues.availabilityTo // Use state value directly (e.g., "5:00 PM")
                          : "To"}
                        {/* ----------------------------- */}
                      </Text>
                      <Icon
                        type="Feather"
                        name="chevron-down"
                        size={18}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Continue Button - Fixed at bottom */}
        <View className={`${isTablet ? "px-10" : "px-6"} pb-8 bg-white`}>
          <CustomButton
            onPress={handleSubmit(onSubmit)}
            title="Continue"
            disabled={!isFormValid}
            loading={isLoading}
          />
        </View>
      </AuthLayout>

      {/* From Time Picker */}
      <CustomTimePicker
        ref={fromTimePickerRef}
        title="Select Start Time"
        // Ensure initial selected time is 12-hour format for the picker if it's currently a 24-hour default
        selectedTime={watchedValues.availabilityFrom || "9:00 AM"}
        onTimeSelect={handleFromTimeSelect}
      />

      {/* To Time Picker */}
      <CustomTimePicker
        ref={toTimePickerRef}
        title="Select End Time"
        // Ensure initial selected time is 12-hour format for the picker if it's currently a 24-hour default
        selectedTime={watchedValues.availabilityTo || "5:00 PM"}
        onTimeSelect={handleToTimeSelect}
      />
    </>
  );
};

export default MechanicProfileSetup;
