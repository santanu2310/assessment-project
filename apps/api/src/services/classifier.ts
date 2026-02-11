// src/agents/classifier.ts
import { generateText, Output, type ModelMessage } from "ai";
import { model } from "../lib/ai"; // Your model setup
import { z } from "zod";

// Define valid agent destinations
export const AgentType = z.enum(["support", "order", "billing", "general"]);

// Define the schema
const classifierSchema = z.object({
  agent: AgentType,
  confidence: z.number().describe("Confidence score between 0 and 1"),
});

export const classifyMessage = async (messages: ModelMessage[]) => {
  // const lastUserMessage = messages.findLast((msg) => msg.role === "user");
  const lastUserMessage = [...messages]
    .reverse()
    .find((msg) => msg.role === "user");

  if (!lastUserMessage) return "support";

  try {
    const { output } = await generateText({
      model,
      output: Output.object({ schema: classifierSchema }),
      system: `You are a Router Agent. Analyze the user's latest message and route it to the correct specialist.
      
      DESTINATIONS:
      - 'order': Use for tracking orders, delivery status, shipping updates, order numbers (e.g., ORD-123), and cancellations.
      - 'billing': Use for refunds, invoices, payment issues, subscription pricing, and charges.
      - 'support': Use for technical help, general questions, greetings, or when the user is just chatting.
      
      EXAMPLES:
      "Where is my package ORD-1002?" -> agent: 'order'
      "I want to cancel my order" -> agent: 'order'
      "Why was I charged twice?" -> agent: 'billing'
      "How do I reset my password?" -> agent: 'support'
      "Hello!" -> agent: 'support'
      
      If unsure, choose 'support'.`,
      prompt: `User Message: "${lastUserMessage.content}"`,
    });

    console.log(output);
    if (output.confidence < 0.5) {
      console.log("Low confidence classification. Defaulting to Support.");
      return "support";
    }

    return output.agent;
  } catch (error) {
    // 4. ERROR FALLBACK: If the LLM fails to generate JSON, default to support
    console.error("Classification failed:", error);
    return "support";
  }
};
