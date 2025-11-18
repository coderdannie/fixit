import { RootState } from "@/store";
import { clearAuth } from "@/store/slices/authSlice";
import { Endpoints, RtkqTagEnum } from "@/utils/Endpoints";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { router } from "expo-router";
import { Alert } from "react-native";

export const BASE_URL =
  "http://fixit-fixitserver-ebifgn-14d745-72-61-105-131.traefik.me/api/v1";

export const SOCKET_BASE_URL =
  "http://fixit-fixitserver-ebifgn-14d745-72-61-105-131.traefik.me";

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: any;
}

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BASE_URL,

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom baseQuery wrapper to handle 401
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);
  const isExpiredTokenError =
    // 1. Check if it's a 400 error
    result.error && result.error.status === 400;
  // Check if the response status is 401
  if (isExpiredTokenError) {
    // Show alert to user
    Alert.alert(
      "Session Expired",
      "Your session has expired. Please log in again.",
      [
        {
          text: "OK",
          onPress: () => {
            // Dispatch clearAuth action
            api.dispatch(clearAuth());

            // Navigate to login screen
            router.replace("/(auth)/login");
          },
        },
      ],
      { cancelable: false }
    );
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: Object.values(RtkqTagEnum),
  endpoints: (builder) => ({
    root: builder.query<any, any>({
      query: () => ({
        url: Endpoints.ROOT,
        method: "GET",
      }),
      providesTags: () => [{ type: RtkqTagEnum.ROOT, id: "ROOT" }],
    }),

    uploadFile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: Endpoints.UPLOAD_FILE,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.UPLOAD_FILE }],
    }),

    uploadDataUrl: builder.mutation<any, { base64Data: string }>({
      query: (args) => ({
        url: Endpoints.UPLOAD_DATA_URL,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.UPLOAD_FILE }],
    }),

    getFile: builder.query<string, { publicId: string }>({
      query: ({ publicId }) => {
        const url = `${Endpoints.GET_FILE}?key=${publicId}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: (_result, _error, { publicId }) => [
        { type: RtkqTagEnum.GET_FILE, id: publicId },
      ],
    }),

    preference: builder.query<any, any>({
      query: () => ({
        url: Endpoints.PREFERENCE,
        method: "GET",
      }),
      providesTags: () => [{ type: RtkqTagEnum.ROOT }],
    }),

    userPreference: builder.mutation<any, { preferenceIds: string[] }>({
      query: (args) => ({
        url: Endpoints.USER_PREFERENCES,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.ROOT }],
    }),

    getUserPreference: builder.query<any, any>({
      query: () => ({
        url: Endpoints.PREFERENCE,
        method: "GET",
      }),
      providesTags: () => [{ type: RtkqTagEnum.ROOT }],
    }),
  }),
});

export const {
  useRootQuery,
  useUploadFileMutation,
  useUploadDataUrlMutation,
  useGetFileQuery,
  usePreferenceQuery,
  useUserPreferenceMutation,
  useGetUserPreferenceQuery,
} = api;

export default api;
