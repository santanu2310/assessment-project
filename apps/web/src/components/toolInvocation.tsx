import { type UIToolInvocation } from "ai";

interface ToolInvocationProps {
  toolInvocation: UIToolInvocation;
}

export function ToolCall({ toolInvocation }: ToolInvocationProps) {
  const toolCallId = toolInvocation.toolCallId;
  const isCall = toolInvocation.state === "call";

  return (
    <div className="mt-2 p-2 bg-gray-50 rounded text-sm border border-gray-200">
      <div className="flex items-center gap-2 font-mono text-xs text-gray-500">
        <span className={isCall ? "animate-spin" : ""}>
          {isCall ? "⚙️" : "✅"}
        </span>
        <span className="font-semibold">{toolInvocation.toolName}</span>
      </div>

      {/* Render the result if the tool has finished */}
      {!isCall && "result" in toolInvocation && (
        <div className="mt-1 text-xs text-gray-600 font-mono overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(toolInvocation.result, null, 2)}
        </div>
      )}
    </div>
  );
}
