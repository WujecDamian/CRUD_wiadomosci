import { useState } from "react"
import type { FormEvent } from "react"
import { Send } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useCreateMessageMutation } from "../../api/messagesApi"

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
      console.error(requestError)
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
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </form>
  )
}
