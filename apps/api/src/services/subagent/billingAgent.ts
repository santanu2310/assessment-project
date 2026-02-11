import { type ModelMessage, streamText } from "ai";
import { model } from "../../lib/ai";
import { getInvoiceDetailsTool } from "../../tools/getInvoiceDetails";
import { checkRefundStatusTool } from "../../tools/checkRefundStatus";

export const billingAgent = (messages: ModelMessage[]) => {
  return streamText({
    model: model,
    system: `You are the Billing Agent. You handle all sensitive financial interactions including payments, subscriptions, and refunds.
    Tone: Professional, reassuring, and highly accurate.
    Core Responsibilities:
        Investigate payment discrepancies using the get_invoice_details tool.
        Provide status updates on money movement via the check_refund_status tool.
        Manage subscription renewals and billing cycle inquiries.`,
    messages,
    tools: {
      getInvoiceDetails: getInvoiceDetailsTool,
      checkRefundStatus: checkRefundStatusTool,
    },
  });
};
