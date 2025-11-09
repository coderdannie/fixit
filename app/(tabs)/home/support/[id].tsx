import {
  useSendMessageMutation,
  useStartChatMutation,
} from "@/apis/supportChatQuery";
import BackBtn from "@/components/BackBtn";
import Icon from "@/components/Icon";
import EmptyChatState from "@/components/modules/Home/Support/EmptyChatState";
import useAuthUser from "@/hooks/useAuthUser";
import { useGetUserProfile } from "@/hooks/userGetUserProfile";
import { Message } from "@/types/chats";
import { formatDates, isTablet, shouldShowDateSeparator } from "@/utils/utils";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";

const AGENT_ID = "f451a1ac-4cea-43bd-b46b-35fc15d3085d";
const BASE_URL = "https://fixit-backend-server.onrender.com";

// --- START: MODIFIED TYPES ---
interface MessageWithImages extends Message {
  images?: string[];
  senderId?: string;
  status: "pending" | "sent" | "failed";
}

// --- END: MODIFIED TYPES ---

// Socket creation function (Unchanged)
const createChatSocket = (baseUrl: string, token: string): Socket => {
  return io(`${baseUrl}/chat`, {
    path: "/realtime",
    transports: ["websocket"],
    withCredentials: false,
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
    auth: { token },
    autoConnect: false,
    reconnectionAttempts: 8,
    reconnectionDelay: 800,
  });
};

// Generate a random UUID for clientMsgId (Unchanged)
const generateClientMsgId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const MessageStatusIcon = ({
  status,
}: {
  status: MessageWithImages["status"];
}) => {
  const iconColor = status === "failed" ? "#FF5555" : "#fff";

  switch (status) {
    case "pending":
      // Subtler cue: Small, translucent clock icon
      return (
        <Icon
          type="Ionicons"
          name="time-outline"
          size={12}
          color="#fff"
          style={{ marginLeft: 4, opacity: 0.8 }}
        />
      );
    case "sent":
      // WhatsApp-like: Double checkmark for successful server acknowledgment
      return (
        <Icon
          type="Ionicons"
          name="checkmark-done"
          size={14}
          color="#fff"
          style={{ marginLeft: 4, opacity: 0.9 }}
        />
      );
    case "failed":
      // Error cue
      return (
        <Icon
          type="MaterialIcons"
          name="error-outline"
          size={14}
          color={iconColor}
          style={{ marginLeft: 4 }}
        />
      );
    default:
      return null;
  }
};

