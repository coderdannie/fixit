import { useCreateGeneralSignatureMutation } from "@/apis/authQuery";
import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import useImagePicker from "@/hooks/useImagePicker";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next"; // <-- Import useTranslation
import { Image, Text, TouchableOpacity, View } from "react-native";

const UploadProfilePicture = () => {
  const { t } = useTranslation(); // <-- Initialize useTranslation
  const { showSuccess, showError } = useToast();
  const { selectedImage, pickImage } = useImagePicker();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const { storedValue: account_type } = useAsyncStorage("account-type");
  const [createGeneralSignature, { isLoading: isCreatingSignature }] =
    useCreateGeneralSignatureMutation();

  console.log("account type", account_type);

  const instructionKey = useMemo(() => {
    if (account_type === "mechanic") {
      // Original instruction for mechanics
      return "uploadProfilePictureScreen.instruction_mechanic";
    } else if (account_type === "fleet_manager") {
      // New instruction for fleet managers
      return "uploadProfilePictureScreen.instruction_fleet_manager";
    } else {
      // New instruction for vehicle owners (the else part)
      return "uploadProfilePictureScreen.instruction_vehicle_owner";
    }
  }, [account_type]);

  const displayInstruction = t(instructionKey, {
    // Fallback text in case the key is missing in translation files
    defaultValue:
      account_type === "fleet_manager"
        ? "Upload a clear picture of yourself or business logo to give your fleet profile a recognizable identity."
        : account_type === "mechanic"
          ? "Add a clear photo of yourself to build trust with vehicle owners and fleet managers. A profile picture helps clients recognize you and makes your profile stand out."
          : "Upload a clear picture of yourself. This helps mechanics confirm they’re meeting the right person during a service request.",
  });

  const handleSubmit = async () => {
    if (!selectedImage?.uri) {
      showError(
        t("common.error"),
        t("uploadProfilePictureScreen.selectImageError")
      );
      return;
    }

    try {
      setIsUploading(true);

      // Step 1: Get signature from backend
      const signatureResponse = await createGeneralSignature({
        resourceType: "image",
        folderName: "profile picture",
        tags: ["profile"],
      }).unwrap();

      // Step 2: Create file object for React Native
      const fileToUpload = {
        uri: selectedImage.uri,
        type: selectedImage.mimeType ?? "image/jpeg",
        name: selectedImage.fileName ?? "profile.jpg",
      };

      // Step 3: Upload to Cloudinary
      await uploadToCloudinary(fileToUpload, {
        signature: signatureResponse.data.signature,
        timestamp: signatureResponse.data.timestamp,
        cloudName: signatureResponse.data.cloudName,
        apiKey: signatureResponse.data.apiKey,
        folder: signatureResponse.data.params.folder,
        publicId: signatureResponse.data.params.public_id,
        tags: signatureResponse.data.params.tags.split(","),
      });

      showSuccess(
        t("common.success"),
        t("uploadProfilePictureScreen.uploadSuccess")
      );

      router.push("/(auth)/service");
    } catch (error: any) {
      showError(
        t("common.error"),
        error?.data?.message || t("common.somethingWentWrong")
      );
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading = isCreatingSignature || isUploading;

  return (
    <AuthLayout currentStep={2} showStepper={true}>
      <View className={`flex-1 ${isTablet ? "px-10" : "px-6"} `}>
        <Text
          className={`${
            isTablet ? "text-3xl" : "text-2xl"
          } font-semibold text-textPrimary mb-2`}
        >
          {t("uploadProfilePictureScreen.title")}
        </Text>
        <Text
          className={`text-[#666666] pt-1  mb-8 ${isTablet ? "text-xl" : "text-base"}`}
        >
          {displayInstruction}
        </Text>

        {/* profile image */}
        <View
          className={`w-full items-center justify-center  ${
            isTablet ? "mt-14" : "mt-[25px]"
          }`}
        >
          <TouchableOpacity
            onPress={pickImage}
            disabled={isLoading}
            className={` relative h-64 p-3 z-0 bg-[#F7F9FD] border border-[#E6E6E6] rounded-[10px]  border-dashed items-center justify-center w-full`}
          >
            {selectedImage ? (
              <Image
                source={selectedImage?.uri && { uri: selectedImage.uri }}
                className=" w-[140px]  aspect-square rounded-full"
                resizeMode="cover"
              />
            ) : (
              <View>
                <View className="bg-[#E3E5E8] p-[6px]   justify-center items-center rounded-full w-14 h-14 mx-auto">
                  <Icon
                    type="Feather"
                    name="upload-cloud"
                    color="#222883"
                    size={28}
                  />
                </View>
                <Text className="font-semibold pt-[10px]">
                  {t("uploadProfilePictureScreen.uploadPrompt")}
                </Text>
                <Text className="text-[#666666] text-sm text-center pt-1">
                  {t("uploadProfilePictureScreen.maxFileSize")}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <CustomButton
          onPress={handleSubmit}
          disabled={!selectedImage || isLoading}
          containerClassName=" mt-12"
          title={t("common.continue")}
          loading={isLoading}
        />
      </View>
    </AuthLayout>
  );
};

export default UploadProfilePicture;
