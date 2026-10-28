import type { Request, Response } from "express";
import { prisma } from "../db.js";
import { isValidId, validateContent } from "../validation.js";

export const getMessages = async (_request: Request, response: Response) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });

    response.json(messages);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Could not load messages" });
  }
};

export const createMessage = async (request: Request, response: Response) => {
  const result = validateContent(request.body?.content);

  if (result.error !== undefined) {
    response.status(400).json({ message: result.error });
    return;
  }

  const { content } = result;

  try {
    const message = await prisma.message.create({
      data: { content },
    });

    response.status(201).json(message);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Could not create message" });
  }
};

export const updateMessage = async (request: Request, response: Response) => {
  const id = request.params.id;

  if (!isValidId(id)) {
    response.status(400).json({ message: "Id must be a valid UUID" });
    return;
  }

  const result = validateContent(request.body?.content);

  if (result.error !== undefined) {
    response.status(400).json({ message: result.error });
    return;
  }

  const { content } = result;

  try {
    const existingMessage = await prisma.message.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      response.status(404).json({ message: "Message not found" });
      return;
    }

    const message = await prisma.message.update({
      where: { id },
      data: { content },
    });

    response.json(message);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Could not update message" });
  }
};

export const deleteMessage = async (request: Request, response: Response) => {
  const id = request.params.id;

  if (!isValidId(id)) {
    response.status(400).json({ message: "Id must be a valid UUID" });
    return;
  }

  try {
    const existingMessage = await prisma.message.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      response.status(404).json({ message: "Message not found" });
      return;
    }

    await prisma.message.delete({
      where: { id },
    });

    response.status(204).send();
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Could not delete message" });
  }
};
