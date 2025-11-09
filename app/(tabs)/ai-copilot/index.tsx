import BackBtn from "@/components/BackBtn";
import Icon from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Copilot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "user",
      text: "What could the issue be, if a toyota corolla 2015 model's Ac suddenly stops working?",
      time: "1:10pm",
      timestamp: new Date("2025-05-01T13:10:00"),
    },
    {
      id: 2,
      type: "ai",
      text: 'There are several potential reasons why your 2015 Toyota Corolla\'s AC might suddenly stop working. Here are some common causes and potential fixes:\n\n1. "Low Refrigerant Levels": The most common cause of AC issues is low refrigerant levels, often due to leaks in the system. Signs include warm air blowing from vents, inconsistent cooling, or the AC working intermittently.\n\n2. "Faulty Compressor": The compressor is the heart of the AC system and can fail, causing the AC to stop working. Signs include loud grinding or squealing noises, no cold air, or the compressor not engaging.\n\n3. "Clogged Cabin Air Filter": A dirty or clogged cabin air filter can reduce airflow and cooling efficiency. Replacing the filter can improve air circulation and cooling.',
      time: null,
      timestamp: new Date("2025-05-01T13:10:30"),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const router = useRouter();

  // Offset calculation for KeyboardAvoidingView:
  // Since you are using SafeAreaView(edges={["top"]}), the top safe area is handled.
  // The offset should generally be 0 or a small positive number on iOS,
  // and 'padding' usually works on Android without an offset.
  const keyboardOffset = Platform.select({
    ios: 0,
    android: 0, // Keep this at 0 for 'padding' behavior as a starting point
  });

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Helper function to format date like WhatsApp
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDate = new Date(date);

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    messageDate.setHours(0, 0, 0, 0);

    if (messageDate.getTime() === today.getTime()) {
      return "Today";
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      // Format as "May 1, 2025"
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Helper function to check if we need to show date separator
  const shouldShowDateSeparator = (currentIndex: number) => {
    if (currentIndex === 0) return true;

    const currentMsg = messages[currentIndex];
    const previousMsg = messages[currentIndex - 1];

    const currentDate = new Date(currentMsg.timestamp);
    const previousDate = new Date(previousMsg.timestamp);

    currentDate.setHours(0, 0, 0, 0);
    previousDate.setHours(0, 0, 0, 0);

    return currentDate.getTime() !== previousDate.getTime();
  };

  const handleSend = () => {
    if (message.trim()) {
      const now = new Date();
      const newMessage = {
        id: messages.length + 1,
        type: "user",
        text: message.trim(),
        time: now
          .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
          .toLowerCase(),
        timestamp: now,
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");

      // Simulate AI typing
      setIsTyping(true);

      // Simulate AI response (you'll replace this with actual API call)
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: "ai",
          text: "I'm here to help! This is a simulated response. Once you integrate the API, I'll provide real vehicle diagnostic assistance.",
          time: null,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleImagePick = () => {
    // TODO: Implement image picker functionality
    console.log("Image picker pressed");
  };

  const handleVoiceInput = () => {
    // TODO: Implement voice input functionality
    console.log("Voice input pressed");
  };

  const handleViewHistory = () => {
    router.push("/(tabs)/ai-copilot/chat-history");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior="padding" // 💡 FIX: Use 'padding' for both platforms
        className="flex-1"
        keyboardVerticalOffset={keyboardOffset} // Using calculated offset (0 or adjusted)
      >
        {/* Header */}
        <View className="border-b border-gray-200 bg-white">
          <View
            className={`flex-row items-center justify-between ${isTablet ? "px-8" : "px-4"} py-4`}
          >
            <BackBtn />

            <View className="flex-1 items-center">
              <Text
                className={`${isTablet ? "text-lg" : "text-base"} font-semibold text-gray-900`}
              >
                Chat with Fixit AI Copilot
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleViewHistory}
              activeOpacity={0.7}
              className="ml-3"
              style={{
                width: isTablet ? 42 : 32,
                height: isTablet ? 42 : 32,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                backgroundColor: "#F2F2F2",
              }}
            >
              <Icon
                type="MaterialCommunityIcons"
                name="history"
                color="#000000"
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-gray-50"
          contentContainerStyle={{
            paddingHorizontal: isTablet ? 32 : 16,
            paddingTop: 20,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, index) => (
            <View key={msg.id}>
              {/* Date Separator */}
              {shouldShowDateSeparator(index) && (
                <View className="items-center mb-4 ">
                  <View className="bg-white px-4 py-2 rounded-full shadow-sm">
                    <Text className="text-xs text-gray-600 font-medium">
                      {formatDate(msg.timestamp)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Message */}
              <View className="mb-4">
                {msg.type === "user" ? (
                  <View className="flex-row justify-end">
                    <LinearGradient
                      colors={["#2964C2", "#003466"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        maxWidth: isTablet ? "60%" : "80%",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 4,
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                      }}
                    >
                      <Text className="text-white text-sm leading-5">
                        {msg.text}
                      </Text>
                      {msg.time && (
                        <Text className="text-blue-100 text-xs mt-1.5 text-right">
                          {msg.time}
                        </Text>
                      )}
                    </LinearGradient>
                  </View>
                ) : (
                  <View
                    className="bg-[#EAF0FB] border border-gray-100"
                    style={{
                      maxWidth: isTablet ? "70%" : "85%",
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 16,
                      borderBottomLeftRadius: 16,
                      borderBottomRightRadius: 16,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Text className="text-gray-800 text-sm leading-6">
                      {msg.text}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View
              className="bg-[#EAF0FB] border border-gray-100"
              style={{
                maxWidth: isTablet ? "70%" : "85%",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 16,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <View className="flex-row items-center space-x-1">
                {/* Note: Tailwind 'animate-pulse' might not work without specific setup. 
                   If the dots don't animate, you may need a custom animation or library. */}
                <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                <View
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ marginLeft: 4 }}
                />
                <View
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ marginLeft: 4 }}
                />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area - Fixed at bottom */}
        <View
          className="bg-white border-t border-gray-200"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          {/* Note: The 'pb-8' (padding-bottom: 32) is likely what pushes the content
             up to cover the bottom safe area/notch on iOS, which is good. */}
          <View
            className={`flex-row items-center ${isTablet ? "px-10 py-6" : "px-5 pt-4 pb-8"}`}
          >
            {/* Image Upload Button */}
            <TouchableOpacity
              onPress={handleImagePick}
              className="mr-3"
              activeOpacity={0.7}
            >
              <View className="w-11 h-11 bg-primary rounded-lg items-center justify-center">
                <Icon
                  type="Ionicons"
                  name="camera-outline"
                  size={22}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>

            {/* Text Input Container */}
            <View
              className="flex-1 bg-gray-100 rounded-3xl px-5 mr-3 justify-center"
              style={{ minHeight: 48 }}
            >
              <TextInput
                className={`${isTablet ? "text-base" : "text-sm"} text-gray-900`}
                placeholder="Ask about a vehicle or repairs..."
                placeholderTextColor="#9CA3AF"
                value={message}
                onChangeText={setMessage}
                multiline={true}
                textAlignVertical="center"
                style={{
                  maxHeight: 150,
                  paddingVertical: 12,
                  includeFontPadding: false,
                }}
                blurOnSubmit={false}
                returnKeyType="default"
              />
            </View>
            {/* Mic Button */}
            <TouchableOpacity
              onPress={handleVoiceInput}
              className="mr-3"
              activeOpacity={0.7}
            >
              <Icon
                type="Ionicons"
                name="mic-outline"
                size={26}
                color="#6B7280"
              />
            </TouchableOpacity>

            {/* Send Button */}
            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={0.7}
              disabled={!message.trim()}
            >
              <Icon
                type="Ionicons"
                name="send"
                size={24}
                color={message.trim() ? "#2964C2" : "#D1D5DB"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Copilot;
