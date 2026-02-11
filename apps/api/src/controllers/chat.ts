import { Hono } from "hono";
import { convertToModelMessages, type UIMessage } from "ai"; // Import toCoreMessages
import { classifyMessage } from "../services/classifier";
import { orderAgent } from "../services/subagent/orderAgent";
import { billingAgent } from "../services/subagent/billingAgent";
import { supportAgent } from "../services/subagent/supportAgent";
import { ConversationRepository } from "../repositories/conversation";
import { saveMessages } from "../services/conversation";

const chat = new Hono();

chat.post("/", async (c) => {
  try {
    const {
      conversationId,
      messages,
    }: { conversationId?: string; messages: UIMessage[] } = await c.req.json();
    let newConversationId = undefined;

    if (!conversationId) {
      const newConv = await ConversationRepository.createConversation();
      newConversationId = newConv.id;
    }

    const coreMessages = await convertToModelMessages(messages);

    console.log(messages);
    const agentType = await classifyMessage(coreMessages);

    const onFinish = ({ messages: responseMessages }: { messages: any[] }) => {
      saveMessages(conversationId || newConversationId, [
        ...messages,
        ...responseMessages,
      ]);
    };

    switch (agentType) {
      case "order":
        return orderAgent(coreMessages).toUIMessageStreamResponse({ onFinish });

      case "billing":
        return billingAgent(coreMessages).toUIMessageStreamResponse({
          onFinish,
        });

      case "support":
      case "general":
      default:
        return supportAgent(coreMessages).toUIMessageStreamResponse({
          onFinish,
        });
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