const MessageBubble = ({ message }: { message: MessageWithImages }) => {
  const isUser = message.type === "user";
  const maxWidth = isTablet ? "65%" : "80%";

  if (isUser) {
    return (
      <View className="flex-row justify-end mb-3" style={{ maxWidth: "100%" }}>
        <View style={{ maxWidth }}>
          <LinearGradient
            colors={["#2964C2", "#003466"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              // Only slightly reduce opacity for pending/failed states
              opacity: message.status !== "sent" ? 0.85 : 1,
            }}
          >
            {message.images && message.images.length > 0 && (
              <View className="mb-2">
                {message.images.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    style={{
                      width: "100%",
                      aspectRatio: 3 / 4,
                      borderRadius: 8,
                      marginBottom: index < message.images!.length - 1 ? 8 : 0,
                    }}
                    resizeMode="cover"
                  />
                ))}
              </View>
            )}
            {message.text && (
              <Text className="text-white text-sm leading-5">
                {message.text}
              </Text>
            )}
            <View className="flex-row items-center justify-end mt-1.5">
              <Text className="text-blue-100 text-xs opacity-70">
                {message.time}
              </Text>
              {/* RENDER THE SUBTLE STATUS ICON */}
              <MessageStatusIcon status={message.status} />
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row justify-start mb-3">
      <View
        className="bg-[#EAF0FB] border border-gray-100"
        style={{
          maxWidth,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 16,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <Text className="text-gray-800 text-sm leading-6">{message.text}</Text>
        <Text className="text-gray-500 text-xs mt-1.5 text-right opacity-70">
          {message.time}
        </Text>
      </View>
    </View>
  );
};

const DateSeparator = ({ date }: { date: Date }) => (
  <View className="items-center my-4">
    <View className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
      <Text className="text-xs text-gray-600 font-medium">
        {formatDates(date)}
      </Text>
    </View>
  </View>
);

const ImagePreview = ({
  images,
  onRemove,
}: {
  images: string[];
  onRemove: (index: number) => void;
}) => {
  if (images.length === 0) return null;

  return (
    <View className="px-5 py-3 bg-white border-t border-gray-200">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {images.map((uri, index) => (
          <View key={index} className="mr-2 relative">
            <Image
              source={{ uri }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
              }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => onRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
              activeOpacity={0.7}
            >
              <Icon type="Ionicons" name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const ChatDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { userProfile } = useGetUserProfile() as any;

  const { authUser } = useAuthUser();

  const token = authUser?.accessToken;

  const userId = userProfile?.id;

  const chatName = "Customer Support";

  const [messages, setMessages] = useState<MessageWithImages[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);
  const socketRef = useRef<Socket | null>(null);

  // RTK Query hooks
  const [startChat, { isLoading: isStartingChat }] = useStartChatMutation();
  const [sendMessageAPI] = useSendMessageMutation();

  // Create socket instance (Unchanged)
  const socket = useMemo(() => {
    if (!token) return null;
    return createChatSocket(BASE_URL, token);
  }, [token]);

  // Initialize chat session (Unchanged)
  useEffect(() => {
    if (!userId || conversationId) return;

    const initChat = async () => {
      try {
        const result = await startChat({
          userId,
          agentId: AGENT_ID,
        }).unwrap();

        console.log("resutl", result);
        // FIX: Extract conversationId from nested response structure
        const convId = result.data.conversation.id;
        setConversationId(convId);

        console.log("✅ Chat initialized with conversationId:", convId);
      } catch (error) {
        console.error("❌ Failed to start chat:", error);
        Alert.alert("Error", "Failed to initialize chat. Please try again.");
      }
    };

    initChat();
  }, [userId, conversationId, startChat]);

  // Socket.IO setup (Unchanged logic, updated Message type usage)
  useEffect(() => {
    if (!socket || !token || !conversationId) {
      console.log("⏳ Waiting for socket setup:", {
        hasSocket: !!socket,
        hasToken: !!token,
        hasConvId: !!conversationId,
      });
      return;
    }

    console.log("🔌 Setting up socket connection...");
    socketRef.current = socket;

    const handleConnect = () => {
      console.log("✅ Socket connected!");
      setConnected(true);
      // Join the conversation room
      socket.emit("chat:join", { conversationId }, (ok: boolean) => {
        if (ok) {
          console.log("✅ Joined chat room:", conversationId);
        } else {
          console.warn("❌ Failed to join room");
        }
      });
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      setConnected(false);
    };

    const handleConnectError = (error: any) => {
      console.error("❌ Socket connection error:", error);
    };

    const handleNewMessage = ({ message }: { message: any }) => {
      console.log("📨 New message received:", message);
      // Only add messages from others (not our own optimistic updates)
      if (message.senderId !== userId) {
        const newMessage: MessageWithImages = {
          id: message.id,
          type: message.senderId === userId ? "user" : "support",
          text: message.text,
          time: new Date(message.createdAt)
            .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            .toUpperCase(),
          timestamp: new Date(message.createdAt),
          senderId: message.senderId,
          // New message from server is always 'sent'
          status: "sent",
        };
        setMessages((prev) => [...prev, newMessage]);
      } else {
        // If it's *our* message coming back from the server broadcast,
        // we can update the status of the existing optimistic message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.clientMsgId || msg.id === message.id
              ? { ...msg, id: message.id, status: "sent" }
              : msg
          )
        );
      }
    };

    const handleTyping = ({
      userId: typingUserId,
      isTyping,
    }: {
      userId: string;
      isTyping: boolean;
    }) => {
      if (typingUserId !== userId) {
        setTypingUsers((prev) => {
          const set = new Set(prev);
          if (isTyping) set.add(typingUserId);
          else set.delete(typingUserId);
          return Array.from(set);
        });
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("chat:new", handleNewMessage);
    socket.on("chat:typing", handleTyping);

    console.log("🚀 Attempting to connect socket...");
    socket.connect();

    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("chat:new", handleNewMessage);
      socket.off("chat:typing", handleTyping);
      socket.disconnect();
    };
  }, [socket, token, conversationId, userId]);

  // Request permissions on mount (Unchanged)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Sorry, we need camera roll permissions to select images."
          );
        }
      }
    })();
  }, []);

  // Auto scroll to bottom when new messages arrive (Unchanged)
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Typing indicator (Unchanged)
  useEffect(() => {
    const s = socketRef.current;
    if (!s || !token || !conversationId || !inputText) return;

    s.emit("chat:typing", { conversationId, isTyping: true });

    const handle = setTimeout(() => {
      s.emit("chat:typing", { conversationId, isTyping: false });
    }, 1200);

    return () => clearTimeout(handle);
  }, [inputText, token, conversationId]);

  const handleImagePick = async () => {
    try {
      // NOTE: Images are currently NOT uploaded or sent via API/Socket for this task.
      // They are only stored locally.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to pick images. Please try again.");
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // --- START: MODIFIED handleSend and sendViaAPI ---

  const handleSend = async () => {
    if (
      !conversationId ||
      !socket?.connected ||
      (!inputText.trim() && selectedImages.length === 0)
    ) {
      console.warn("⚠️ Cannot send:", {
        hasConvId: !!conversationId,
        socketConnected: socket?.connected,
        hasContent: !!(inputText.trim() || selectedImages.length),
      });
      return;
    }

    const clientMsgId = generateClientMsgId();
    const messageText = inputText.trim();
    const now = new Date();

    console.log("📤 Sending message:", {
      conversationId,
      clientMsgId,
      text: messageText,
    });

    const optimisticMessage: MessageWithImages = {
      id: clientMsgId,
      type: "user",
      text: messageText,
      images: selectedImages.length > 0 ? [...selectedImages] : undefined,
      time: now
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        .toUpperCase(),
      timestamp: now,
      senderId: userId,
      status: "pending",
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText("");
    setSelectedImages([]);

    try {
      socket.emit(
        "chat:send",
        {
          conversationId,
          text: messageText,
          clientMsgId,
          // Images data is ignored for this specific task
        },
        (resp: { ok: boolean }) => {
          if (resp.ok) {
            console.log(
              "✅ Message sent successfully via socket, waiting for broadcast or just marking as sent."
            );

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === clientMsgId ? { ...msg, status: "sent" } : msg
              )
            );
          } else {
            console.warn("⚠️ Socket send failed, trying API fallback");
            // 3. Failover: Fallback to REST API if socket acknowledgment is NOT OK
            sendViaAPI(conversationId, clientMsgId, messageText);
          }
        }
      );
    } catch (error) {
      console.error(
        "❌ Error sending message, attempting API fallback:",
        error
      );
      // 3. Failover: Fallback to REST API if socket emission fails (e.g., disconnection)
      sendViaAPI(conversationId, clientMsgId, messageText);
    }
  };

  const sendViaAPI = async (
    convId: string,
    clientMsgId: string,
    text: string
  ) => {
    try {
      console.log("📡 Sending via REST API fallback");
      await sendMessageAPI({
        conversationId: convId,
        clientMsgId,
        text,
      }).unwrap();

      console.log("✅ Message sent successfully via API");
      // Mark as 'sent' after API confirms success
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === clientMsgId ? { ...msg, status: "sent" } : msg
        )
      );
    } catch (error) {
      console.error("❌ API send failed:", error);
      // Mark as 'failed' if API also fails
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === clientMsgId ? { ...msg, status: "failed" } : msg
        )
      );
      Alert.alert(
        "Error",
        "Failed to send message. Tap on the red exclamation mark to retry."
      );
    }
  };

  // --- END: MODIFIED handleSend and sendViaAPI ---
  const keyboardOffset = Platform.select({
    ios: 0,
    android: 0,
  });

  const isChatEmpty = messages.length === 0;
  // A message with status 'pending' or 'sent' should not block new sends.
  const isSending = messages.some((msg) => msg.status === "pending");
  const canSend = (inputText.trim() || selectedImages.length > 0) && connected;

  if (isStartingChat) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2964C2" />
        <Text className="mt-4 text-gray-600">Connecting to support...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        keyboardVerticalOffset={keyboardOffset}
      >
        {/* Header (Unchanged) */}
        <View className="border-b border-gray-200 bg-white">
          <View
            className={`flex-row items-center justify-between ${isTablet ? "px-8" : "px-4"} py-4`}
          >
            <View className="flex-row items-center">
              <BackBtn />
              <View className="ml-4">
                <Text
                  className={`${isTablet ? "text-xl" : "text-lg"} font-semibold text-gray-900`}
                >
                  {chatName}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {connected ? "Online" : "Connecting..."}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Messages / Empty State (Unchanged) */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: isTablet ? 32 : 16,
            paddingTop: 20,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isChatEmpty ? (
            <EmptyChatState chatName={chatName} />
          ) : (
            <>
              {messages.map((msg, index) => (
                <View key={msg.id}>
                  {shouldShowDateSeparator(messages, index) && (
                    <DateSeparator date={msg.timestamp} />
                  )}
                  <MessageBubble message={msg} />
                </View>
              ))}
              {typingUsers.length > 0 && (
                <View className="mb-3">
                  <Text className="text-xs text-gray-500 italic">
                    Support is typing...
                  </Text>
                </View>
              )}
            </>
          )}
          {!isChatEmpty && <View style={{ height: 10 }} />}
        </ScrollView>

        {/* Image Preview (Unchanged) */}
        <ImagePreview images={selectedImages} onRemove={handleRemoveImage} />

        {/* Input Area (Unchanged) */}
        <View className="bg-white border-t border-gray-200">
          <View
            className={`flex-row items-center ${isTablet ? "px-10 py-6" : "px-5 pt-4 pb-8"}`}
          >
            {/* Text Input Container */}
            <View
              className="flex-1 bg-gray-100 rounded-3xl px-5 mr-3 justify-center"
              style={{ minHeight: 48 }}
            >
              <TextInput
                className={`${isTablet ? "text-base" : "text-sm"} text-gray-900`}
                placeholder="Type message..."
                placeholderTextColor="#9CA3AF"
                value={inputText}
                onChangeText={setInputText}
                multiline={true}
                textAlignVertical="center"
                style={{
                  maxHeight: 100,
                  paddingVertical: 12,
                  includeFontPadding: false,
                }}
                blurOnSubmit={false}
                returnKeyType="default"
                editable={connected}
              />
            </View>

            {/* Camera/Image Picker Button */}
            <TouchableOpacity
              onPress={handleImagePick}
              className="mr-3"
              activeOpacity={0.7}
              disabled={!connected}
            >
              <Icon
                type="Ionicons"
                name="camera-outline"
                size={isTablet ? 30 : 26}
                color={connected ? "#2964C2" : "#D1D5DB"}
              />
            </TouchableOpacity>

            {/* Send Button */}
            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={0.7}
              disabled={!canSend}
            >
              <Icon
                type="Ionicons"
                name="send"
                size={isTablet ? 28 : 24}
                color={canSend ? "#2964C2" : "#D1D5DB"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailsScreen;
