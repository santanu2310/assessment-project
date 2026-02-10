import { streamText, type ModelMessage, stepCountIs } from "ai";
import { model } from "../../lib/ai";
import { queryConversationHistoryTool } from "../../tools/queryConvHistory";

export const supportAgent = (messages: ModelMessage[]) => {
  return streamText({
    model: model,
    system: `You are the Support Agent. Your goal is to provide helpful, concise, and friendly assistance for general inquiries, technical troubleshooting, and FAQs.
    Tone: Empathetic, patient, and professional.
    Core Responsibilities: Answer general "How-to" questions.
        Guide users through troubleshooting steps for common technical issues.
        Use the query_conversation_history tool to maintain context and avoid asking the user to repeat themselves.`,
    messages,
    stopWhen: stepCountIs(10),
    tools: { queryConversationHistory: queryConversationHistoryTool },
  });
};
