import { isTablet } from "@/utils/utils";
import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onProceed?: () => void;
  title?: string;
  btnText?: string;
  desc?: string;
}

const SuccessModal = ({
  isVisible,
  onClose,
  onProceed,
  title,
  btnText,
  desc,
}: ModalProps) => {
  const handleProceed = () => {
    if (onProceed) {
      onProceed();
    }
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-5">
        <View className="bg-[#F5F5F5] rounded-[32px] p-10 items-center w-full max-w-[450px] shadow-2xl">
          {/* Success Icon */}
          <View className="mb-8">
            <Image
              className="w-[135px] h-[135px]"
              source={require("../../assets/images/sucess.png")}
            />
          </View>

          {/* Title */}
          <Text
            className={`${isTablet ? "text-4xl" : "text-3xl"} font-semibold text-[#1F2937] mb-4 text-center`}
          >
            {title}
          </Text>

          {/* Description */}
          <Text className="text-base text-[#666666] text-center leading-6 mb-8 px-2">
            {desc}
          </Text>

          {/* Proceed Button */}
          <TouchableOpacity
            className="bg-primary py-[18px] px-12 rounded-full w-full items-center shadow-lg active:opacity-80"
            onPress={handleProceed}
            activeOpacity={0.8}
          >
            <Text className="text-white  font-semibold">{btnText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
