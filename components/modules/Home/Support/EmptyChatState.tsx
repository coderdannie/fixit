import { supportAvatars } from "@/components/common/constant";
import Icon from "@/components/Icon";
import React from "react";
import { Text, View } from "react-native";

const EmptyChatState = ({ chatName }: { chatName: string }) => (
  <View className="flex-1 justify-start items-center pt-20">
    {/* Support Avatars Row */}
    <View className="flex-row justify-center mb-6">
      {supportAvatars.map((support, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "#003466",
            marginLeft: index > 0 ? -12 : 0,
            borderColor: "#E6E6E6",
            borderWidth: 2,
          }}
          className="w-11 h-11 flex items-center justify-center rounded-full overflow-hidden shadow-md"
        >
          <Text className="text-white font-semibold text-lg">
            {support.initial}
          </Text>
        </View>
      ))}
    </View>

    {/* Welcome Message */}
    <Text className="text-center text-[#666666] text-base font-semibold mb-2">
      Hi there! 👋 Welcome to FIXIT Support.
    </Text>
    <Text className="text-center text-[#666666]  mb-12">
      How can we assist you today?
    </Text>

    {/* Privacy Note */}
    <View className="flex-row items-center justify-center opacity-70">
      <Icon
        type="Ionicons"
        name="lock-closed-outline"
        size={16}
        color="#4B5563"
      />
      <Text className="text-sm text-[#666666] ml-2">
        All conversations are safe and private.
      </Text>
    </View>
  </View>
);

export default EmptyChatState;
