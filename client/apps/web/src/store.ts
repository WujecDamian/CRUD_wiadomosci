import { configureStore } from "@reduxjs/toolkit"
import { messagesApi } from "./api/messagesApi"

export const store = configureStore({
  reducer: {
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(messagesApi.middleware),
})
