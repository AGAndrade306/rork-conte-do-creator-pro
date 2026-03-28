import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { contentRouter } from "./content";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  content: contentRouter,
});

export type AppRouter = typeof appRouter;
