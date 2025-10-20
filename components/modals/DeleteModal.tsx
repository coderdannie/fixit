// DeleteConfirmationModal.tsx
import { isTablet } from "@/utils/utils";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface DeleteConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  description?: string;
  isLoading?: boolean;
  isDanger?: boolean;
}

const DeleteConfirmationModal = ({
  isVisible,
  onClose,
  onConfirm,
  title = "Delete Note",
  confirmText = "Delete",
  cancelText = "Cancel",
  description = "Are you sure you want to delete this note? This action cannot be undone.",
  isLoading = false,
  isDanger,
}: DeleteConfirmationModalProps) => {
  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-5">
        <View className="bg-[#F5F5F5] rounded-[32px] p-8 items-center w-full max-w-[450px] shadow-2xl">
          {/* Warning/Delete Icon */}
          <View className="mb-6">
            <View className="w-20 h-20 bg-red-100 rounded-full justify-center items-center">
              <Text className="text-red-500 text-3xl">⚠️</Text>
              {/* Alternatively, you can use an image or icon component */}
              {/* <Image
                className="w-16 h-16"
                source={require("../../assets/images/delete-warning.png")}
              /> */}
            </View>
          </View>

          {/* Title */}
          <Text
            className={`${isTablet ? "text-3xl" : "text-2xl"} font-semibold text-[#1F2937] mb-3 text-center`}
          >
            {title}
          </Text>

          {/* Description */}
          <Text className="text-base text-[#666666] text-center leading-6 mb-8 px-2">
            {description}
          </Text>

          {/* Action Buttons */}
          <View className="flex-row gap-4 w-full">
            {/* Cancel Button */}
            <TouchableOpacity
              className="flex-1 bg-gray-300 py-4 px-6 rounded-full items-center shadow-lg active:opacity-80"
              onPress={handleCancel}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text className="text-gray-800 text-lg font-semibold">
                {cancelText}
              </Text>
            </TouchableOpacity>

            {/* Confirm/Delete Button */}
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-full items-center shadow-lg active:opacity-80 ${
                isDanger ? "bg-red-500" : "bg-primary"
              } ${isLoading ? "opacity-50" : ""}`}
              onPress={handleConfirm}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-semibold">
                {isLoading ? "Deleting..." : confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModal;
