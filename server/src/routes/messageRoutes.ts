import { Router } from "express";
import * as messageController from "../controllers/messageController.js";

export const messageRoutes = Router();

messageRoutes.get("/", messageController.getMessages);
messageRoutes.post("/", messageController.createMessage);
messageRoutes.patch("/:id", messageController.updateMessage);
messageRoutes.delete("/:id", messageController.deleteMessage);
