import { getAIService } from "../ai";
import {
  generateIdeasOutput,
  type GenerateIdeasInput,
  type GenerateIdeasOutput,
} from "../../../schemas/content";

const SYSTEM_PROMPT = `
Você é uma estrategista de conteúdo que gera ideias curtas, criativas e viralizáveis.
Mantenha cada resposta em JSON puro compatível com o schema fornecido.
Inclua outlines objetivos com no máximo 4 passos e CTA claro.
Quando houver URL de inspiração, extraia padrões e referências coerentes.
`;

const buildUserPrompt = (input: GenerateIdeasInput) => {
  const base: Record<string, unknown> = {
    niche: input.niche,
    branding: input.branding,
    platforms: input.platforms,
    inspirationUrl: input.inspirationUrl ?? null,
    count: input.count,
  };

  return [
    "Crie ideias de conteúdo compatíveis com o seguinte contexto:",
    JSON.stringify(base, null, 2),
    "Use títulos magnéticos, hook atrativo e CTA específico.",
    "Score viral deve ser número de 0 a 100.",
    "Quando relevante, preencha references com insights específicos da URL.",
  ].join("\n\n");
};

export async function generateIdeas(
  input: GenerateIdeasInput,
): Promise<GenerateIdeasOutput> {
  console.log("[Content] Generating ideas with input", JSON.stringify(input));

  try {
    const aiService = getAIService();

    const result = await aiService.generateObject({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(input) },
      ],
      schema: generateIdeasOutput,
      temperature: 0.6,
      maxTokens: 1600,
    });

    console.log("[Content] Generated ideas count", result.ideas.length);
    return result;
  } catch (error) {
    console.error("[Content] Failed to generate ideas", error);
    throw new Error("Não foi possível gerar ideias de conteúdo no momento.");
  }
}
