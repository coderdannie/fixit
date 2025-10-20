import React from "react";
import { Image, Modal, Text, View } from "react-native";
import CustomButton from "../CustomButton";

interface RequestSentModalProps {
  visible: boolean;
  onClose: () => void;
  handleNavigate: () => void;
}

const RequestSentModal: React.FC<RequestSentModalProps> = ({
  visible,
  onClose,
  handleNavigate,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl w-full max-w-sm p-8 items-center">
          {/* Success Icon */}
          <View className="w-28 h-28 rounded-full items-center justify-center mb-6">
            <Image
              className="w-28 h-28"
              source={require("../../assets/images/success.gif")}
            />
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-gray-900 mb-3">
            Request Sent
          </Text>

          {/* Description */}
          <Text className="text-sm text-[#666666] text-center mb-8 leading-5">
            Your request for an additional 4 days has been submitted. You'll be
            notified once it's approved.
          </Text>
          <CustomButton title="Return to Dasboard" onPress={handleNavigate} />
        </View>
      </View>
    </Modal>
  );
};

export default RequestSentModal;
