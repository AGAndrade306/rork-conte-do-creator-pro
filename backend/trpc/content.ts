import { createTRPCRouter, publicProcedure } from "./create-context";
import { generateIdeasInput } from "../../schemas/content";
import { generateIdeas } from "../services/content/generate-ideas";
import { TRPCError } from "@trpc/server";

export const contentRouter = createTRPCRouter({
  generateIdeas: publicProcedure
    .input(generateIdeasInput)
    .mutation(async ({ input }) => {
      try {
        console.log('[contentRouter] Received generateIdeas request');
        const result = await generateIdeas(input);
        console.log('[contentRouter] Successfully generated ideas');
        return result;
      } catch (error) {
        console.error('[contentRouter] Error in generateIdeas:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao gerar ideias',
          cause: error,
        });
      }
    }),
});
