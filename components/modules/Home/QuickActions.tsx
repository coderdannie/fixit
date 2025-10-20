import {
  ChatIcon,
  NoteIcon,
  ScanIcon,
  SupportIcon,
} from "@/assets/images/Icon";
import BluetoothScanner from "@/components/common/BluetoothScanner";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

// Define the device type to match our mock scanner
interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
}

const QuickActions = () => {
  const router = useRouter();
  const [showBluetoothScanner, setShowBluetoothScanner] = useState(false);

  const handleNavigateToNotes = () => {
    router.push("/home/job-notes");
  };

  const handleNavigateToChats = () => {
    router.push("/home/chats");
  };

  const handleDiagnosticsScan = () => {
    // Open the Bluetooth scanner modal
    setShowBluetoothScanner(true);
  };

  const handleDeviceConnected = (device: BluetoothDevice) => {
    // Close the scanner modal
    setShowBluetoothScanner(false);

    // Navigate to diagnostics screen with the connected device
    router.push({
      pathname: "/home",
      params: {
        deviceId: device.id,
        deviceName: device.name,
        deviceAddress: device.address,
      },
    });
  };

  const handleCancelScan = () => {
    // Close the scanner modal
    setShowBluetoothScanner(false);
  };

  return (
    <>
      <View className={` ${isTablet ? "px-10" : "px-5"} pt-5`}>
        <Text
          className={`text-textPrimary font-semibold ${isTablet ? "text-2xl" : "text-xl"}`}
        >
          Quick Actions
        </Text>
        <View className="flex-row justify-between items-center mt-4">
          {/* Diagnostics Scan Button */}
          <TouchableOpacity
            className="justify-center items-center"
            onPress={handleDiagnosticsScan}
          >
            <View className="bg-[#EAF0FB] flex justify-center items-center w-[40px] p-[10px] rounded-full">
              <ScanIcon />
            </View>
            <Text
              className={`text-textPrimary ${isTablet ? "text-lg" : "text-base"}  pt-1 text-center`}
            >
              Diagnostics
            </Text>
            <Text
              className={`text-textPrimary ${isTablet ? "text-lg" : "text-base"}   text-center`}
            >
              Scan
            </Text>
          </TouchableOpacity>

          {/* Job Notes Button */}
          <TouchableOpacity
            className="justify-center items-center"
            onPress={handleNavigateToNotes}
          >
            <View className="bg-[#EAF0FB] flex justify-center items-center w-[40px] p-[10px] rounded-full">
              <NoteIcon />
            </View>
            <Text
              className={`text-textPrimary ${isTablet ? "text-lg" : "text-base"}  pt-1 text-center`}
            >
              Job
            </Text>
            <Text
              className={`text-textPrimary ${isTablet ? "text-lg" : "text-base"}   text-center`}
            >
              Notes
            </Text>
          </TouchableOpacity>

          {/* Customer Chat Button */}
          <TouchableOpacity
            className="justify-center items-center"
            onPress={handleNavigateToChats}
          >
            <View className="bg-[#EAF0FB] flex justify-center items-center w-[40px] p-[10px] rounded-full">
              <ChatIcon />
            </View>
            <Text
              className={`text-textPrimary ${isTablet ? "text-lg" : "text-base"}  pt-1 text-center`}
            >
              Customer
            </Text>
            <Text
              className={`text-textPrimary ${isTablet ? "text-lg" : "text-base"}  text-center`}
            >
              Chat
            </Text>
          </TouchableOpacity>

          {/* Customer Support Button */}
          <TouchableOpacity className="justify-center items-center">
            <View className="bg-[#EAF0FB] flex justify-center items-center w-[40px] p-[10px] rounded-full">
              <SupportIcon />
            </View>
            <Text
              className={`text-textPrimary ${isTablet ? "text-lg" : "text-base"}  pt-1 text-center`}
            >
              Customer
            </Text>
            <Text
              className={`text-textPrimary ${isTablet ? "text-lg" : "text-base"}   text-center`}
            >
              Support
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bluetooth Scanner Modal */}
      <Modal
        visible={showBluetoothScanner}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCancelScan}
      >
        <BluetoothScanner
          onDeviceConnected={handleDeviceConnected}
          onCancel={handleCancelScan}
        />
      </Modal>
    </>
  );
};

export default QuickActions;
