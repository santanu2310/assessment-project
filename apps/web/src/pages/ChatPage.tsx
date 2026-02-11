import { useState, useEffect } from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";
import Chat from "src/components/Chat";
import {
  ConversationSidebar,
  type Conversation,
} from "src/components/ConversationSidebar";
import { EmptyState } from "src/components/EmptyState";
import { client } from "src/lib/api";

const ChatPage = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await client.api.chat.conversations.$get();
        if (res.ok) {
          const data = await res.json();
          console.log(data);

          // Transform API data to Sidebar Conversation format
          const transformed: Conversation[] = data.map((conv: any) => ({
            id: conv.id,
            title: conv.title,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.id}`,
            lastMessage:
              conv._count?.messages > 0
                ? `${conv._count.messages} messages`
                : "New Conversation",
            timestamp: new Date(conv.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

          setConversations(transformed);
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const activeConversation = conversations.find((c) => c.id === selectedId);

  return (
    <div className="flex h-screen w-full bg-[#0f172a] overflow-hidden">
      {/* Left Sidebar - 25-30% width */}
      <aside className="w-[30%] min-w-[300px] max-w-[400px] h-full flex-shrink-0">
        {isLoading ? (
          <div className="h-full flex items-center justify-center bg-[#1e293b] border-r border-white/5">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        ) : (
          <ConversationSidebar
            conversations={conversations}
            activeId={selectedId}
            onSelect={setSelectedId}
          />
        )}
      </aside>

      {/* Main Chat Area - 70% width */}
      <main className="flex-1 flex flex-col h-full bg-gray-50 relative overflow-hidden">
        {activeConversation ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.title}
                    className="w-10 h-10 rounded-full border border-gray-200"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h2 className="text-gray-900 font-semibold text-sm leading-none">
                    {activeConversation.title}
                  </h2>
                  <p className="text-green-600 text-[10px] font-medium mt-1 flex items-center gap-1 uppercase">
                    Active Now
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </header>

            {/* Chat Window */}
            <div className="flex-1 overflow-hidden">
              <Chat />
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

export default ChatPage;
