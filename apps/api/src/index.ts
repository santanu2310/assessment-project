import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import agents from "./controllers/agents";
import chat from "./controllers/chat";

const app = new Hono().basePath("/api");

app.use("*", cors());
app.use("*", logger());

console.log("Server is ready! Waiting for requests...");

app.notFound((c) => {
  return c.text("My 404 Message", 404);
});

const routes = app.route("/agents", agents).route("/chat", chat);

export default app;
export type AppType = typeof routes;
