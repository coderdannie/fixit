import { useMechanicProfileSetupMutation } from "@/apis/accountSetupQuery";
import { useGetStateLgsQuery, useGetStatesQuery } from "@/apis/api";
import { experienceOptions } from "@/components/common/constant";
import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import CustomTimePicker from "@/components/CustomTimePicker";
import FormInput from "@/components/FormInput";
import Icon from "@/components/Icon";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { MechanicProfileFormType } from "@/types/app";
import { convertTo24Hour, isTablet } from "@/utils/utils";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useTranslation } from "react-i18next";

const MechanicProfileSetup = () => {
  const { t } = useTranslation();

  const { showSuccess, showError } = useToast();
  const { data: statesData, isLoading: isLoadingStates } = useGetStatesQuery();

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
      state: "",
      lga: "",
      yearsOfExperience: "",
      availabilityFrom: "",
      availabilityTo: "",
    },
    mode: "onChange",
  });

  // Watch form values for validation
  const watchedValues = watch();

  // Fetch LGAs based on selected state
  const { data: lgasData, isLoading: isLoadingLgas } = useGetStateLgsQuery(
    { state: watchedValues.state },
    { skip: !watchedValues.state } // Skip query if no state is selected
  );

  // Bottom sheet refs (only for time pickers now)
  const fromTimePickerRef = useRef<BottomSheet>(null);
  const toTimePickerRef = useRef<BottomSheet>(null);

  // Transform states data for dropdown
  const stateOptions = useMemo(() => {
    if (!statesData?.data) return [];
    return statesData.data.map((state: any) => ({
      name: state.state,
      value: state.alias,
    }));
  }, [statesData]);

  // Transform LGAs data for dropdown
  const lgaOptions = useMemo(() => {
    if (!lgasData?.data?.lgas) return [];
    return lgasData.data.lgas.map((lga: string) => ({
      name: lga,
      value: lga,
    }));
  }, [lgasData]);

  // Reset LGA when state changes
  useEffect(() => {
    if (watchedValues.state) {
      setValue("lga", "", { shouldValidate: false });
    }
  }, [watchedValues.state, setValue]);

  // Handle state selection
  const handleStateSelect = (value: string) => {
    setValue("state", value, { shouldValidate: true });
  };

  // Handle LGA selection
  const handleLgaSelect = (value: string) => {
    setValue("lga", value, { shouldValidate: true });
  };

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
        state: values?.state,
        lga: values?.lga,
        yearsOfExperience: Number(values?.yearsOfExperience),
        availabilityStartTime: convertTo24Hour(values?.availabilityFrom),
        availabilityEndTime: convertTo24Hour(values?.availabilityTo),
      }).unwrap();
      if (res) {
        // Use t() for success message keys
        showSuccess(
          t("common.success"),
          res.message || t("mechanicProfileSetup.profileCreatedSuccess")
        );
        router.replace("/(auth)/upload-profile-picture");
      }
    } catch (error: any) {
      // Use t() for error message key
      showError(
        t("common.error"),
        error?.data?.message || t("common.somethingWentWrong")
      );
    }
  };

  // Check if form is valid (all required fields filled)
  const isFormValid =
    watchedValues.businessName.trim() !== "" &&
    watchedValues.businessAddress.trim() !== "" &&
    watchedValues.state.trim() !== "" &&
    watchedValues.lga.trim() !== "" &&
    watchedValues.yearsOfExperience !== "" &&
    watchedValues.availabilityFrom !== "" &&
    watchedValues.availabilityTo !== "";

  return (
    <>
      <AuthLayout currentStep={1} showStepper={true}>
        <ScrollView
          className="flex-1 mb-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className={`flex-1 ${isTablet ? "px-10" : "px-6"} `}>
            <Text
              className={`${
                isTablet ? "text-3xl" : "text-2xl"
              } font-semibold text-textPrimary mb-2`}
            >
              {/* Translate Title */}
              {t("mechanicProfileSetup.title")}
            </Text>
            <Text className="text-[#666666] pt-1 text-base mb-8">
              {/* Translate Instruction */}
              {t("mechanicProfileSetup.instruction")}
            </Text>

            {/* Form Fields */}
            <View>
              {/* Business Name */}
              <FormInput
                // Translate Label
                label={t("mechanicProfileSetup.businessNameLabel")}
                control={control}
                name="businessName"
                // Translate Placeholder
                placeholder={t("mechanicProfileSetup.businessNamePlaceholder")}
                // Translate Rule message
                rules={{
                  required: t("mechanicProfileSetup.businessNameRequired"),
                }}
              />

              {/* Business Address */}
              <FormInput
                // Translate Label
                label={t("mechanicProfileSetup.businessAddressLabel")}
                control={control}
                name="businessAddress"
                // Translate Placeholder
                placeholder={t(
                  "mechanicProfileSetup.businessAddressPlaceholder"
                )}
                // Translate Rule message
                rules={{
                  required: t("mechanicProfileSetup.businessAddressRequired"),
                }}
                multiline={true}
              />

              {/* State */}
              <View className="gap-2 mb-6">
                <Text className="text-base font-medium text-textPrimary">
                  {/* Translate Label */}
                  {t("mechanicProfileSetup.stateLabel")}
                </Text>
                <CustomDropdown
                  options={stateOptions}
                  selectedValue={watchedValues.state}
                  onSelect={handleStateSelect}
                  // Translate Placeholder
                  placeholder={t("mechanicProfileSetup.statePlaceholder")}
                />
              </View>

              {/* Local Government Area */}
              <View className="gap-2 mb-6">
                <Text className="text-base font-medium text-textPrimary">
                  {/* Translate Label */}
                  {t("mechanicProfileSetup.lgaLabel")}
                </Text>
                <CustomDropdown
                  options={lgaOptions}
                  selectedValue={watchedValues.lga}
                  onSelect={handleLgaSelect}
                  placeholder={
                    !watchedValues.state
                      ? t("mechanicProfileSetup.lgaPlaceholderNoState")
                      : isLoadingLgas
                        ? t("mechanicProfileSetup.lgaLoading")
                        : t("mechanicProfileSetup.lgaPlaceholder")
                  }
                  disabled={!watchedValues.state || isLoadingLgas}
                />
              </View>

              {/* Years of Experience */}
              <View className="gap-2 mb-6">
                <Text className="text-base font-medium text-textPrimary">
                  {/* Translate Label */}
                  {t("mechanicProfileSetup.experienceLabel")}
                </Text>
                <CustomDropdown
                  options={experienceOptions}
                  selectedValue={watchedValues.yearsOfExperience}
                  onSelect={handleExperienceSelect}
                  // Translate Placeholder
                  placeholder={t("mechanicProfileSetup.experiencePlaceholder")}
                />
              </View>

              {/* Availability Section */}
              <View className="gap-4 pt-6">
                <Text className="text-base font-medium text-textPrimary">
                  {/* Translate Title */}
                  {t("mechanicProfileSetup.availabilityTitle")}
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
                        {watchedValues.availabilityFrom
                          ? watchedValues.availabilityFrom
                          : // Translate Placeholder
                            t(
                              "mechanicProfileSetup.availabilityFromPlaceholder"
                            )}
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
                        {watchedValues.availabilityTo
                          ? watchedValues.availabilityTo
                          : // Translate Placeholder
                            t("mechanicProfileSetup.availabilityToPlaceholder")}
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
            // Translate Title
            title={t("common.continue")}
            disabled={!isFormValid || isLoadingStates || isLoadingLgas}
            loading={isLoading}
          />
        </View>
      </AuthLayout>

      {/* From Time Picker */}
      <CustomTimePicker
        ref={fromTimePickerRef}
        // Translate Title
        title={t("mechanicProfileSetup.timePickerStartTitle")}
        selectedTime={watchedValues.availabilityFrom || "9:00 AM"}
        onTimeSelect={handleFromTimeSelect}
      />

      {/* To Time Picker */}
      <CustomTimePicker
        ref={toTimePickerRef}
        // Translate Title
        title={t("mechanicProfileSetup.timePickerEndTitle")}
        selectedTime={watchedValues.availabilityTo || "5:00 PM"}
        onTimeSelect={handleToTimeSelect}
      />
    </>
  );
};

export default MechanicProfileSetup;
