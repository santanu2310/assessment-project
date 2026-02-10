import { prisma } from "../lib/db";
import { z } from "zod";

const inputSchema = z.object({
  conversationId: z.string().describe("The ID of the conversation to query."),
});

async function run({ conversationId }: z.infer<typeof inputSchema>) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc", // Return messages in chronological order
      },
      // Limit the number of messages to avoid overwhelming the context
      take: 20,
    });

    if (messages.length === 0) {
      return `No history found for conversation ID: ${conversationId}`;
    }

    // Format the history for a clean, readable output
    const formattedHistory = messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\\n");

    return `Conversation History (last ${messages.length} messages):\\n${formattedHistory}`;
  } catch (error) {
    console.error("Failed to query conversation history:", error);
    return "An error occurred while trying to fetch the conversation history.";
  }
}

export const queryConversationHistoryTool = {
  inputSchema: inputSchema,
  run,
  name: "queryConversationHistory",
  description:
    "Queries the history of a conversation and returns the most recent messages.",
};

