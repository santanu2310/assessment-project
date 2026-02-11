import { tool } from "ai";
import { prisma } from "../lib/db";
import { z } from "zod";

const parameters = z.object({
  invoiceNumber: z
    .string()
    .describe("The unique number of the invoice to fetch."),
});

async function execute({
  invoiceNumber,
}: z.infer<typeof parameters>): Promise<string> {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: {
        invoiceNumber,
      },
    });

    if (!invoice) {
      return `No invoice found with invoice number: ${invoiceNumber}`;
    }

    const invoiceDetails = `
Invoice Number: ${invoice.invoiceNumber}
Customer Email: ${invoice.customerEmail}
Status: ${invoice.status}
Amount: $${invoice.amount}
Due Date: ${invoice.dueDate.toDateString()}
Created At: ${invoice.createdAt.toDateString()}
    `.trim();

    return invoiceDetails;
  } catch (error) {
    console.error("Failed to fetch invoice details:", error);
    return "An error occurred while trying to fetch the invoice details.";
  }
}

export const getInvoiceDetailsTool = tool({
  description:
    "Fetches the details of a specific invoice using its invoice number.",
  parameters,
  execute,
});
