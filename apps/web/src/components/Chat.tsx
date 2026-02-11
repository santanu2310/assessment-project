"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatMessage } from "./chatMessage";
import { ChatInput } from "./chatInput";

export default function Chat() {
  // 1. Manually manage input state
  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage, // CHANGED: Use sendMessage instead of append
    status,
    stop,
    error,
  } = useChat({
    onError: (e) => console.error(e),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // 2. Create a custom submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Save the current input to send
    const currentInput = input;

    // Clear the UI immediately
    setInput("");

    // Send the message using the new API signature
    await sendMessage({
      text: currentInput,
    });
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto min-h-screen bg-gray-50">
      <div className="flex-1 pt-10 pb-24 px-4 space-y-6">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-blue-500 animate-pulse px-4">
            <span className="text-sm font-medium">AI is thinking...</span>
            <button
              type="button"
              onClick={() => stop()}
              className="px-2 py-0.5 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50"
            >
              Stop
            </button>
          </div>
        )}

        {error && (
          <div className="mx-4 p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
            <span>Error: {error.message}</span>
            <button onClick={() => reload()} className="ml-2 underline">
              Retry
            </button>
          </div>
        )}
      </div>

      <ChatInput
        input={input}
        handleInputChange={(e) => setInput(e.target.value)}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
      />
    </div>
  );
}
