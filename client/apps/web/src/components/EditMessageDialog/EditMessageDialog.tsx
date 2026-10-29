import { useState } from "react"
import type { FormEvent } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useUpdateMessageMutation } from "../../api/messagesApi"
import { MAX_MESSAGE_LENGTH } from "../../lib/constants"
import { getErrorMessage } from "../../lib/getErrorMessage"
import type { Message } from "../../types/message"

type EditMessageDialogProps = {
  message: Message | null
  displayNumber: number | null
  onClose: () => void
}

export const EditMessageDialog = ({
  message,
  displayNumber,
  onClose,
}: EditMessageDialogProps) => {
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [updateMessage, { isLoading }] = useUpdateMessageMutation()

  const [previousMessage, setPreviousMessage] = useState(message)

  if (message !== previousMessage) {
    setPreviousMessage(message)
    setContent(message?.content ?? "")
    setError("")
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!message) {
      return
    }

    const trimmedContent = content.trim()

    if (!trimmedContent) {
      setError("Wpisz treść wiadomości.")
      return
    }

    if (trimmedContent === message.content) {
      onClose()
      return
    }

    try {
      await updateMessage({ id: message.id, content: trimmedContent }).unwrap()
      onClose()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  return (
    <Dialog
      open={message !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <p className="text-sm font-medium text-primary">
            Wiadomość #{displayNumber}
          </p>
          <DialogTitle className="text-xl font-semibold">
            Edytuj wiadomość
          </DialogTitle>
          <DialogDescription>
            Wprowadź zmiany i zapisz nową treść wiadomości.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="edit-message">Treść wiadomości</Label>
          <Input
            id="edit-message"
            value={content}
            maxLength={MAX_MESSAGE_LENGTH}
            aria-invalid={error ? true : undefined}
            className="mt-2 h-10"
            onChange={(event) => {
              setContent(event.target.value)
              if (error) {
                setError("")
              }
            }}
          />
          <div className="mt-2 flex justify-between gap-4 text-sm">
            <p className="text-destructive">{error}</p>
            <p className="shrink-0 text-muted-foreground">
              {content.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Anuluj
            </Button>
            <Button type="submit" disabled={isLoading}>
              Zapisz zmiany
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
