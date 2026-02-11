import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import agents from "./controllers/agents";
import chat from "./controllers/chat";
import { rateLimiter } from "./middleware/rateLimiter";

const app = new Hono().basePath("/api");

app.use("*", cors());
app.use("*", logger());
app.use("*", rateLimiter(50, 60 * 1000));

app.notFound((c) => {
  return c.text("My 404 Message", 404);
});

const routes = app.route("/agents", agents).route("/chat", chat);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;

export type AppType = typeof routes;
