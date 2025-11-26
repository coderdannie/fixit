export type Message = {
  id: string;
  type: "user" | "support";
  text: string;
  time: string;
  timestamp: Date;
};

export interface StartChatRequest {
  userId: string;
  agentId: string;
}

export interface StartChatResponse {
  data: {
    conversation: {
      id: string;
    };
  };
}

export interface AiStartChatResponse {
  data: {
    conversationId: string;
  };
}

export interface SendMessageRequest {
  conversationId: string;
  clientMsgId: string;
  text?: string;
  media?: {
    url: string;
    type: string;
    width?: number;
    height?: number;
    size?: number;
  };
}

export interface AiSendMesdsageRequest {}

export interface SendMessageResponse {
  messageId: string;
  conversationId: string;
  clientMsgId: string;
  text?: string;
  media?: {
    url: string;
    type: string;
    width?: number;
    height?: number;
    size?: number;
  };
  sentAt: string;
  status: string;
}

export interface GetChatHistoryRequest {
  conversationId?: string;
  limit?: number;
  cursorCreatedAt?: string;
  cursorId?: string;
  type?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  text?: string;
  media?: {
    url: string;
    type: string;
    width?: number;
    height?: number;
    size?: number;
  };
  senderId: string;
  senderType: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetChatHistoryResponse {
  messages: ChatMessage[];
  hasMore: boolean;
  nextCursor?: {
    createdAt: string;
    id: string;
  };
}

export interface AiCopilotSendRequest {
  conversationId: string;
  userText?: string;
  inputType?: "text" | "image";
  image?:
    | { url: string }
    | { base64: string; mime_type: string }
    | Array<{ base64: string; mime_type: string }>;
  clientMsgId: string;
  tier: "premium" | "free";
  metadata?: Record<string, any>;
}

export interface CopilotMessage {
  id: string;
  type: "user" | "ai" | "system";
  text: string;
  time: string;
  timestamp: Date;
  images?: string[];
  status: "pending" | "sent" | "failed";
  clientMsgId?: string;
  fromAi?: string;
  voiceUri?: string;
  voiceDuration?: number;
}

export interface Participant {
  userId: string;
  lastReadAt: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    picture: string;
  };
}

export interface LastMessage {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  lastMessage: LastMessage | null;
  participants: Participant[];
  unreadCount: number;
}

// For getAllConversations endpoint
export interface GetAllConversationsResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    items: Conversation[];
    nextOlderCursor?: {
      createdAt: string;
      id: string;
    };
    hasMoreOlder: boolean;
  };
}

export interface GetChatHistoryResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    items: {
      id: string;
      conversationId: string;
      senderId: string;
      text: string;
      createdAt: string;
      clientMsgId: string;
      mediaUrl: string;
      fromAi: string;
      // ... other message fields
    }[];
    nextOlderCursor?: {
      createdAt: string;
      id: string;
    };
    hasMoreOlder: boolean;
  };
}
