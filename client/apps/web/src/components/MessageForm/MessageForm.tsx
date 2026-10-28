import { useState } from "react"
import type { FormEvent } from "react"
import { Send } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useCreateMessageMutation } from "../../api/messagesApi"
import { MAX_MESSAGE_LENGTH } from "../../lib/constants"
import { getErrorMessage } from "../../lib/getErrorMessage"

export const MessageForm = () => {
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [createMessage, { isLoading }] = useCreateMessageMutation()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const trimmedContent = content.trim()

    if (!trimmedContent) {
      setError("Wpisz treść wiadomości.")
      return
    }

    try {
      await createMessage({ content: trimmedContent }).unwrap()
      setContent("")
      setError("")
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  return (
    <form
      className="border-t px-4 py-4"
      onSubmit={handleSubmit}
    >
      <Label htmlFor="new-message">Nowa wiadomość</Label>
      <div className="mt-3 flex items-center gap-3">
        <Input
          id="new-message"
          value={content}
          placeholder="Wpisz treść wiadomości..."
          maxLength={MAX_MESSAGE_LENGTH}
          aria-invalid={error ? true : undefined}
          className="h-10"
          onChange={(event) => {
            setContent(event.target.value)
            if (error) {
              setError("")
            }
          }}
        />
        <Button
          type="submit"
          variant="outline"
          className="h-10 shrink-0"
          disabled={isLoading}
        >
          <Send />
          Wyślij
        </Button>
      </div>
      <div className="mt-2 flex justify-between gap-4 text-sm">
        <p className="text-destructive">{error}</p>
        <p className="shrink-0 text-muted-foreground">
          {content.length}/{MAX_MESSAGE_LENGTH}
        </p>
      </div>
    </form>
  )
}
