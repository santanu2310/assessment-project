import { Send, Square } from "lucide-react";

interface ChatInputProps {
    input: string;
    handleInputChange: (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    stop: () => void;
}

export function ChatInput({
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
}: ChatInputProps) {
    return (
        <div className="p-4 bg-white border-t border-gray-100">
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto relative group"
            >
                <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 transition-all focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-50 focus-within:bg-white">
                    <textarea
                        rows={1}
                        className="flex-1 p-3 bg-transparent border-none resize-none focus:outline-none text-gray-700 placeholder:text-gray-400 min-h-[48px] max-h-[200px]"
                        value={input}
                        placeholder="Type a message..."
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e as any);
                            }
                        }}
                    />

                    {isLoading ? (
                        <button
                            type="button"
                            onClick={stop}
                            className="mb-1 p-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors flex-shrink-0"
                            aria-label="Stop generating"
                        >
                            <Square size={18} fill="currentColor" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="mb-1 p-2.5 bg-purple-600 text-white rounded-xl disabled:opacity-50 disabled:bg-gray-300 hover:bg-purple-700 transition-all shadow-sm hover:shadow-md flex-shrink-0"
                            aria-label="Send message"
                        >
                            <Send size={18} />
                        </button>
                    )}
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                    Press Enter to send, Shift + Enter for new line
                </p>
            </form>
        </div>
    );
}
