// components/modules/Chats/VoiceMessageBubble.tsx
import Icon from "@/components/Icon";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

interface VoiceMessageBubbleProps {
  voiceUri: string;
  duration: number;
  isUser: boolean;
  time: string;
  onPlay: (uri: string) => void;
  onStop: () => void;
  isPlaying: boolean;
}

export const VoiceMessageBubble: React.FC<VoiceMessageBubbleProps> = ({
  voiceUri,
  duration,
  isUser,
  time,
  onPlay,
  onStop,
  isPlaying,
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePress = () => {
    if (isPlaying) {
      onStop();
    } else {
      onPlay(voiceUri);
    }
  };

  // ✅ Animated waveform bars
  const AnimatedWaveform = ({ color }: { color: string }) => {
    const barHeights = useRef(
      Array.from({ length: 25 }, () => new Animated.Value(Math.random()))
    ).current;

    useEffect(() => {
      if (isPlaying) {
        // Animate bars when playing
        const animations = barHeights.map((height, index) =>
          Animated.loop(
            Animated.sequence([
              Animated.timing(height, {
                toValue: Math.random() * 0.8 + 0.2,
                duration: 300 + Math.random() * 200,
                useNativeDriver: false,
              }),
              Animated.timing(height, {
                toValue: Math.random() * 0.8 + 0.2,
                duration: 300 + Math.random() * 200,
                useNativeDriver: false,
              }),
            ])
          )
        );

        Animated.parallel(animations).start();
      } else {
        // Reset to random static heights when stopped
        barHeights.forEach((height) => {
          height.setValue(Math.random() * 0.6 + 0.2);
        });
      }
    }, [isPlaying]);

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 32,
          flex: 1,
          gap: 2,
        }}
      >
        {barHeights.map((height, index) => (
          <Animated.View
            key={index}
            style={{
              width: 2.5,
              height: height.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 28],
              }),
              backgroundColor: isPlaying
                ? isUser
                  ? "#93C5FD"
                  : "#60A5FA" // Lighter blue when playing
                : color,
              borderRadius: 2,
              opacity: isPlaying ? 1 : 0.7,
            }}
          />
        ))}
      </View>
    );
  };

  if (isUser) {
    return (
      <View className="flex-row justify-end mb-3" style={{ width: "100%" }}>
        <View style={{ maxWidth: "80%", minWidth: 240 }}>
          <LinearGradient
            colors={["#2964C2", "#003466"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={handlePress}
              activeOpacity={0.7}
              style={{ marginRight: 12 }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  type="Ionicons"
                  name={isPlaying ? "pause" : "play"}
                  size={20}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>

            {/* Animated Waveform */}
            <AnimatedWaveform color="#fff" />

            <Text className="text-white text-xs font-medium ml-3">
              {formatDuration(duration)}
            </Text>
          </LinearGradient>
          <View className="flex-row items-center justify-end mt-1">
            <Text className="text-xs text-[#808080]">{time}</Text>
          </View>
        </View>
      </View>
    );
  }

  // AI voice message
  return (
    <View className="justify-start mb-3" style={{ width: "100%" }}>
      <View
        className="bg-[#EAF0FB] border border-gray-100"
        style={{
          maxWidth: "80%",
          minWidth: 240,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
          style={{ marginRight: 12 }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#2964C2",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              type="Ionicons"
              name={isPlaying ? "pause" : "play"}
              size={20}
              color="#fff"
            />
          </View>
        </TouchableOpacity>

        {/* Animated Waveform */}
        <AnimatedWaveform color="#2964C2" />

        <Text className="text-gray-800 text-xs font-medium ml-3">
          {formatDuration(duration)}
        </Text>
      </View>
      <Text className="text-[#808080] text-xs mt-1">{time}</Text>
    </View>
  );
};
