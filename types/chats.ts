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
  conversationId: string;
  limit?: number;
  cursorCreatedAt?: string;
  cursorId?: string;
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
