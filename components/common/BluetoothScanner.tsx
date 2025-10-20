import { ScanningIcon } from "@/assets/images/Icon";
import Icon from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Check if running on simulator
const isSimulator =
  Platform.OS === "ios" &&
  !Platform.isPad &&
  Platform.constants.interfaceIdiom === "phone";

type ScanStep = "initial" | "enabling" | "scanning" | "device-list";

interface MockBluetoothDevice {
  id: string;
  name: string;
  address: string;
}

interface BluetoothScannerProps {
  onDeviceConnected?: (device: MockBluetoothDevice) => void;
  onCancel?: () => void;
}

const BluetoothScanner: React.FC<BluetoothScannerProps> = ({
  onDeviceConnected,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<ScanStep>("initial");
  const [devices, setDevices] = useState<MockBluetoothDevice[]>([]);
  const [pairedDevices, setPairedDevices] = useState<MockBluetoothDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock devices for simulator testing
  const mockDevices: MockBluetoothDevice[] = [
    { id: "1", name: "OBD-II Scanner", address: "00:1A:7D:DA:71:13" },
    { id: "2", name: "ELM327 v1.5", address: "00:1D:A5:68:98:8B" },
    { id: "3", name: "Vgate iCar Pro", address: "AA:BB:CC:DD:EE:FF" },
  ];

  useEffect(() => {
    checkBluetoothStatus();
  }, []);

  const checkBluetoothStatus = async () => {
    // Simulate checking Bluetooth status
    setTimeout(() => {
      setCurrentStep("initial");
    }, 500);
  };

  const enableBluetooth = async () => {
    try {
      setCurrentStep("enabling");
      setError(null);

      if (Platform.OS === "ios") {
        // iOS: Cannot enable programmatically - must prompt user to go to Settings
        Alert.alert(
          "Enable Bluetooth",
          "Please enable Bluetooth in your device Settings to continue.",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => setCurrentStep("initial"),
            },
            {
              text: "Open Settings",
              onPress: () => {
                // In real implementation: Linking.openSettings();
                // For mock: simulate the flow
                setTimeout(() => {
                  setCurrentStep("scanning");
                  startScan();
                }, 1000);
              },
            },
          ]
        );
      } else {
        // Android: Can request to enable Bluetooth
        // Real implementation would use:
        // const enabled = await RNBluetoothClassic.requestBluetoothEnabled();

        // For mock: simulate the flow
        setTimeout(() => {
          setCurrentStep("scanning");
          startScan();
        }, 1000);
      }
    } catch (err) {
      console.error("Error enabling Bluetooth:", err);
      setError("Failed to enable Bluetooth");
      setCurrentStep("initial");
    }
  };

  const startScan = async () => {
    try {
      setScanning(true);
      setError(null);
      setDevices([]);
      setCurrentStep("scanning");

      // Simulate scanning
      setTimeout(() => {
        setDevices(mockDevices);
        setCurrentStep("device-list");
        setScanning(false);
      }, 2000);
    } catch (err) {
      console.error("Error scanning for devices:", err);
      setError("Failed to scan for devices. Please try again.");
      setScanning(false);
      setCurrentStep("device-list");
    }
  };

  const connectToDevice = async (device: MockBluetoothDevice) => {
    try {
      setConnecting(device.id);
      setError(null);

      // Simulate connection
      setTimeout(() => {
        setConnecting(null);
        onDeviceConnected?.(device);
      }, 1500);
    } catch (err: any) {
      console.error("Error connecting to device:", err);
      setError(
        "Failed to connect. Please ensure the device is nearby and powered on."
      );
      setConnecting(null);
    }
  };

  const cancelScan = () => {
    setScanning(false);
    onCancel?.();
  };

  const renderDeviceItem = ({ item }: { item: MockBluetoothDevice }) => (
    <TouchableOpacity
      onPress={() => connectToDevice(item)}
      disabled={connecting !== null}
      className="bg-white mx-4 mb-3 p-4 rounded-xl border border-gray-200"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <Text
            className={`${isTablet ? "text-base" : "text-sm"} font-semibold text-gray-900 mb-1`}
          >
            {item.name}
          </Text>
          <Text className="text-xs text-gray-500">{item.address}</Text>
        </View>

        {connecting === item.id ? (
          <ActivityIndicator color="#3B82F6" />
        ) : (
          <Icon
            type="MaterialCommunityIcons"
            name="chevron-right"
            size={24}
            color="#9CA3AF"
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View className="items-center justify-center py-12">
      <Icon
        type="MaterialCommunityIcons"
        name="bluetooth-off"
        size={64}
        color="#D1D5DB"
      />
      <Text className="text-gray-500 mt-4 text-base text-center px-8">
        No OBD devices found
      </Text>
      <Text className="text-gray-400 mt-2 text-sm text-center px-8">
        Make sure your OBD device is powered on and in pairing mode
      </Text>
      <TouchableOpacity
        onPress={startScan}
        className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold">Retry Scan</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (currentStep) {
      case "initial":
        return (
          <View className="flex-1 items-center justify-center px-8">
            <View className="w-24 h-24 bg-[#F2F2F2] rounded-full items-center justify-center mb-6">
              <Icon
                type="MaterialCommunityIcons"
                name="bluetooth"
                size={48}
                color="#CCCCCC"
              />
            </View>
            <Text
              className={`${isTablet ? "text-xl" : "text-lg"} font-bold text-gray-900 mb-2`}
            >
              Turn on Bluetooth
            </Text>
            <Text className="text-gray-600 text-center mb-2">
              Bluetooth is required to scan for nearby OBD devices
            </Text>

            {Platform.OS === "ios" && (
              <Text className="text-gray-500 text-xs text-center mb-6 px-4">
                Note: You'll be directed to Settings to enable Bluetooth
              </Text>
            )}

            {/* Simulator Warning */}
            {__DEV__ && (
              <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <Text className="text-yellow-800 text-sm text-center">
                  ⚠️ Demo Mode: Using mock devices for testing
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={enableBluetooth}
              className="bg-primary px-8 py-4 rounded-xl w-full max-w-xs"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold text-base">
                Enable Bluetooth
              </Text>
            </TouchableOpacity>
          </View>
        );

      case "enabling":
        return (
          <View className="flex-1 items-center justify-center px-8">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-600 mt-4 text-center">
              Enabling Bluetooth...
            </Text>
          </View>
        );

      case "scanning":
        return (
          <View className="flex-1 items-center justify-center px-8">
            <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-6">
              <ScanningIcon />
            </View>
            <Text
              className={`${isTablet ? "text-sm" : "text-base"}  text-[#666666] mb-2`}
            >
              Scanning for nearby OBD devices...
            </Text>
            <View className="w-48 h-1 bg-[#E6E6E6] rounded-full mt-4 overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: "50%" }}
              />
            </View>

            <TouchableOpacity
              onPress={cancelScan}
              className="w-full mt-4 bg-red-50 py-4 px-4 rounded-full flex-row items-center justify-center gap-2 border border-[#E6E6E6]"
              activeOpacity={0.8}
            >
              <Text className="text-[#990000] font-medium text-base">
                Cancel Scan
              </Text>
            </TouchableOpacity>
          </View>
        );

      case "device-list":
        return (
          <View className="flex-1">
            {/* Header */}
            <View className="bg-white border-b border-gray-200 px-4 py-4">
              <Text
                className={`${isTablet ? "text-xl" : "text-lg"} font-bold text-gray-900 mb-1`}
              >
                Select a device
              </Text>
              <Text className="text-sm text-gray-600">
                {devices.length} device{devices.length !== 1 ? "s" : ""} found
              </Text>

              {__DEV__ && (
                <View className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <Text className="text-blue-800 text-xs">
                    💡 Demo: These are mock devices for testing
                  </Text>
                </View>
              )}
            </View>

            {/* Available Devices */}
            <View className="flex-1 mt-4">
              {devices.length > 0 && (
                <Text className="text-xs font-semibold text-gray-600 uppercase px-4 mb-2">
                  Available Devices
                </Text>
              )}
              <FlatList
                data={devices}
                renderItem={renderDeviceItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={renderEmpty}
              />
            </View>

            {/* Rescan Button */}
            <View className="bg-white border-t border-gray-200 px-4 py-4">
              <TouchableOpacity
                onPress={startScan}
                disabled={scanning}
                className="bg-blue-600 py-3.5 rounded-xl flex-row items-center justify-center"
                activeOpacity={0.8}
              >
                {scanning ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="refresh"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text className="text-white font-semibold text-base ml-2">
                      Scan Again
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Error Message */}
      {error && (
        <View className="bg-red-50 border-l-4 border-red-600 px-4 py-3 mx-4 mt-4 rounded">
          <Text className="text-red-800 text-sm">{error}</Text>
        </View>
      )}

      {renderContent()}
    </SafeAreaView>
  );
};

export default BluetoothScanner;
