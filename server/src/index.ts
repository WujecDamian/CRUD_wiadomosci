import express from "express";
import { messageRoutes } from "./routes/messageRoutes.js";

const app = express();
const port = 3001;

app.use(express.json());

app.use("/api/messages", messageRoutes);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
