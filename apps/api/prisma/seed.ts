import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // Use upsert to prevent creating duplicate data on subsequent seeds
  const conversation = await prisma.conversation.upsert({
    where: { id: "seed-conversation-123" }, // Use a fixed ID for idempotency
    update: {},
    create: {
      id: "seed-conversation-123",
      messages: {
        create: [
          {
            role: "assistant",
            content:
              "Hello! I am your AI assistant. How can I help you with your orders or billing today?",
            agentType: "SUPPORT",
          },
        ],
      },
    },
  });

  await prisma.order.upsert({
    where: { orderNumber: "ORD-1001" },
    update: {},
    create: {
      orderNumber: "ORD-1001",
      customerEmail: "santanu@example.com",
      status: "DELIVERED",
      totalAmount: 150.5,
      items: "Mechanical Keyboard, USB-C Cable",
      trackingId: "TRK998877",
    },
  });

  await prisma.order.upsert({
    where: { orderNumber: "ORD-1002" },
    update: {},
    create: {
      orderNumber: "ORD-1002",
      customerEmail: "santanu@example.com",
      status: "SHIPPED",
      totalAmount: 45.0,
      items: "Gaming Mouse Pad",
      trackingId: "TRK112233",
    },
  });

  await prisma.invoice.upsert({
    where: { invoiceNumber: "INV-2024-001" },
    update: {},
    create: {
      invoiceNumber: "INV-2024-001",
      customerEmail: "santanu@example.com",
      amount: 150.5,
      status: "PAID",
      dueDate: new Date("2024-12-01"),
    },
  });

  await prisma.invoice.upsert({
    where: { invoiceNumber: "INV-2024-002" },
    update: {},
    create: {
      invoiceNumber: "INV-2024-002",
      customerEmail: "santanu@example.com",
      amount: 45.0,
      status: "UNPAID",
      dueDate: new Date("2026-03-01"),
    },
  });

  console.log({
    message: "✅ Seeding finished successfully",
    conversationId: conversation.id,
    testEmail: "santanu@example.com",
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

