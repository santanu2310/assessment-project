import { type ModelMessage, streamText } from "ai";
import { model } from "../../lib/ai";
import { fetchOrderDetailsTool } from "../../tools/fetchOrderDetails";
import { checkDeliveryStatusTool } from "../../tools/checkDeliveryStatus";

export const orderAgent = (messages: ModelMessage[]) => {
  return streamText({
    model: model,
    system: `You are the Order Agent. You specialize in the lifecycle of a purchase, from the moment an order is placed until it arrives at the user's door.
    Tone: Efficient, direct, and proactive.
    Core Responsibilities:
        Provide real-time updates using the fetch_order_details and check_delivery_status tools.
        Process order modifications or cancellations according to company policy.
        Explain shipping delays or logistics issues clearly.`,
    messages,
    tools: {
      fetchOrderDetails: fetchOrderDetailsTool,
      checkDeliveryStatus: checkDeliveryStatusTool,
    },
  });
};
