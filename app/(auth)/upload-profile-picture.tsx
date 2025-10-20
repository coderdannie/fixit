import { useCreateGeneralSignatureMutation } from "@/apis/authQuery";
import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";
import useImagePicker from "@/hooks/useImagePicker";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const UploadProfilePicture = () => {
  const { showSuccess, showError } = useToast();
  const { selectedImage, pickImage } = useImagePicker();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  // const [createUploadSignature, { isLoading: isCreatingSignature }] =
  //   useCreateUploadSignatureMutation();

  const [createGeneralSignature, { isLoading: isCreatingSignature }] =
    useCreateGeneralSignatureMutation();

  const handleSubmit = async () => {
    if (!selectedImage?.uri) {
      showError("Error", "Please select an image");
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
      // In React Native, we pass the URI directly with metadata
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

      showSuccess("Success", "Profile image uploaded successfully");

      router.push("/(auth)/service");
    } catch (error: any) {
      showError(
        "Error",
        error?.data?.message || error?.message || "Something went wrong"
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
          Upload profile picture
        </Text>
        <Text
          className={`text-[#666666] pt-1  mb-8 ${isTablet ? "text-xl" : "text-base"}`}
        >
          Add a clear photo of yourself to build trust with vehicle owners and
          fleet managers. A profile picture helps clients recognize you and
          makes your profile stand out.
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
                  Tap to upload profile picture
                </Text>
                <Text className="text-[#666666] text-sm text-center pt-1">
                  Max. File Size: 10MB
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <CustomButton
          onPress={handleSubmit}
          disabled={!selectedImage || isLoading}
          containerClassName=" mt-12"
          loading={isLoading}
        />
      </View>
    </AuthLayout>
  );
};

export default UploadProfilePicture;
