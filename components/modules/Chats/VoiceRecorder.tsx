import Icon from "@/components/Icon";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface VoiceRecorderProps {
  isRecording: boolean;
  duration: number;
  onStop: () => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  duration,
  onStop,
  onCancel,
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isRecording) return null;

  return (
    <View className="absolute inset-0 bg-white flex-row items-center px-4 z-50">
      {/* Cancel Button */}
      <TouchableOpacity onPress={onCancel} activeOpacity={0.7} className="mr-4">
        <Icon
          type="MaterialCommunityIcons"
          name="close"
          size={28}
          color="#DC2626"
        />
      </TouchableOpacity>

      {/* Recording Indicator */}
      <View className="flex-1 flex-row items-center">
        <View className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse" />
        <Text className="text-base font-medium text-gray-900">
          {formatDuration(duration)}
        </Text>
        <Text className="text-sm text-gray-500 ml-2">Recording...</Text>
      </View>

      {/* Send Button */}
      <TouchableOpacity
        onPress={onStop}
        activeOpacity={0.7}
        className="w-12 h-12 bg-primary rounded-full items-center justify-center"
      >
        <Icon type="Ionicons" name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
