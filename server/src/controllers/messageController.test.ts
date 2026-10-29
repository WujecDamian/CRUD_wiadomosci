import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_MESSAGE_LENGTH } from "../validation.js";
import { app } from "../app.js";
import { prisma } from "../db.js";

// Replace the real database module with a fake, so tests need no Postgres.
vi.mock("../db.js", () => ({
  prisma: {
    message: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const validId = "3f2b8c1e-9a4d-4e6b-8f1a-2c5d7e9b0a13";

const makeMessage = (content = "hi") => ({
  id: validId,
  content,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
});

// Reset the spies between tests so one test can't leak into another.
beforeEach(() => {
  vi.resetAllMocks();
});

describe("GET /api/messages", () => {
  it("returns 200 and the list of messages", async () => {
    // Arrange
    vi.mocked(prisma.message.findMany).mockResolvedValue([makeMessage()]);

    // Act
    const response = await request(app).get("/api/messages");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: validId, content: "hi", createdAt: "2026-01-01T00:00:00.000Z" },
    ]);
    expect(prisma.message.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
  });

  it("returns 500 when the database fails", async () => {
    // Arrange
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(prisma.message.findMany).mockRejectedValue(new Error("db down"));

    // Act
    const response = await request(app).get("/api/messages");

    // Assert
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Could not load messages" });
  });
});

describe("POST /api/messages", () => {
  it("returns 400 when content is missing", async () => {
    // Act
    const response = await request(app).post("/api/messages").send({});

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Content is required" });
    expect(prisma.message.create).not.toHaveBeenCalled();
  });

  it("returns 400 when content is too long", async () => {
    // Act
    const response = await request(app)
      .post("/api/messages")
      .send({ content: "a".repeat(MAX_MESSAGE_LENGTH + 1) });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: `Content must be at most ${MAX_MESSAGE_LENGTH} characters`,
    });
    expect(prisma.message.create).not.toHaveBeenCalled();
  });

  it("returns 201 and saves the trimmed content", async () => {
    // Arrange
    vi.mocked(prisma.message.create).mockResolvedValue(makeMessage("hello"));

    // Act
    const response = await request(app)
      .post("/api/messages")
      .send({ content: "  hello  " });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: validId, content: "hello" });
    expect(prisma.message.create).toHaveBeenCalledWith({
      data: { content: "hello" },
    });
  });

  it("returns 500 when the database fails", async () => {
    // Arrange
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(prisma.message.create).mockRejectedValue(new Error("db down"));

    // Act
    const response = await request(app)
      .post("/api/messages")
      .send({ content: "hello" });

    // Assert
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Could not create message" });
  });
});

describe("PATCH /api/messages/:id", () => {
  it("returns 400 when the id is not a valid UUID", async () => {
    // Act
    const response = await request(app)
      .patch("/api/messages/banana")
      .send({ content: "new" });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Id must be a valid UUID" });
    expect(prisma.message.update).not.toHaveBeenCalled();
  });

  it("returns 400 when content is invalid", async () => {
    // Act
    const response = await request(app)
      .patch(`/api/messages/${validId}`)
      .send({ content: "   " });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Content is required" });
    expect(prisma.message.update).not.toHaveBeenCalled();
  });

  it("returns 404 when the message does not exist", async () => {
    // Arrange
    vi.mocked(prisma.message.findUnique).mockResolvedValue(null);

    // Act
    const response = await request(app)
      .patch(`/api/messages/${validId}`)
      .send({ content: "new" });

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Message not found" });
    expect(prisma.message.update).not.toHaveBeenCalled();
  });

  it("returns 200 and the updated message", async () => {
    // Arrange
    vi.mocked(prisma.message.findUnique).mockResolvedValue(makeMessage("old"));
    vi.mocked(prisma.message.update).mockResolvedValue(makeMessage("new"));

    // Act
    const response = await request(app)
      .patch(`/api/messages/${validId}`)
      .send({ content: " new " });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: validId, content: "new" });
    expect(prisma.message.update).toHaveBeenCalledWith({
      where: { id: validId },
      data: { content: "new" },
    });
  });

  it("returns 500 when the database fails", async () => {
    // Arrange
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(prisma.message.findUnique).mockRejectedValue(new Error("db down"));

    // Act
    const response = await request(app)
      .patch(`/api/messages/${validId}`)
      .send({ content: "new" });

    // Assert
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Could not update message" });
  });
});

describe("DELETE /api/messages/:id", () => {
  it("returns 400 when the id is not a valid UUID", async () => {
    // Act
    const response = await request(app).delete("/api/messages/banana");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Id must be a valid UUID" });
    expect(prisma.message.findUnique).not.toHaveBeenCalled();
  });

  it("returns 404 when the message does not exist", async () => {
    // Arrange
    vi.mocked(prisma.message.findUnique).mockResolvedValue(null);

    // Act
    const response = await request(app).delete(`/api/messages/${validId}`);

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Message not found" });
    expect(prisma.message.delete).not.toHaveBeenCalled();
  });

  it("returns 204 and deletes the message when it exists", async () => {
    // Arrange
    vi.mocked(prisma.message.findUnique).mockResolvedValue({
      id: validId,
      content: "hi",
      createdAt: new Date(),
    });

    // Act
    const response = await request(app).delete(`/api/messages/${validId}`);

    // Assert
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
    expect(prisma.message.delete).toHaveBeenCalledWith({
      where: { id: validId },
    });
  });

  it("returns 500 when the database fails", async () => {
    // Arrange
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(prisma.message.findUnique).mockRejectedValue(new Error("db down"));

    // Act
    const response = await request(app).delete(`/api/messages/${validId}`);

    // Assert
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Could not delete message" });
  });
});
