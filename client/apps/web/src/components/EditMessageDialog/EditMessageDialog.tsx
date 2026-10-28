import { useEffect, useState } from "react"
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

  useEffect(() => {
    setContent(message?.content ?? "")
    setError("")
  }, [message])

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

    try {
      await updateMessage({ id: message.id, content: trimmedContent }).unwrap()
      onClose()
    } catch (requestError) {
      console.error(requestError)
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
            aria-invalid={error ? true : undefined}
            className="mt-2 h-10"
            onChange={(event) => {
              setContent(event.target.value)
              if (error) {
                setError("")
              }
            }}
          />
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
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
