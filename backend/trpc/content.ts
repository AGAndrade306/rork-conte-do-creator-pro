import { createTRPCRouter, publicProcedure } from "./create-context";
import { generateIdeasInput } from "../../schemas/content";
import { generateIdeas } from "../services/content/generate-ideas";

export const contentRouter = createTRPCRouter({
  generateIdeas: publicProcedure
    .input(generateIdeasInput)
    .mutation(async ({ input }) => {
      return generateIdeas(input);
    }),
});
