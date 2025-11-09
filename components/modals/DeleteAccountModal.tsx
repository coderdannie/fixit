import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleConfirm = () => {
    if (password.trim()) {
      onConfirm(password);
      setPassword("");
    }
  };

  const handleClose = () => {
    setPassword("");
    setShowPassword(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View
          className={`bg-white rounded-2xl ${
            isTablet ? "w-[500px]" : "w-[90%]"
          }`}
          style={styles.modalContainer}
        >
          {/* Close Button */}
          <Pressable
            onPress={handleClose}
            className="absolute top-4 right-4 z-10"
          >
            <Icon type="Ionicons" name="close" size={24} color="#000" />
          </Pressable>

          {/* Content */}
          <View className={`${isTablet ? "p-8" : "p-6"} mt-8`}>
            <Text
              className={`text-gray-900 font-semibold text-center mb-6 ${
                isTablet ? "text-lg leading-7" : " leading-6"
              }`}
            >
              Please confirm that you want to delete your account
            </Text>

            {/* Password Input Section */}
            <View className="mb-12">
              <Text
                className={`text-[#191919]  mb-2 ${
                  isTablet ? "text-base" : "text-sm"
                }`}
              >
                Enter Your Password to Continue
              </Text>

              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  className={`border border-gray-300 rounded-full pr-12 py-4 px-4 ${
                    isTablet ? "text-base" : "text-sm "
                  }`}
                  style={styles.textInput}
                />

                {/* Eye Icon */}
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ transform: [{ translateY: -12 }] }}
                >
                  <Icon
                    type="Ionicons"
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </Pressable>
              </View>
            </View>

            {/* Delete Button */}
            <CustomButton
              title="Delete My Account"
              onPress={handleConfirm}
              disabled={!password.trim()}
              containerClassName="bg-[#CC0000]"
              isCustomDisabled
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteAccountModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  textInput: {
    fontFamily: "System",
  },
});
