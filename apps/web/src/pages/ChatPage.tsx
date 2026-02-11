import { useEffect } from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";
import Chat from "src/components/Chat";
import { ConversationSidebar } from "src/components/ConversationSidebar";
import { EmptyState } from "src/components/EmptyState";
import { useChatStore } from "src/lib/ChatContext";

const ChatPage = () => {
  const {
    conversations,
    selectedId,
    isLoading,
    setSelectedId,
    refreshConversations,
    handleNewChat,
  } = useChatStore();

  // Load conversations on mount
  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const activeConversation =
    selectedId === "new"
      ? {
          id: "new",
          title: "New Conversation",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=new",
          oldMessages: [],
        }
      : conversations.find((c) => c.id === selectedId);

  return (
    <div className="flex h-screen w-full bg-[#0f172a] overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-[30%] min-w-[300px] max-w-[400px] h-full flex-shrink-0">
        {isLoading && conversations.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-[#1e293b] border-r border-white/5">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        ) : (
          <ConversationSidebar
            conversations={conversations}
            activeId={selectedId}
            onSelect={setSelectedId}
            onNewChat={handleNewChat}
          />
        )}
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full bg-gray-50 relative overflow-hidden">
        {activeConversation ? (
          <div className="flex flex-col h-full">
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

            <div className="flex-1 overflow-hidden">
              <Chat
                oldMessages={activeConversation.oldMessages}
                key={activeConversation.id}
                conversationId={
                  activeConversation.id === "new"
                    ? undefined
                    : activeConversation.id
                }
              />
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
