// src/orchestrator.ts
import type { ModelMessage } from "ai";
import { classifyMessage } from "./classifier";
import { orderAgent } from "./subagent/orderAgent";
import { billingAgent } from "./subagent/billingAgent";
import { supportAgent } from "./subagent/supportAgent";

export const handleUserMessage = async (messages: ModelMessage[]) => {
  // Step 1: Classify (with built-in fallback to 'support')
  const agentType = await classifyMessage(messages);

  console.log(`Routing conversation to: [${agentType.toUpperCase()}]`);

  // Step 2: Route to the specific agent
  switch (agentType) {
    case "order":
      return orderAgent(messages).toUIMessageStreamResponse();

    case "billing":
      return billingAgent(messages).toUIMessageStreamResponse();

    case "support":
    case "general":
    default:
      return supportAgent(messages).toUIMessageStreamResponse();
  }
};
