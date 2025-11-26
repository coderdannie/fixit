import {
  AiCopilotSendRequest,
  AiStartChatResponse,
  GetAllConversationsResponse,
  GetChatHistoryRequest,
  GetChatHistoryResponse,
} from "@/types/chats";
import { Endpoints, RtkqTagEnum } from "@/utils/Endpoints";
import api from "./api";

// Define the arguments interface required for fetching all conversations
interface GetAllConversationsRequest {
  limit?: number;
  type?: string;
  cursorCreatedAt?: string;
  cursorId?: string;
}

export const aiChatQuery = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    startChat: builder.mutation<AiStartChatResponse, { type: string }>({
      query: (args) => ({
        url: Endpoints.AI_CHAT_START,
        method: "POST",
        body: args,
      }),
      // Use the general AI_CHAT_SESSION tag for session changes
      invalidatesTags: [{ type: RtkqTagEnum.AI_CHAT_SESSION }],
    }),

    // AI Copilot REST API fallback
    sendAiMessage: builder.mutation<any, AiCopilotSendRequest>({
      query: (args) => ({
        url: Endpoints.AI_CHAT_SEND,
        method: "POST",
        body: args,
      }),
      // Corrected tag type, assuming CHAT_MESSAGES is for specific conversations
      invalidatesTags: (result, error, { conversationId }) => [
        { type: RtkqTagEnum.AI_CHAT_MESSAGES, id: conversationId },
        { type: RtkqTagEnum.AI_CHAT_SESSION, id: "LIST" }, // Add this line
      ],
    }),

    getChatMessages: builder.query<
      GetChatHistoryResponse, // <--- CORRECT RESPONSE TYPE
      GetChatHistoryRequest
    >({
      query: ({ conversationId, limit = 20, cursorCreatedAt, cursorId }) => ({
        url: Endpoints.AI_CHAT_HISTORY,
        method: "GET",
        params: {
          conversationId,
          limit,
          ...(cursorCreatedAt && { cursorCreatedAt }),
          ...(cursorId && { cursorId }),
        },
      }),
      providesTags: (result, error, { conversationId }) => [
        { type: RtkqTagEnum.AI_CHAT_MESSAGES, id: conversationId },
      ],
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.conversationId}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        // Reset cache if no cursor (initial fetch or refresh)
        if (!arg.cursorCreatedAt && !arg.cursorId) {
          return newItems;
        }

        // --- FIX: Access data.items and prepend older messages ---
        return {
          ...newItems,
          data: {
            ...newItems.data,
            // Prepend the new older messages (newItems.data.items)
            // to the existing messages (currentCache.data.items)
            items: [...newItems.data.items, ...currentCache.data.items],
          },
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.cursorCreatedAt !== previousArg?.cursorCreatedAt ||
          currentArg?.cursorId !== previousArg?.cursorId
        );
      },
    }),

    // --- CORRECTED QUERY DEFINITION ---
    getAllConversations: builder.query<
      GetAllConversationsResponse,
      GetAllConversationsRequest
    >({
      query: ({
        limit = 20,
        type = "FRONTEND_BACKEND_AI",
        cursorCreatedAt,
        cursorId,
      }) => ({
        url: Endpoints.GET_ALL_AI_CONVERSATIONS,
        method: "GET",
        params: {
          limit,
          type,
          ...(cursorCreatedAt && { cursorCreatedAt }),
          ...(cursorId && { cursorId }),
        },
      }),
      // Provide tag for the list of sessions/conversations
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({
                type: RtkqTagEnum.AI_CHAT_SESSION,
                id,
              })),
              { type: RtkqTagEnum.AI_CHAT_SESSION, id: "LIST" },
            ]
          : [{ type: RtkqTagEnum.AI_CHAT_SESSION, id: "LIST" }],

      serializeQueryArgs: ({ endpointName }) => endpointName,

      merge: (currentCache, newItems, { arg }) => {
        // Reset cache if no cursor (initial fetch)
        if (!arg.cursorCreatedAt && !arg.cursorId) {
          return newItems;
        }

        return {
          ...newItems,
          data: {
            ...newItems.data,

            items: [...currentCache.data.items, ...newItems.data.items],
          },
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.cursorCreatedAt !== previousArg?.cursorCreatedAt ||
          currentArg?.cursorId !== previousArg?.cursorId
        );
      },
    }),
  }),
});

export const {
  useStartChatMutation,
  useSendAiMessageMutation,
  useGetChatMessagesQuery,
  useGetAllConversationsQuery,
} = aiChatQuery;
