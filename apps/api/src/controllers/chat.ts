import { Hono } from "hono";
import { handleUserMessage } from "../services/orchestrator";

const chat = new Hono();

chat.post("/", async (c) => {
  try {
    const { messages } = await c.req.json();
    console.log(messages);

    const responseText = await handleUserMessage(messages);
    console.log(responseText);
    return responseText.toUIMessageStream();
  } catch (error) {
    console.error("Error in chat handler:", error);
    return c.text("An internal error occurred.", 500);
  }
});

export default chat;
