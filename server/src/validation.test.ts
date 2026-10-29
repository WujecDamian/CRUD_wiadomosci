import { describe, expect, it } from "vitest";
import {
  isValidId,
  MAX_MESSAGE_LENGTH,
  validateContent,
} from "./validation.js";

describe("validateContent", () => {
  it("accepts a normal message", () => {
    // Arrange
    const input = "Message";

    // Act
    const result = validateContent(input);

    // Assert
    expect(result).toEqual({ content: "Message" });
  });

  it("rejects an empty string", () => {
    // Arrange
    const input = "";

    // Act
    const result = validateContent(input);

    // Assert
    expect(result).toEqual({ error: "Content is required" });
  });

  it("rejects a whitespace-only string", () => {
    // Arrange
    const input = "    ";

    // Act
    const result = validateContent(input);

    // Assert
    expect(result).toEqual({ error: "Content is required" });
  });

  it("accepts a message of exactly MAX_MESSAGE_LENGTH characters", () => {
    // Arrange
    const input = "a".repeat(MAX_MESSAGE_LENGTH);

    // Act
    const result = validateContent(input);

    // Assert
    expect(result).toEqual({ content: input });
  });

  it("rejects a message of MAX_MESSAGE_LENGTH + 1 characters", () => {
    // Arrange
    const input = "a".repeat(MAX_MESSAGE_LENGTH + 1);

    // Act
    const result = validateContent(input);

    // Assert
    expect(result).toEqual({
      error: `Content must be at most ${MAX_MESSAGE_LENGTH} characters`,
    });
  });

  it("trims surrounding spaces", () => {
    // Arrange
    const input = " Message ";

    // Act
    const result = validateContent(input);

    // Assert
    expect(result).toEqual({ content: "Message" });
  });

  it("checks the length after trimming", () => {
    // Arrange
    const text = "a".repeat(MAX_MESSAGE_LENGTH);
    const input = `  ${text}  `;

    // Act
    const result = validateContent(input);

    // Assert
    expect(result).toEqual({ content: text });
  });

  it.each([undefined, null, 123, {}])(
    "rejects non-string value %s",
    (value) => {
      expect(validateContent(value)).toEqual({ error: "Content is required" });
    },
  );
});

describe("isValidId", () => {
  const validId = "3f2b8c1e-9a4d-4e6b-8f1a-2c5d7e9b0a13";

  it("accepts a valid UUID", () => {
    expect(isValidId(validId)).toBe(true);
  });

  it("accepts an uppercase UUID", () => {
    expect(isValidId(validId.toUpperCase())).toBe(true);
  });

  it.each([
    ["a random word", "banana"],
    ["an empty string", ""],
    ["a UUID with an extra character", `${validId}a`],
    ["a UUID with a missing character", validId.slice(0, -1)],
    ["a UUID without dashes", validId.replaceAll("-", "")],
    ["a UUID with surrounding spaces", ` ${validId} `],
  ])("rejects %s", (_name, value) => {
    expect(isValidId(value)).toBe(false);
  });

  it.each([undefined, null, 123, {}])("rejects non-string value %s", (value) => {
    expect(isValidId(value)).toBe(false);
  });
});
