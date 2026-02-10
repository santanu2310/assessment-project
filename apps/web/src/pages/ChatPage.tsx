import { MessageSquare, MoreHorizontal, X } from "lucide-react";
import Chat from "src/components/Chat";

const ChatPage = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#0f172a] overflow-hidden flex items-center justify-center p-4">
      {/* Background Decorative "Blobs" - mimicking the image style */}
      <div className="absolute top-10 left-10 w-4 h-6 bg-red-500 rounded-full opacity-50 blur-sm rotate-12" />
      <div className="absolute bottom-20 left-1/4 w-3 h-5 bg-blue-500 rounded-full opacity-40 blur-sm -rotate-45" />
      <div className="absolute top-1/3 right-10 w-4 h-6 bg-yellow-500 rounded-full opacity-30 blur-sm rotate-45" />
      <div className="absolute bottom-10 right-1/4 w-4 h-6 bg-green-500 rounded-full opacity-40 blur-sm" />

      {/* Main Chat Container */}
      <div className="relative w-full max-w-3xl bg-[#1e293b] rounded-lg shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[80vh]">
        {/* Header - Purple Gradient matching the image */}
        <header className="bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Annie"
                alt="AI Avatar"
                className="w-10 h-10 rounded-full border-2 border-white/20 bg-white/10"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#8b5cf6] rounded-full"></span>
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm leading-none">
                Assistant
              </h2>
              <p className="text-purple-200 text-xs mt-1 flex items-center gap-1">
                Online
              </p>
            </div>
          </div>
          <button className="text-white/80 hover:text-white transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </header>

        {/* Chat Component Injection */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <Chat />
        </div>

        {/* Floating Close Button Style - matching the purple 'X' in bottom right */}
        <div className="absolute -bottom-16 right-0">
          <button className="bg-[#8b5cf6] p-4 rounded-full text-white shadow-xl hover:scale-105 transition-transform">
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
