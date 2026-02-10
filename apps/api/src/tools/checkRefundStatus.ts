import { tool } from "ai";
import { prisma } from "../lib/db";
import { z } from "zod";

const parameters = z.object({
  orderNumber: z
    .string()
    .describe("The order number to check the refund status for."),
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
      },
    });

    if (!order) {
      return `No order found with order number: ${orderNumber}`;
    }

    switch (order.status) {
      case "REFUNDED":
        return `Order ${order.orderNumber} has been successfully refunded.`;
      case "CANCELLED":
        return `Order ${order.orderNumber} was cancelled. If a payment was made, a refund is typically processed automatically.`;
      case "PENDING":
      case "SHIPPED":
      case "DELIVERED":
        return `Order ${order.orderNumber} is not marked as refunded. Its current status is: ${order.status}.`;
      default:
        return `Order ${order.orderNumber} has an unknown status: ${order.status}.`;
    }
  } catch (error) {
    console.error("Failed to check refund status:", error);
    return "An error occurred while trying to check the refund status.";
  }
}

export const checkRefundStatusTool = tool({
  description: "Checks the refund status of a specific order by its order number.",
  parameters,
  execute,
});
