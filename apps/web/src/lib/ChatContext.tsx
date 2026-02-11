import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { client } from "./api";
import type { Conversation } from "../components/ConversationSidebar";
import type { UIMessage } from "ai";

interface ChatContextType {
  conversations: Conversation[];
  selectedId: string | undefined;
  isLoading: boolean;
  setSelectedId: (id: string | undefined) => void;
  refreshConversations: () => Promise<void>;
  handleNewChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const refreshConversations = useCallback(async () => {
    try {
      const res = await client.api.chat.conversations.$get();
      if (res.ok) {
        const data = await res.json();
        const getMessage = async (id: string) => {
          const messages = await client.api.chat.conversations[":id"].$get({
            param: {
              id: id, // This must match the name in your route (:id)
            },
          });
          const messageData = await messages.json();
          const fetchedMessages: UIMessage = (messageData.messages || []).map(
            (m: any) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              parts: [{ type: "text", text: m.content }],
            }),
          );
          return fetchedMessages;
        };

        const transformed: Conversation[] = await Promise.all(
          data.map(async (conv: any) => {
            const messages = await getMessage(conv.id);

            return {
              id: conv.id,
              title: `Session ${conv.id.slice(-4)}`,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.id}`,

              oldMessages: messages,

              lastMessage:
                conv._count?.messages > 0
                  ? `${conv._count.messages} messages`
                  : "New Conversation",
              timestamp: new Date(conv.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          }),
        );

        setConversations(transformed);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNewChat = () => {
    setSelectedId("new");
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        selectedId,
        isLoading,
        setSelectedId,
        refreshConversations,
        handleNewChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatStore = () => {
  const context = useContext(ChatContext);
  if (!context)
    throw new Error("useChatStore must be used within a ChatProvider");
  return context;
};
