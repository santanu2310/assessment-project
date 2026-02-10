import { tool } from "ai";
import { prisma } from "../lib/db";
import { z } from "zod";

// Define the schema for the tool's parameters
const parameters = z.object({
  conversationId: z.string().describe("The ID of the conversation to query."),
});

// Define the function that will be executed
async function execute({
  conversationId,
}: z.infer<typeof parameters>): Promise<string> {
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

// Export the tool with the explicit definitions
export const queryConversationHistoryTool = tool({
  description:
    "Queries the history of a conversation and returns the most recent messages.",
  parameters,
  execute,
});

