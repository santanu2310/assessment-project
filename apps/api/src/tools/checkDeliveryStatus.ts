import { tool } from "ai";
import { prisma } from "../lib/db";
import { z } from "zod";

const parameters = z.object({
  orderNumber: z
    .string()
    .describe("The order number to check the delivery status for."),
});

async function execute({
  orderNumber,
}: z.infer<typeof parameters>): Promise<string> {
  try {
    const order = await prisma.order.findUnique({
      where: {
        orderNumber,
      },
      select: {
        status: true,
        orderNumber: true,
        trackingId: true,
      },
    });

    console.log("order details by tool  :", order);

    if (!order) {
      return `No order found with order number: ${orderNumber}`;
    }

    switch (order.status) {
      case "DELIVERED":
        return `Order ${order.orderNumber} has been successfully delivered.`;
      case "SHIPPED":
        const trackingInfo = order.trackingId
          ? `The tracking ID is ${order.trackingId}.`
          : "A tracking ID is not yet available.";
        return `Order ${order.orderNumber} has been shipped. ${trackingInfo}`;
      case "PENDING":
        return `Order ${order.orderNumber} is still pending and has not been shipped yet.`;
      case "CANCELLED":
        return `Order ${order.orderNumber} was cancelled and will not be delivered.`;
      case "REFUNDED":
        return `Order ${order.orderNumber} was refunded and will not be delivered.`;
      default:
        return `Order ${order.orderNumber} has an unknown status: ${order.status}.`;
    }
  } catch (error) {
    console.error("Failed to check delivery status:", error);
    return "An error occurred while trying to check the delivery status.";
  }
}

export const checkDeliveryStatusTool = tool({
  description:
    "Checks the delivery status and tracking information for a specific order.",
  parameters,
  execute,
});
