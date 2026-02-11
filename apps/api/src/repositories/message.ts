import { prisma } from "../lib/db";
import { AgentType, MessageRole } from "../../generated/prisma/client";

export interface CreateMessageParams {
    conversationId: string;
    role: MessageRole;
    content: string;
    agentType?: AgentType;
    reasoning?: string;
}

export class MessageRepository {
    /**
     * Creates a new message within a conversation.
     * Also updates the 'updatedAt' timestamp of the parent conversation.
     */
    static async createMessage(params: CreateMessageParams) {
        return await prisma.$transaction(async (tx) => {
            const message = await tx.message.create({
                data: {
                    conversationId: params.conversationId,
                    role: params.role,
                    content: params.content,
                    agentType: params.agentType,
                    reasoning: params.reasoning,
                },
            });

            // Update the conversation's updatedAt timestamp to bring it to the top of lists
            await tx.conversation.update({
                where: { id: params.conversationId },
                data: { updatedAt: new Date() },
            });

            return message;
        });
    }

    /**
     * Retrieves all messages for a specific conversation.
     */
    static async getMessagesByConversationId(conversationId: string) {
        return await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
        });
    }
}
