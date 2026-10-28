import express from "express";
import type { ErrorRequestHandler } from "express";
import { messageRoutes } from "./routes/messageRoutes.js";

export const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/messages", messageRoutes);

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const status =
    typeof error?.status === "number" && error.status >= 400 && error.status < 500
      ? error.status
      : 500;

  if (status === 500) {
    console.error(error);
  }

  res.status(status).json({
    message:
      status === 413
        ? "Request body is too large"
        : status === 500
          ? "Internal server error"
          : "Invalid request",
  });
};

app.use(errorHandler);
