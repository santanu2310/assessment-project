import { Hono } from "hono";

const agents = new Hono();

agents.get("/", (c) => {
  const agentData = [
    {
      name: "Support",
      description: "Handles customer support inquiries and technical issues.",
    },
    {
      name: "Order",
      description: "Manages order processing, tracking, and fulfillment.",
    },
    {
      name: "Billing",
      description:
        "Deals with billing, invoices, and payment-related questions.",
    },
  ];
  return c.json(agentData);
});

export default agents;

