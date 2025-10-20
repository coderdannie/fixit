import { RootState } from "@/store";
import { Endpoints, RtkqTagEnum } from "@/utils/Endpoints";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://fixit-backend-server.onrender.com/api/v1";

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: any;
}

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
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
