import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { generateIdeas } from "./services/content/generate-ideas";
import { generateIdeasInput } from "../schemas/content";

const app = new Hono();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

app.use("*", async (c, next) => {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    c.header(key, value);
  });
  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }
  await next();
});

app.use(
  "/api/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

app.post("/api/content/generate", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = generateIdeasInput.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.format() }, 400);
    }

    const output = await generateIdeas(parsed.data);
    return c.json(output, 200);
  } catch (error) {
    console.error("[HTTP] Failed to generate ideas", error);
    return c.json({ error: "Failed to generate ideas" }, 500);
  }
});

export default app;
