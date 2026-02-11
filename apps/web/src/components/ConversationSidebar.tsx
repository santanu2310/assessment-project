import { MessageSquare } from "lucide-react";

export interface Conversation {
  id: string;
  title: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
}

export const ConversationSidebar = ({
  conversations,
  activeId,
  onSelect,
}: ConversationSidebarProps) => {
  return (
    <div className="h-full flex flex-col bg-[#1e293b] border-r border-white/5">
      {/* Sidebar Header */}
      <div className="p-4 mb-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="text-purple-500" size={24} />
            Messages
          </h1>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full p-4 flex items-center gap-3 transition-all border-b border-white/5 group ${
              activeId === conv.id
                ? "bg-purple-600/10 border-r-2 border-r-purple-500"
                : "hover:bg-white/5"
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={conv.avatar}
                alt={conv.title}
                className="w-12 h-12 rounded-full border border-white/10 bg-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1e293b] rounded-full"></span>
            </div>
            <div className="text-left overflow-hidden flex-1">
              <div className="flex justify-between items-baseline mb-0.5">
                <p
                  className={`font-semibold truncate ${activeId === conv.id ? "text-purple-400" : "text-white"}`}
                >
                  {conv.title}
                </p>
                <span className="text-[10px] text-slate-500 uppercase">
                  {conv.timestamp}
                </span>
              </div>
              <p className="text-slate-400 text-sm truncate group-hover:text-slate-300">
                {conv.lastMessage}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
