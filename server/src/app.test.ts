import request from "supertest";
import { describe, expect, it, vi } from "vitest";

// Runs before the imports below, because app.ts reads CORS_ORIGIN when loaded.
vi.hoisted(() => {
  process.env.CORS_ORIGIN = "http://allowed.test";
});

vi.mock("./db.js", () => ({ prisma: { message: {} } }));

import { app } from "./app.js";

describe("GET /health", () => {
  it("returns ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("CORS", () => {
  it("allows an origin from CORS_ORIGIN", async () => {
    const response = await request(app)
      .get("/health")
      .set("Origin", "http://allowed.test");

    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://allowed.test",
    );
  });

  it("does not allow an unknown origin", async () => {
    const response = await request(app)
      .get("/health")
      .set("Origin", "http://evil.test");

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("answers preflight OPTIONS requests with 204", async () => {
    const response = await request(app)
      .options("/api/messages")
      .set("Origin", "http://allowed.test");

    expect(response.status).toBe(204);
  });
});

describe("error handler", () => {
  it("returns 413 when the body is larger than 10kb", async () => {
    const response = await request(app)
      .post("/api/messages")
      .send({ content: "a".repeat(11 * 1024) });

    expect(response.status).toBe(413);
    expect(response.body).toEqual({ message: "Request body is too large" });
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/messages")
      .set("Content-Type", "application/json")
      .send("{ not json");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid request" });
  });
});
