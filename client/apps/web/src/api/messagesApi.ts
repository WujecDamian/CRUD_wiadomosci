import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Message } from "../types/message"

const invalidateOnNotFound = (_result: unknown, error: unknown) =>
  (error as { status?: unknown } | undefined)?.status === 404
    ? ["Messages" as const]
    : []

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL ?? "/api" }),
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
      invalidatesTags: (result, error) =>
        error ? invalidateOnNotFound(result, error) : ["Messages"],
    }),
    deleteMessage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error) =>
        error ? invalidateOnNotFound(result, error) : ["Messages"],
    }),
  }),
})

export const {
  useGetMessagesQuery,
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi
