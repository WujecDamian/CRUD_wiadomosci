import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Message } from "../types/message"

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Messages"],
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], void>({
      query: () => "/messages",
      providesTags: ["Messages"],
    }),
    createMessage: builder.mutation<Message, { content: string }>({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Messages"],
    }),
    updateMessage: builder.mutation<Message, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/messages/${id}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: ["Messages"],
    }),
    deleteMessage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
})

export const {
  useGetMessagesQuery,
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi
