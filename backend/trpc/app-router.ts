import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import generateIdeasRoute from "./routes/content/generate-ideas/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  content: createTRPCRouter({
    generateIdeas: generateIdeasRoute,
  }),
});

export type AppRouter = typeof appRouter;
