import { generateObject } from "@rork-ai/toolkit-sdk";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./create-context";
import { generateIdeasInput } from "../../schemas/content";
import { TRPCError } from "@trpc/server";

export const contentRouter = createTRPCRouter({
  generateIdeas: publicProcedure
    .input(generateIdeasInput)
    .mutation(async ({ input }) => {
      try {
        console.log('[contentRouter] Starting idea generation');

        const promptParts = [
          `Você é uma estrategista de conteúdo especializada em criar ideias virais para redes sociais.`,
          ``,
          `CONTEXTO:`,
          `- Nicho: ${input.niche}`,
          `- Plataformas: ${input.platforms.join(', ')}`,
          `- Quantidade de ideias: ${input.count}`,
        ];

        if (input.branding?.voice) {
          promptParts.push(`- Tom de voz: ${input.branding.voice}`);
        }

        if (input.branding?.values && input.branding.values.length > 0) {
          promptParts.push(`- Valores: ${input.branding.values.join(', ')}`);
        }

        if (input.inspirationUrl) {
          promptParts.push(`- URL de inspiração: ${input.inspirationUrl}`);
          promptParts.push(`  (Use esta URL como referência para estilo e formato)`);
        }

        promptParts.push(
          ``,
          `TAREFA:`,
          `Crie ${input.count} ideias de conteúdo viral com:`,
          `1. Título magnético e chamativo`,
          `2. Hook forte para prender atenção nos primeiros 3 segundos`,
          `3. Outline com 3-4 pontos principais do roteiro (cada ponto deve ser uma string completa)`,
          `4. CTA (Call-to-Action) específico e claro`,
          `5. Score viral de 0-100 baseado no potencial de viralização`,
        );

        const prompt = promptParts.join('\n');
        console.log('[contentRouter] Prompt prepared, calling AI');

        const ideaSchema = z.object({
          title: z.string().describe('Título magnético da ideia de conteúdo'),
          hook: z.string().describe('Hook inicial impactante para prender atenção'),
          outline: z.array(z.string()).describe('Lista de 3-4 pontos principais do roteiro'),
          cta: z.string().describe('Call to action específico'),
          platform: z.string().describe('Plataforma alvo (tiktok, reels, etc)'),
          viralScore: z.number().min(0).max(100).describe('Score de potencial viral de 0 a 100'),
        });

        const responseSchema = z.object({
          ideas: z.array(ideaSchema),
        });

        const result = await generateObject({
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          schema: responseSchema,
        });

        console.log('[contentRouter] AI response received, ideas:', result.ideas.length);

        if (!result.ideas || result.ideas.length === 0) {
          throw new Error('Nenhuma ideia foi gerada');
        }

        return { ideas: result.ideas };
      } catch (error) {
        console.error('[contentRouter] Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Não foi possível gerar ideias. Tente novamente.',
          cause: error,
        });
      }
    }),
});
