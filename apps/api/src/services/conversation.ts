import { MessageRepository } from "../repositories/message";

export async function saveMessages(
  conversationId: string | undefined,
  allMessages: any[],
) {
  try {
    if (conversationId == undefined) {
      return;
    }

    const lastTwo = allMessages.slice(-2);

    for (const msg of lastTwo) {
      // Extract text from parts
      const textContent =
        msg.parts
          ?.filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join("\n") || "";

      if (textContent) {
        await MessageRepository.createMessage({
          conversationId: conversationId,
          role: msg.role === "user" ? "user" : "assistant",
          content: textContent,
        });
      }
    }

    console.log(`Saved messages to conversation: ${conversationId}`);
  } catch (error) {
    console.error("Failed to save messages:", error);
  }
}
