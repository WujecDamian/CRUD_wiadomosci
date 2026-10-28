export const MAX_MESSAGE_LENGTH = 50;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isValidId = (id: unknown): id is string =>
  typeof id === "string" && UUID_PATTERN.test(id);

type ContentResult =
  | { content: string; error?: undefined }
  | { content?: undefined; error: string };

export const validateContent = (value: unknown): ContentResult => {
  if (typeof value !== "string") {
    return { error: "Content is required" };
  }

  const content = value.trim();

  if (!content) {
    return { error: "Content is required" };
  }

  if (content.length > MAX_MESSAGE_LENGTH) {
    return {
      error: `Content must be at most ${MAX_MESSAGE_LENGTH} characters`,
    };
  }

  return { content };
};
