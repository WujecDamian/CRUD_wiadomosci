import { useGetMessagesQuery } from "./api/messagesApi"
import { MessageForm } from "./components/MessageForm/MessageForm"
import { CornerPanels } from "./components/CornerPanels/CornerPanels"
import { MessageTable } from "./components/MessageTable/MessageTable"

export const App = () => {
  const { data, isLoading, isError, refetch } = useGetMessagesQuery()
  const messages = data ?? []

  return (
    <main className="min-h-svh bg-muted/40 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl border bg-card shadow-sm">
        <MessageTable
          messages={messages}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MessageForm />
      </div>
      <CornerPanels />
    </main>
  )
}
