import {
  useGetChatMessagesQuery,
  useSendAiMessageMutation,
  useStartChatMutation,
} from "@/apis/aiChatQuery";
import BackBtn from "@/components/BackBtn";
import Icon, { SendMessageIcon, VoicerRecordingIcon } from "@/components/Icon";
import { ImagePreview } from "@/components/modules/Chats/AiCopilot";
import useAuthUser from "@/hooks/useAuthUser";
import { CopilotMessage, GetChatHistoryRequest } from "@/types/chats";
import {
  createAiCopilotSocket,
  generateClientMsgId,
} from "@/utils/aiCopilotSocket";
import { fileToImagePayload, formatDates, isTablet } from "@/utils/utils";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { Socket } from "socket.io-client";

const DateSeparator = ({ date }: { date: Date }) => (
  <View className="items-center my-4">
    <View className="bg-white px-4 border-gray-200">
      <Text className="text-xs text-[#808080]font-medium">
        {formatDates(date)}
      </Text>
    </View>
  </View>
);

const MessageBubble = ({
  message,
  onRetry,
}: {
  message: CopilotMessage;
  onRetry?: (msg: CopilotMessage) => void;
}) => {
  const isUser = message.type === "user";
  const isSystem = message.type === "system";
  const maxWidth = isTablet ? "65%" : "80%";

  if (isSystem) {
    return (
      <View className="items-center my-2">
        <Text className="text-xs text-gray-500 italic">{message.text}</Text>
      </View>
    );
  }

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
              borderRadius: 10,
              opacity: message.status === "failed" ? 0.7 : 1,
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
          </LinearGradient>
          <View className="flex-row items-center justify-end mt-1">
            <Text className="text-xs  text-[#808080]">{message.time}</Text>
          </View>
          {message.status === "failed" && onRetry && (
            <TouchableOpacity
              onPress={() => onRetry(message)}
              className="mt-2"
              activeOpacity={0.7}
            >
              <Text className="text-xs text-red-500 text-right">
                Tap to retry
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // AI message bubble
  return (
    <View className=" justify-start mb-3">
      <View
        className="bg-[#EAF0FB] border border-gray-100"
        style={{
          maxWidth,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 12,
        }}
      >
        {/* Show empty state only for truly empty messages */}
        {!message.text || message.text.trim() === "" ? (
          <Text className="text-gray-400 text-sm italic">
            Waiting for response...
          </Text>
        ) : (
          <Text className="text-gray-800 text-sm leading-6">
            {message.text}
          </Text>
        )}
      </View>
      {message.status === "sent" && (
        <Text className="text-[#808080] text-xs mt-1">{message.time}</Text>
      )}
    </View>
  );
};

const Copilot = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { authUser } = useAuthUser();
  const token = authUser?.accessToken;

  console.log("id", authUser?.data?.id);

  // Initial conversationId from URL params or null
  const initialConvId = params.conversationId as string | null;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [selectedImages, setSelectedImages] = useState<
    Array<{ uri: string; type: string }>
  >([]);

  // Use initialConvId for conversationId state
  const [conversationId, setConversationId] = useState<string | null>(
    initialConvId
  );

  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [tier] = useState<"premium" | "free">("premium");

  // State for pagination (cursors for fetching older messages)
  const [cursor, setCursor] = useState<{
    cursorCreatedAt?: string;
    cursorId?: string;
  }>({});

  const scrollViewRef = useRef<ScrollView>(null);
  const socketRef = useRef<Socket | null>(null);
  const currentStreamRef = useRef<string>("");
  const lastStreamUpdateRef = useRef<number>(0);

  const [startChat, { isLoading: isStartingChat }] = useStartChatMutation();
  const [sendAiMessageAPI] = useSendAiMessageMutation();

  // Create socket instance
  const socket = useMemo(() => {
    if (!token) return null;
    return createAiCopilotSocket(token);
  }, [token]);

  // ----------------------------------------------------
  // HISTORY FETCHING HOOK
  // ----------------------------------------------------
  const queryArgs: GetChatHistoryRequest = {
    conversationId: conversationId || "",
    limit: 20,
    ...cursor,
  };

  const {
    data: historyData,
    isLoading: isLoadingHistory,
    isFetching: isFetchingHistory,
    // Note: isError is not used directly in loading state, but can be for error display
  } = useGetChatMessagesQuery(queryArgs, {
    // Skip fetching if conversationId is not yet set (for new chats) or no token
    skip: !conversationId || !token,
  });

  // Access data correctly for pagination status
  const hasMoreHistory = historyData?.data?.hasMoreOlder || false;

  // ----------------------------------------------------
  // EFFECT TO HANDLE INCOMING HISTORY DATA
  // ----------------------------------------------------
  useEffect(() => {
    if (historyData) {
      const formattedMessages: CopilotMessage[] = historyData.data.items.map(
        (msg) => {
          // Determine if the message starts with the AI's signature
          const isAISignature = msg.text?.startsWith("Samuel here.");

          const messageType = isAISignature ? "ai" : "user";

          return {
            id: msg.id,
            conversationId: msg.conversationId,
            senderId: msg.senderId,
            text: msg.text,

            // ✅ CORRECTED TYPE LOGIC: Use content signature
            type: messageType as "user" | "ai" | "system",

            timestamp: new Date(msg.createdAt),
            time: new Date(msg.createdAt)
              .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              .toUpperCase(),
            status: "sent",

            clientMsgId: msg.clientMsgId || undefined,
            images: msg.mediaUrl ? [msg.mediaUrl] : undefined,
          };
        }
      );

      // When cursor is NOT set (initial load or refresh), replace all messages
      if (!cursor.cursorCreatedAt && !cursor.cursorId) {
        setMessages(formattedMessages.reverse());

        // Scroll to bottom on initial load
        setTimeout(
          () => scrollViewRef.current?.scrollToEnd({ animated: false }),
          200
        );
      } else {
        // When cursor IS set (loading older), prepend older messages
        setMessages((prev) => [...formattedMessages.reverse(), ...prev]);
      }
    }
  }, [historyData]);

  // ----------------------------------------------------
  // LAZY LOADING FUNCTION (Pulling up/Infinite Scroll)
  // ----------------------------------------------------
  const loadOlderMessages = useCallback(() => {
    if (
      !conversationId ||
      !hasMoreHistory ||
      isLoadingHistory ||
      isFetchingHistory
    ) {
      return;
    }

    if (historyData?.data?.nextOlderCursor) {
      const nextCursor = historyData.data.nextOlderCursor;
      setCursor({
        cursorCreatedAt: nextCursor.createdAt,
        cursorId: nextCursor.id,
      });
    }
  }, [
    conversationId,
    hasMoreHistory,
    isLoadingHistory,
    isFetchingHistory,
    historyData,
  ]);
  // ----------------------------------------------------
  // CHAT INITIALIZATION (New chat vs. History)
  // ----------------------------------------------------
  useEffect(() => {
    // If conversationId is already set (from params or previous run), skip starting a new chat
    if (!token || conversationId) return;

    const initChat = async () => {
      try {
        const result = await startChat({
          type: "FRONTEND_BACKEND_AI",
        }).unwrap();

        const convId = result?.data?.conversationId;
        if (convId) {
          setConversationId(convId);
          console.log("✅ Chat initialized with conversationId:", convId);
        }
      } catch (error) {
        console.error("❌ Failed to start chat:", error);
        Alert.alert("Error", "Failed to initialize chat. Please try again.");
      }
    };

    initChat();
  }, [token, conversationId, startChat]);

  // ----------------------------------------------------
  // Socket.IO setup (Existing Logic)
  // ----------------------------------------------------
  useEffect(() => {
    // ... (Socket connection logic remains unchanged) ...
    if (!socket || !token || !conversationId) {
      console.log("⏳ Waiting for socket setup");
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
          setJoined(true);
          console.log("✅ Joined chat room:", conversationId);
          // addSystemMessage("Connected to Nova");
        } else {
          console.warn("❌ Failed to join room");
          // addSystemMessage("Failed to join chat room");
        }
      });
    };

    const handleDisconnect = (reason: string) => {
      console.log("❌ Socket disconnected:", reason);
      setConnected(false);
      setJoined(false);
      addSystemMessage(`Disconnected: ${reason}`);
    };

    const handleConnectError = (error: any) => {
      console.error("❌ Socket connection error:", error);
      addSystemMessage("Connection error");
    };

    // Handler when AI starts processing
    const handleNovaStarted = ({ clientMsgId }: { clientMsgId?: string }) => {
      console.log("🤖 Nova started processing:", clientMsgId);
      setIsAiTyping(true);
      currentStreamRef.current = "";
      lastStreamUpdateRef.current = Date.now();

      // Update user message to "sent" status immediately when AI starts processing
      if (clientMsgId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.clientMsgId === clientMsgId
              ? { ...msg, status: "sent" as const }
              : msg
          )
        );
        console.log("✅ Marked user message as sent:", clientMsgId);
      }
    };

    // Handler for receiving message chunks
    const handleNovaMessage = ({ text }: { text: string }) => {
      console.log("📨 Nova message chunk received (length:", text.length, ")");

      // CRITICAL: Accumulate the streaming text FIRST
      currentStreamRef.current += text;

      const accumulatedText = currentStreamRef.current;
      const now = Date.now();

      // Throttle updates to every 50ms for smooth streaming
      if (now - lastStreamUpdateRef.current > 50) {
        lastStreamUpdateRef.current = now;

        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];

          const msgTime = new Date()
            .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            .toUpperCase();
          const msgTimestamp = new Date();

          // Case 1: Update existing AI message that's streaming
          if (lastMsg?.type === "ai" && lastMsg.status === "pending") {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMsg,
                text: accumulatedText,
              },
            ];
          }

          // Case 2: Create new AI message (first chunk)
          console.log("➕ Creating new AI message for streaming");
          return [
            ...prev,
            {
              id: generateClientMsgId(),
              type: "ai" as const,
              text: accumulatedText,
              time: msgTime,
              timestamp: msgTimestamp,
              status: "pending" as const,
            },
          ];
        });
      }
    };

    // Handler when AI finishes
    const handleNovaDone = ({ clientMsgId }: { clientMsgId?: string } = {}) => {
      console.log("✅ Nova done:", clientMsgId);
      setIsAiTyping(false);

      const finalText = currentStreamRef.current;

      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];

        if (lastMsg?.type === "ai" && lastMsg.status === "pending") {
          console.log(
            "✅ Finalizing AI message with text length:",
            finalText.length
          );

          return [
            ...prev.slice(0, -1),
            {
              ...lastMsg,
              text: finalText || lastMsg.text || "No response received",
              status: "sent" as const,
            },
          ];
        }

        if (finalText) {
          console.log("⚠️ Creating AI message in done handler (edge case)");
          return [
            ...prev,
            {
              id: generateClientMsgId(),
              type: "ai" as const,
              text: finalText,
              time: new Date()
                .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                .toUpperCase(),
              timestamp: new Date(),
              status: "sent" as const,
            },
          ];
        }

        console.warn("⚠️ No text to finalize");
        return prev;
      });

      currentStreamRef.current = "";
    };

    // Handler for errors
    const handleNovaError = ({
      error,
      clientMsgId,
    }: {
      error: string;
      clientMsgId?: string;
    }) => {
      console.error("❌ Nova error:", error, clientMsgId);
      setIsAiTyping(false);

      if (clientMsgId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.clientMsgId === clientMsgId
              ? { ...msg, status: "failed" as const }
              : msg
          )
        );
      }

      addSystemMessage(`Error: ${error}`);
      currentStreamRef.current = "";
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("copilot:started", handleNovaStarted);
    socket.on("copilot:message", handleNovaMessage);
    socket.on("copilot:done", handleNovaDone);
    socket.on("copilot:error", handleNovaError);

    console.log("🚀 Attempting to connect socket...");
    socket.connect();

    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("copilot:started", handleNovaStarted);
      socket.off("copilot:message", handleNovaMessage);
      socket.off("copilot:done", handleNovaDone);
      socket.off("copilot:error", handleNovaError);
      socket.disconnect();
    };
  }, [socket, token, conversationId]);

  // Request permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Camera roll permissions needed to select images."
          );
        }
      }
    })();
  }, []);

  // Auto scroll - scroll whenever messages change or AI is typing
  useEffect(() => {
    // Use a small delay to ensure the UI has rendered the new content
    const scrollTimer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [messages.length]); // Scroll only when a message is added

  const addSystemMessage = (text: string) => {
    const systemMsg: CopilotMessage = {
      id: generateClientMsgId(),
      type: "system",
      text,
      time: new Date()
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        .toUpperCase(),
      timestamp: new Date(),
      status: "sent",
    };
    setMessages((prev) => [...prev, systemMsg]);
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.type || "image/jpeg",
        }));
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

  const handleSend = async () => {
    if (!conversationId || !socket?.connected || !joined) {
      Alert.alert("Error", "Not connected to chat. Please try again.");
      return;
    }

    const hasText = message.trim().length > 0;
    const hasImages = selectedImages.length > 0;

    if (!hasText && !hasImages) return;

    const clientMsgId = generateClientMsgId();
    const now = new Date();

    const optimisticMessage: CopilotMessage = {
      id: clientMsgId,
      clientMsgId,
      type: "user",
      text: message.trim(),
      images: hasImages ? selectedImages.map((img) => img.uri) : undefined,
      time: now
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        .toUpperCase(),
      timestamp: now,
      status: "pending",
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setMessage("");
    const imagesToSend = [...selectedImages];
    setSelectedImages([]);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);

    try {
      if (hasImages) {
        const imagePayload = await Promise.all(
          imagesToSend.map((img) => fileToImagePayload(img.uri, img.type))
        );

        socket.emit(
          "copilot:ask",
          {
            conversationId,
            inputType: "image",
            image: imagePayload.length === 1 ? imagePayload[0] : imagePayload,
            userText: hasText ? message.trim() : undefined,
            clientMsgId,
            tier,
            metadata: { source: "mobile" },
          },
          (ack?: { ok: boolean; error?: string }) => {
            if (!ack?.ok) {
              console.warn("⚠️ Socket send failed, trying API fallback");
              sendViaAPI(
                conversationId,
                clientMsgId,
                message.trim(),
                imagePayload.length === 1 ? imagePayload[0] : imagePayload
              );
            }
          }
        );
      } else {
        socket.emit(
          "copilot:ask",
          {
            conversationId,
            userText: message.trim(),
            clientMsgId,
            tier,
            metadata: { source: "mobile" },
          },
          (ack?: { ok: boolean; error?: string }) => {
            if (!ack?.ok) {
              console.warn("⚠️ Socket send failed, trying API fallback");
              sendViaAPI(conversationId, clientMsgId, message.trim());
            }
          }
        );
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      sendViaAPI(conversationId, clientMsgId, message.trim());
    }
  };

  const sendViaAPI = async (
    convId: string,
    clientMsgId: string,
    text: string,
    image?: any
  ) => {
    try {
      console.log("📡 Sending via REST API fallback");
      await sendAiMessageAPI({
        conversationId: convId,
        userText: text,
        ...(image && { inputType: "image", image }),
        clientMsgId,
        tier,
        metadata: { source: "mobile", fallback: true },
      }).unwrap();

      console.log("✅ Message sent successfully via API");
      setMessages((prev) =>
        prev.map((msg) =>
          msg.clientMsgId === clientMsgId ? { ...msg, status: "sent" } : msg
        )
      );
    } catch (error) {
      console.error("❌ API send failed:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.clientMsgId === clientMsgId ? { ...msg, status: "failed" } : msg
        )
      );
      Alert.alert("Error", "Failed to send message. Tap to retry.");
    }
  };

  const handleRetry = (msg: CopilotMessage) => {
    if (!msg.clientMsgId) return;

    setMessages((prev) => prev.filter((m) => m.id !== msg.id));

    const newClientMsgId = generateClientMsgId();
    const retryMessage: CopilotMessage = {
      ...msg,
      id: newClientMsgId,
      clientMsgId: newClientMsgId,
      status: "pending",
    };

    setMessages((prev) => [...prev, retryMessage]);

    if (conversationId) {
      sendViaAPI(conversationId, newClientMsgId, msg.text);
    }
  };

  const handleViewHistory = () => {
    router.push("/(tabs)/ai-copilot/chat-history");
  };

  const keyboardOffset = Platform.select({ ios: 0, android: 0 });
  const canSend =
    (message.trim() || selectedImages.length > 0) && connected && joined;

  // ----------------------------------------------------
  // UPDATE LOADING STATE
  // ----------------------------------------------------
  const isLoadingData =
    isStartingChat || (conversationId && isLoadingHistory && !historyData);

  if (isLoadingData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2964C2" />
        <Text className="mt-4 text-gray-600">
          {isStartingChat ? "Initializing Nova..." : "Loading chat history..."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        keyboardVerticalOffset={keyboardOffset}
      >
        {/* Header */}
        <View className=" bg-white">
          <View className={` ${isTablet ? "px-8" : "px-4"} py-4`}>
            <BackBtn />
            <View className="flex-row pt-6 items-center justify-between">
              <View className="flex-1 ">
                <Text
                  className={`${isTablet ? "text-2xl" : "text-xl"} font-semibold text-gray-900`}
                >
                  Chat with Fixit Nova
                </Text>
                {/* <Text className="text-xs text-gray-500 mt-0.5">
                  {connected && joined ? "Online" : "Connecting..."}
                </Text> */}
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
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 "
          contentContainerStyle={{
            paddingHorizontal: isTablet ? 32 : 16,
            paddingTop: 20,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          // Load older messages when scrolling to top (y === 0)
          onScroll={({ nativeEvent }) => {
            if (nativeEvent.contentOffset.y === 0 && !isFetchingHistory) {
              loadOlderMessages();
            }
          }}
          scrollEventThrottle={400}
        >
          {/* Indicator for loading older messages */}
          {isFetchingHistory && hasMoreHistory && (
            <View className="items-center py-2">
              <ActivityIndicator size="small" color="#2964C2" />
              <Text className="text-gray-500 mt-1 text-xs">
                Loading older messages...
              </Text>
            </View>
          )}

          {messages.length === 0 ? (
            <View className="flex-1 items-center justify-center px-6">
              <Icon
                type="MaterialCommunityIcons"
                name="robot-excited-outline"
                size={80}
                color="#2964C2"
              />
              <Text className="text-xl font-semibold text-gray-900 mt-6 text-center">
                Welcome to Nova
              </Text>
              <Text className="text-sm text-gray-600 mt-2 text-center">
                Ask me anything about vehicle diagnostics, repairs, or
                maintenance
              </Text>
            </View>
          ) : (
            <>
              {messages.map((msg, index) => {
                const shouldShowDate =
                  index === 0 ||
                  new Date(messages[index - 1].timestamp).toDateString() !==
                    new Date(msg.timestamp).toDateString();

                return (
                  <View key={msg.id}>
                    {shouldShowDate && <DateSeparator date={msg.timestamp} />}
                    <MessageBubble message={msg} onRetry={handleRetry} />
                  </View>
                );
              })}
              {isAiTyping && (
                <View className="flex-row items-center mb-3">
                  <View className="bg-[#EAF0FB] border border-gray-100 px-4 py-3 rounded-2xl">
                    <View className="flex-row items-center space-x-1">
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
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Image Preview */}
        <ImagePreview images={selectedImages} onRemove={handleRemoveImage} />

        {/* Input Area */}
        <View
          className="bg-gray-10 border-t border-gray-200"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          <View
            className={`flex-row items-center ${isTablet ? "px-10 py-6" : "px-5 pt-4 pb-8"}`}
          >
            {/* Image Upload Button */}
            <TouchableOpacity
              onPress={handleImagePick}
              className="mr-3"
              activeOpacity={0.7}
              disabled={!connected || !joined}
            >
              <View className="w-11 h-11 bg-primary rounded-lg items-center justify-center">
                <Icon
                  type="Ionicons"
                  name="camera-outline"
                  size={22}
                  color={connected && joined ? "#fff" : "#9CA3AF"}
                />
              </View>
            </TouchableOpacity>

            {/* Text Input Container */}
            <View className="bg-white border border-[#E6E6E6] rounded-2xl flex-1 items-center flex-row min-h-[44px] pr-3">
              <View
                className="flex-[2] rounded-3xl px-5 mr-3 justify-center"
                style={{ minHeight: 44 }}
              >
                <TextInput
                  className={`${isTablet ? "text-base" : "text-sm"} text-gray-900`}
                  placeholder="Ask about a vehicle or repairs..."
                  placeholderTextColor="#808080"
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
                  editable={connected && joined}
                />
              </View>
              <TouchableOpacity
                onPress={handleSend}
                activeOpacity={0.7}
                disabled={!canSend}
              >
                <VoicerRecordingIcon />
              </TouchableOpacity>
              {/* Send Button */}
              <TouchableOpacity
                onPress={handleSend}
                activeOpacity={0.7}
                disabled={!canSend}
                className="ml-3"
              >
                <SendMessageIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Copilot;
