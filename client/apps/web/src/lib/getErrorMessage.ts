export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const { status, data } = error as { status?: unknown; data?: unknown }

    if (status === "FETCH_ERROR") {
      return "Brak połączenia z serwerem."
    }

    if (status === 404) {
      return "Ta wiadomość już nie istnieje."
    }

    if (status === 413) {
      return "Wiadomość jest zbyt duża."
    }

    if (typeof data === "object" && data !== null && "message" in data) {
      const { message } = data as { message: unknown }

      if (typeof message === "string" && message) {
        return message
      }
    }
  }

  return "Coś poszło nie tak. Spróbuj ponownie."
}
