import { Hono } from "hono";
import { convertToModelMessages, type UIMessage } from "ai"; // Import toCoreMessages
import { classifyMessage } from "../services/classifier";
import { orderAgent } from "../services/subagent/orderAgent";
import { billingAgent } from "../services/subagent/billingAgent";
import { supportAgent } from "../services/subagent/supportAgent";

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

export default chat;
