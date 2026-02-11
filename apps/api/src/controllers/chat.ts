import { Hono } from "hono";
import { convertToModelMessages, type UIMessage } from "ai"; // Import toCoreMessages
import { classifyMessage } from "../services/classifier";
import { orderAgent } from "../services/subagent/orderAgent";
import { billingAgent } from "../services/subagent/billingAgent";
import { supportAgent } from "../services/subagent/supportAgent";
import { ConversationRepository } from "../repositories/conversation";

const chat = new Hono();

chat.post("/", async (c) => {
  try {
    const { messages }: { messages: UIMessage[] } = await c.req.json();

    const coreMessages = await convertToModelMessages(messages);
    const agentType = await classifyMessage(coreMessages);

    switch (agentType) {
      case "order":
        return orderAgent(coreMessages).toUIMessageStreamResponse();

      case "billing":
        return billingAgent(coreMessages).toUIMessageStreamResponse();

      case "support":
      case "general":
      default:
        return supportAgent(coreMessages).toUIMessageStreamResponse();
    }
  } catch (error) {
    console.error("Error in chat handler:", error);
    return c.text("An internal error occurred.", 500);
  }
});

chat.get("/conversations", async (c) => {
  const conversations = await ConversationRepository.listAllConversations();
  return c.json(conversations);
});

chat.get("/conversations/:id", async (c) => {
  const { id } = c.req.param();
  const conversation =
    await ConversationRepository.getConversationWithMessages(id);

  if (!conversation) {
    return c.text("Conversation not found", 404);
  }

  return c.json(conversation);
});

chat.delete("/conversations/:id", async (c) => {
  const { id } = c.req.param();
  try {
    await ConversationRepository.deleteConversation(id);
    return c.json({ ok: true, message: "Conversation deleted" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return c.json(
      { ok: false, message: "Conversation not found or failed to delete" },
      404,
    );
  }
});

export default chat;
