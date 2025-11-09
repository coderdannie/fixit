import BackBtn from "@/components/BackBtn";
import Icon from "@/components/Icon";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import { isTablet } from "@/utils/utils";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UploadFile = () => {
  const { storedValue } = useAsyncStorage("file-type");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSource, setUploadSource] = useState<"camera" | "phone" | null>(
    null
  );

  // Request camera permissions
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  // Request media library permissions
  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Photo library permission is required to upload images.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  // Handle taking a photo
  const handleTakePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setUploadSource("camera");
        // Here you can handle the upload to your server
        console.log("Photo taken:", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle uploading from phone
  const handleUploadFromPhone = async () => {
    try {
      const hasPermission = await requestMediaLibraryPermission();
      if (!hasPermission) return;

      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setUploadSource("phone");
        // Here you can handle the upload to your server
        console.log("Image selected:", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 bg-white`}>
      <View className={`${isTablet ? "px-10" : "px-5"} mt-6`}>
        <View className="pb-4">
          <BackBtn isMarginBottom />
        </View>
        <View className="mb-6">
          <Text
            className={`font-semibold text-gray-900 mb-2 ${
              isTablet ? "text-2xl leading-[40px]" : "text-xl leading-8"
            }`}
          >
            {storedValue?.includes("ID")
              ? "Upload ID Card"
              : "Upload your Certification"}
          </Text>
          <Text
            className={`text-gray-600 ${
              isTablet ? "text-base leading-6" : "text-sm leading-5"
            }`}
          >
            {storedValue?.includes("ID")
              ? "Please upload a clear photo of your ID card. This will help us verify your identity and secure your account."
              : "Please upload a clear photo of your any certification you have gotten during the course of your work. This will help us confirm your expertise."}
          </Text>
        </View>

        {/* Image Preview Area */}
        <View className="border-2 border-dashed border-[#666666] rounded-lg mb-6 overflow-hidden p-2">
          {selectedImage ? (
            <View className="relative">
              <Image
                source={{ uri: selectedImage }}
                className={`w-full ${isTablet ? "h-80" : "h-48"}`}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => {
                  setSelectedImage(null);
                  setUploadSource(null);
                }}
                className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
              >
                <Text className="text-white font-semibold">✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              className={`${isTablet ? "h-80" : "h-48"} justify-center items-center`}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#2964C2" />
              ) : (
                <Text className="text-gray-400 text-sm">No image selected</Text>
              )}
            </View>
          )}
        </View>

        {selectedImage ? (
          <>
            {/* Continue Button */}
            <TouchableOpacity
              onPress={() => {
                // Handle continue/submit action
                console.log("Continue with image:", selectedImage);
                // Navigate to next screen or submit
              }}
              className="bg-primary rounded-full py-4 mb-5 flex-row items-center justify-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">
                Continue
              </Text>
            </TouchableOpacity>

            {/* Retake Photo or Upload from Phone Button */}
            {uploadSource === "camera" ? (
              <TouchableOpacity
                onPress={handleTakePhoto}
                disabled={isLoading}
                className={`bg-white border border-[#E6E6E6] rounded-full py-4 flex-row items-center justify-center ${
                  isLoading ? "opacity-50" : ""
                }`}
                activeOpacity={0.8}
              >
                <Icon
                  type="Entypo"
                  name="camera"
                  color="#2964C2"
                  size={isTablet ? 24 : 20}
                />
                <Text className="text-primary font-semibold text-base ml-2">
                  Retake Photo
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleUploadFromPhone}
                disabled={isLoading}
                className={`bg-white border border-[#E6E6E6] rounded-full py-4 flex-row items-center justify-center ${
                  isLoading ? "opacity-50" : ""
                }`}
                activeOpacity={0.8}
              >
                <Icon
                  type="MaterialCommunityIcons"
                  name="cellphone"
                  color="#2964C2"
                  size={isTablet ? 24 : 20}
                />
                <Text className="text-primary font-semibold text-base ml-2">
                  Upload from Phone
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            {/* Take Photo Button */}
            <TouchableOpacity
              onPress={handleTakePhoto}
              disabled={isLoading}
              className={`bg-primary rounded-full py-4 mb-5 flex-row items-center justify-center ${
                isLoading ? "opacity-50" : ""
              }`}
              activeOpacity={0.8}
            >
              <Icon
                type="Entypo"
                name="camera"
                color="white"
                size={isTablet ? 24 : 20}
              />
              <Text className="text-white font-semibold text-base ml-2">
                Take Photo
              </Text>
            </TouchableOpacity>

            {/* Upload from Phone Button */}
            <TouchableOpacity
              onPress={handleUploadFromPhone}
              disabled={isLoading}
              className={`bg-white border border-[#E6E6E6] rounded-full py-4 flex-row items-center justify-center ${
                isLoading ? "opacity-50" : ""
              }`}
              activeOpacity={0.8}
            >
              <Icon
                type="MaterialCommunityIcons"
                name="cellphone"
                color="#2964C2"
                size={isTablet ? 24 : 20}
              />
              <Text className="text-primary font-semibold text-base ml-2">
                Upload from Phone
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UploadFile;
