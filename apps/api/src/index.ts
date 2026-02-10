import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import agents from "./controllers/agents";

const app = new Hono().basePath("/api");

app.use("*", cors());

app.notFound((c) => {
  return c.text("My 404 Message", 404);
});
const routes = app.route("/agents", agents);

export default app;
export type AppType = typeof routes;
