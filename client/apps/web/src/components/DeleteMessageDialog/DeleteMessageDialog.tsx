import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { useDeleteMessageMutation } from "../../api/messagesApi"
import { getErrorMessage } from "../../lib/getErrorMessage"
import type { Message } from "../../types/message"

type DeleteMessageDialogProps = {
  message: Message | null
  onClose: () => void
}

export const DeleteMessageDialog = ({
  message,
  onClose,
}: DeleteMessageDialogProps) => {
  const [error, setError] = useState("")
  const [deleteMessage, { isLoading }] = useDeleteMessageMutation()

  const handleClose = () => {
    setError("")
    onClose()
  }

  const handleDelete = async () => {
    if (!message) {
      return
    }

    try {
      await deleteMessage(message.id).unwrap()
      handleClose()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  return (
    <Dialog
      open={message !== null}
      onOpenChange={(open) => {
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Usunąć wiadomość?
          </DialogTitle>
          <DialogDescription>
            Tej operacji nie można cofnąć.
          </DialogDescription>
        </DialogHeader>
        <p className="rounded-md bg-muted px-3 py-2 text-sm break-words">
          {message?.content}
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Anuluj
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            onClick={handleDelete}
          >
            Usuń
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
