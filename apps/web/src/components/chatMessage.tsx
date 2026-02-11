import type { UIMessage } from "ai";
import { ToolCall } from "./toolInvocation";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { role, parts } = message;
  const isUser = role === "user";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-[90%] whitespace-pre-wrap ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        {parts.map((part, index) => {
          // TEXT
          if (part.type === "text") {
            return <div key={index}>{part.text}</div>;
          }

          // REASONING (optional → often hidden)
          if (part.type === "reasoning") {
            return (
              <div key={index} className="text-xs opacity-60">
                {part.text}
              </div>
            );
          }

          // TOOLS
          {
            /* if (part.type.startsWith("tool-")) { */
          }
          {
            /*   return <ToolCall key={part.toolCallId} toolInvocation={part} />; */
          }
          {
            /* } */
          }

          return null;
        })}
      </div>

      <span className="text-xs text-gray-400 mt-1 uppercase">{role}</span>
    </div>
  );
}
