import { MessageCircle } from "lucide-react";

export const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 bg-[#0f172a]">
            <div className="p-6 rounded-full bg-slate-800/50">
                <MessageCircle size={48} className="text-slate-600" />
            </div>
            <div className="text-center">
                <h3 className="text-lg font-medium text-white">Your Messages</h3>
                <p className="text-sm">Select a conversation from the sidebar to start chatting.</p>
            </div>
        </div>
    );
};
