import { useAddVehicleMutation } from "@/apis/accountSetupQuery";
import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import FormInput from "@/components/FormInput";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { VehicleDetailsFormType } from "@/types/app";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";

const VehicleDetails = () => {
  const { showSuccess, showError } = useToast();
  const [addVehicle, { isLoading }] = useAddVehicleMutation();
  const router = useRouter();

  // Dummy data for vehicle types
  const vehicleTypesData = {
    data: [
      { id: "1", name: "Car" },
      { id: "2", name: "Truck" },
      { id: "3", name: "SUV" },
      { id: "4", name: "Van" },
      { id: "5", name: "Motorcycle" },
    ],
  };

  // Dummy data for fuel types
  const fuelTypesData = {
    data: [
      { id: "1", name: "Petrol" },
      { id: "2", name: "Diesel" },
      { id: "3", name: "Electric" },
      { id: "4", name: "Hybrid" },
      { id: "5", name: "CNG" },
    ],
  };

  const isLoadingVehicleTypes = false;
  const isLoadingFuelTypes = false;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VehicleDetailsFormType>({
    defaultValues: {
      vehicleName: "",
      makeModel: "",
      year: "",
      licensePlateNumber: "",
      vehicleInspectionNumber: "",
      mileage: "",
      vehicleType: "",
      fuelType: "",
    },
    mode: "onChange",
  });

  // Watch form values for validation
  const watchedValues = watch();

  // Transform vehicle types data for dropdown
  const vehicleTypeOptions = useMemo(() => {
    if (!vehicleTypesData?.data) return [];
    return vehicleTypesData.data.map((type: any) => ({
      name: type.name,
      value: type.id,
    }));
  }, [vehicleTypesData]);

  // Transform fuel types data for dropdown
  const fuelTypeOptions = useMemo(() => {
    if (!fuelTypesData?.data) return [];
    return fuelTypesData.data.map((type: any) => ({
      name: type.name,
      value: type.id,
    }));
  }, [fuelTypesData]);

  const handleVehicleTypeSelect = (value: string) => {
    setValue("vehicleType", value, { shouldValidate: true });
  };

  const handleFuelTypeSelect = (value: string) => {
    setValue("fuelType", value, { shouldValidate: true });
  };

  // Form submission
  const onSubmit = async (values: VehicleDetailsFormType) => {
    console.log("Form values:", values);
    try {
      const res = await addVehicle({
        vehicleName: values.vehicleName,
        makeModel: values.makeModel,
        year: Number(values.year),
        licensePlateNumber: values.licensePlateNumber,
        vehicleInspectionNumber: values.vehicleInspectionNumber,
        mileage: Number(values.mileage),
        vehicleType: values.vehicleType,
        fuelType: values.fuelType,
      }).unwrap();

      if (res) {
        showSuccess("Success", res.message || "Vehicle added successfully");
        router.replace("/upload-profile-picture");
      }
    } catch (error: any) {
      showError("Error", error?.data?.message || "Something went wrong");
    }
  };

  // Check if form is valid (all required fields filled)
  const isFormValid =
    watchedValues.vehicleName.trim() !== "" &&
    watchedValues.makeModel.trim() !== "" &&
    watchedValues.year.trim() !== "" &&
    watchedValues.licensePlateNumber.trim() !== "" &&
    watchedValues.vehicleInspectionNumber.trim() !== "" &&
    watchedValues.mileage.trim() !== "" &&
    watchedValues.vehicleType.trim() !== "" &&
    watchedValues.fuelType.trim() !== "";

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
            Add your vehicle details
          </Text>
          <Text className="text-[#666666] pt-1 text-base mb-8">
            Help us understand your vehicle better. Add your car's details so we
            can match you with the right mechanic and ensure accurate
            diagnostics.
          </Text>

          {/* Form Fields */}
          <View>
            {/* Vehicle Name */}
            <FormInput
              label="Vehicle Name"
              control={control}
              name="vehicleName"
              placeholder="Enter vehicle name"
              rules={{ required: "Vehicle name is required" }}
            />

            {/* Make & Model */}
            <FormInput
              label="Make & Model"
              control={control}
              name="makeModel"
              placeholder="Enter make and model"
              rules={{ required: "Make & Model is required" }}
            />

            {/* Year */}
            <FormInput
              label="Year"
              control={control}
              name="year"
              placeholder="Enter year"
              rules={{
                required: "Year is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Please enter a valid year",
                },
              }}
              keyboardType="numeric"
            />

            {/* License Plate Number */}
            <FormInput
              label="License Plate Number"
              control={control}
              name="licensePlateNumber"
              placeholder="Enter license plate number"
              rules={{ required: "License plate number is required" }}
            />

            {/* Vehicle Inspection Number */}
            <FormInput
              label="Vehicle Inspection Number"
              control={control}
              name="vehicleInspectionNumber"
              placeholder="Enter vehicle inspection number"
              rules={{ required: "Vehicle inspection number is required" }}
            />

            {/* Mileage */}
            <FormInput
              label="Mileage"
              control={control}
              name="mileage"
              placeholder="Enter mileage"
              rules={{
                required: "Mileage is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Please enter a valid number",
                },
              }}
              keyboardType="numeric"
            />

            {/* Vehicle Type - Using CustomDropdown */}
            <View className="gap-2 mb-6">
              <Text className="text-base font-medium text-textPrimary">
                Vehicle Type
              </Text>
              <CustomDropdown
                options={vehicleTypeOptions}
                selectedValue={watchedValues.vehicleType}
                onSelect={handleVehicleTypeSelect}
                placeholder="Select vehicle type"
              />
            </View>

            {/* Fuel Type - Using CustomDropdown */}
            <View className="gap-2 mb-6">
              <Text className="text-base font-medium text-textPrimary">
                Fuel Type
              </Text>
              <CustomDropdown
                options={fuelTypeOptions}
                selectedValue={watchedValues.fuelType}
                onSelect={handleFuelTypeSelect}
                placeholder="Select fuel type"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button - Fixed at bottom */}
      <View className={`${isTablet ? "px-10" : "px-6"} pb-8 bg-white`}>
        <CustomButton
          onPress={handleSubmit(onSubmit)}
          title="Continue"
          disabled={!isFormValid || isLoadingVehicleTypes || isLoadingFuelTypes}
          loading={isLoading}
        />
      </View>
    </AuthLayout>
  );
};

export default VehicleDetails;
