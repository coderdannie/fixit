import api from "@/apis/api";
import { AddNote } from "@/types/job-notes";
import { Endpoints, RtkqTagEnum } from "@/utils/Endpoints";

export const jobQuery = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    addNote: builder.mutation<any, AddNote>({
      query: (args) => ({
        url: Endpoints.ADD_NOTE,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.GET_ALL_NOTES }],
    }),

    updateNote: builder.mutation<
      any,
      {
        id: string;
        title?: string;
        content?: string;
        removePublicIds?: string[];
      }
    >({
      query: ({ id, ...args }) => ({
        url: `${Endpoints.GET_ALL_NOTES}/${id}`,
        method: "PUT",
        body: args,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: RtkqTagEnum.GET_ALL_NOTES },
        { type: RtkqTagEnum.GET_NOTE_DETAILS, id },
      ],
    }),
    deleteNote: builder.mutation<
      any,
      {
        id: string;
      }
    >({
      query: ({ id, ...args }) => ({
        url: `${Endpoints.GET_ALL_NOTES}/${id}`,
        method: "DELETE",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.GET_ALL_NOTES }],
    }),
    getAllNotes: builder.query<
      any,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: Endpoints.GET_ALL_NOTES,
        method: "GET",
        params: {
          page,
          limit,
          ...(search && { search }),
        },
      }),
      providesTags: [{ type: RtkqTagEnum.GET_ALL_NOTES }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          data: {
            ...newItems.data,
            notes: [...currentCache.data.notes, ...newItems.data.notes],
          },
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.search !== previousArg?.search
        );
      },
    }),

    getNoteById: builder.query<any, string>({
      query: (id) => ({
        url: `${Endpoints.GET_ALL_NOTES}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: RtkqTagEnum.GET_NOTE_DETAILS, id },
      ],
    }),
  }),
});

export const {
  useAddNoteMutation,
  useUpdateNoteMutation,
  useGetAllNotesQuery,
  useGetNoteByIdQuery,
  useDeleteNoteMutation,
} = jobQuery;
