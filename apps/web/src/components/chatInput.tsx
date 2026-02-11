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
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200"
    >
      <div className="max-w-md mx-auto relative flex items-center gap-2">
        <input
          className="flex-1 p-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />

        {isLoading ? (
          <button
            type="button"
            onClick={stop}
            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
            aria-label="Stop generating"
          >
            ⏹
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 bg-blue-600 text-white rounded-full disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-md"
            aria-label="Send message"
          >
            ⬆
          </button>
        )}
      </div>
    </form>
  );
}
