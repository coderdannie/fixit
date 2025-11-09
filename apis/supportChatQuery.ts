import api from "@/apis/api";
import {
  GetChatHistoryRequest,
  GetChatHistoryResponse,
  SendMessageRequest,
  SendMessageResponse,
  StartChatRequest,
  StartChatResponse,
} from "@/types/chats";
import { Endpoints, RtkqTagEnum } from "@/utils/Endpoints";

export const supportChatQuery = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Start a new chat conversation
    startChat: builder.mutation<StartChatResponse, StartChatRequest>({
      query: (args) => ({
        url: Endpoints.SUPPORT_CHAT_START,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.CHAT_SESSION }],
    }),

    // Send a message in the conversation
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: (args) => ({
        url: Endpoints.SUPPORT_CHAT_SEND,
        method: "POST",
        body: args,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: RtkqTagEnum.CHAT_MESSAGES, id: conversationId },
      ],
      // Optimistic update for better UX
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // You can dispatch additional actions here if needed
        } catch (error) {
          // Handle error
        }
      },
    }),

    // Get chat messages (if you need to fetch message history)
    getChatMessages: builder.query<
      GetChatHistoryResponse,
      GetChatHistoryRequest
    >({
      query: ({ conversationId, limit = 2, cursorCreatedAt, cursorId }) => ({
        url: Endpoints.SUPPORT_CHAT_HISTORY,
        method: "GET",
        params: {
          conversationId,
          limit,
          ...(cursorCreatedAt && { cursorCreatedAt }),
          ...(cursorId && { cursorId }),
        },
      }),
      providesTags: (result, error, { conversationId }) => [
        { type: RtkqTagEnum.CHAT_MESSAGES, id: conversationId },
      ],
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.conversationId}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        // If no cursor, it's the first load
        if (!arg.cursorCreatedAt && !arg.cursorId) {
          return newItems;
        }
        // Append older messages to the beginning
        return {
          ...newItems,
          messages: [...currentCache.messages, ...newItems.messages],
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
  useSendMessageMutation,
  useGetChatMessagesQuery,
} = supportChatQuery;
