"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatMessage } from "./chatMessage";
import { ChatInput } from "./chatInput";
import type { UIMessage } from "ai";

interface ChatProps {
  oldMessages: UIMessage[];
  conversationId?: string;
}
export default function Chat({ oldMessages, conversationId }: ChatProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, error } = useChat({
    messages: oldMessages,
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ id, messages }) => {
        return {
          body: {
            id,
            conversationId: conversationId,
            messages: messages,
          },
        };
      },
    }),
    onError: (e) => console.error(e),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setInput("");

    await sendMessage({
      text: currentInput,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">👋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Start a conversation
              </h3>
              <p className="text-gray-500 max-w-sm">
                Ask anything! I'm here to help you with your queries.
              </p>
            </div>
          )}

          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 rounded-2xl w-fit border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
              </div>
              <span className="text-xs font-medium text-blue-600">
                Assistant is typing...
              </span>
            </div>
          )}

          {error && (
            <div className="mx-auto max-w-md p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center gap-2">
              <p>Something went wrong. Please try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-1 bg-white border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
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
