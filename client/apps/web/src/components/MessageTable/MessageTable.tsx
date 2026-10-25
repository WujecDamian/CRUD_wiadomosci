import { useState } from "react"
import { Ellipsis, Pencil, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useDeleteMessageMutation } from "../../api/messagesApi"
import type { Message } from "../../types/message"
import { EditMessageDialog } from "../EditMessageDialog/EditMessageDialog"

type MessageTableProps = {
  messages: Message[]
  isLoading: boolean
  isError: boolean
}

export const MessageTable = ({
  messages,
  isLoading,
  isError,
}: MessageTableProps) => {
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null)
  const [displayNumber, setDisplayNumber] = useState<number | null>(null)
  const [deleteMessage] = useDeleteMessageMutation()

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id).unwrap()
    } catch (requestError) {
      console.error(requestError)
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-24 pl-4 text-xs tracking-wide text-muted-foreground uppercase">
              ID
            </TableHead>
            <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
              Wiadomość
            </TableHead>
            <TableHead className="pr-4 text-right text-xs tracking-wide text-muted-foreground uppercase">
              Akcje
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                Ładowanie wiadomości...
              </TableCell>
            </TableRow>
          )}
          {isError && (
            <TableRow>
              <TableCell colSpan={3} className="py-8 text-center text-destructive">
                Nie udało się wczytać wiadomości.
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && messages.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                Brak wiadomości.
              </TableCell>
            </TableRow>
          )}
          {messages.map((message, index) => {
            const rowNumber = index + 1

            return (
              <TableRow key={message.id}>
                <TableCell className="pl-4">
                  <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {message.id}
                  </span>
                </TableCell>
                <TableCell>{message.content}</TableCell>
                <TableCell className="pr-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="outline" size="icon" className="size-8" />
                      }
                    >
                      <Ellipsis />
                      <span className="sr-only">Akcje</span> {/* dla screen readerów */}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setMessageToEdit(message)
                          setDisplayNumber(rowNumber)
                        }}
                      >
                        <Pencil />
                        Edycja
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          handleDelete(message.id)
                        }}
                      >
                        <Trash2 />
                        Usuwanie
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <EditMessageDialog
        message={messageToEdit}
        displayNumber={displayNumber}
        onClose={() => {
          setMessageToEdit(null)
          setDisplayNumber(null)
        }}
      />
    </>
  )
}
