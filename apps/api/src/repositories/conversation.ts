import { prisma } from "../lib/db";

export class ConversationRepository {
    /**
     * Creates a new conversation session.
     * @param userId Optional user ID to associate with the conversation.
     */
    static async createConversation(userId?: string) {
        return await prisma.conversation.create({
            data: {
                userId,
            },
        });
    }

    /**
     * Lists all conversations in the system, ordered by most recently updated.
     * Includes a count of messages for each conversation.
     */
    static async listAllConversations() {
        return await prisma.conversation.findMany({
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                _count: {
                    select: { messages: true },
                },
            },
        });
    }

    /**
     * Retrieves a single conversation by its ID, including all its messages.
     * Messages are ordered chronologically by creation date.
     * @param conversationId The unique identifier of the conversation.
     */
    static async getConversationWithMessages(conversationId: string) {
        return await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
    }

    /**
     * Deletes a conversation and all its associated messages (via cascade).
     * @param conversationId The unique identifier of the conversation to delete.
     */
    static async deleteConversation(conversationId: string) {
        return await prisma.conversation.delete({
            where: {
                id: conversationId,
            },
        });
    }
}
