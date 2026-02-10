import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      // Replace with your actual Hono endpoint
      api: "http://localhost:3000/chat/",
    });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((m: UIMessage) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <span className="font-bold">
                {m.role === "user" ? "User: " : "AI: "}
              </span>
              {m.content}
            </div>

            {/* Warning Fix: Always check for toolInvocations and return null if empty */}
            {m.toolInvocations?.map((toolInvocation) => {
              const toolCallId = toolInvocation.toolCallId;

              return (
                <div key={toolCallId} className="text-gray-500 text-sm italic">
                  {toolInvocation.state === "call" ? (
                    <span>Running {toolInvocation.toolName}...</span>
                  ) : (
                    <span>Tool {toolInvocation.toolName} finished.</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="text-blue-500 animate-pulse">Thinking...</div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
