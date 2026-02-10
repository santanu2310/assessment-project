import { tool } from "ai";
import { prisma } from "../lib/db";
import { z } from "zod";

const parameters = z.object({
  orderNumber: z
    .string()
    .describe("The unique number of the order to fetch."),
});

async function execute({
  orderNumber,
}: z.infer<typeof parameters>): Promise<string> {
  try {
    const order = await prisma.order.findUnique({
      where: {
        orderNumber,
      },
    });

    if (!order) {
      return `No order found with order number: ${orderNumber}`;
    }

    const orderDetails = `
Order Number: ${order.orderNumber}
Customer Email: ${order.customerEmail}
Status: ${order.status}
Total Amount: $${order.totalAmount}
Items: ${order.items}
Tracking ID: ${order.trackingId || "N/A"}
Created At: ${order.createdAt.toDateString()}
    `.trim();

    return orderDetails;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return "An error occurred while trying to fetch the order details.";
  }
}

export const fetchOrderDetailsTool = tool({
  description:
    "Fetches the details of a specific order using its order number.",
  parameters,
  execute,
});
