import { createMiddleware } from "hono/factory";

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export const rateLimiter = (limit: number, windowMs: number) => {
  return createMiddleware(async (c, next) => {
    const ip = c.req.header("x-forwarded-for") || "unknown";
    const now = Date.now();

    // Retrieve or initialize record
    let record = rateLimitMap.get(ip);
    if (!record) {
      record = { count: 0, lastReset: now };
      rateLimitMap.set(ip, record);
    }

    // Reset window if time has passed
    if (now - record.lastReset > windowMs) {
      record.count = 0;
      record.lastReset = now;
    }

    // Check limit
    if (record.count >= limit) {
      return c.text("Too Many Requests", 429);
    }

    // Increment and proceed
    record.count++;
    await next();
  });
};
