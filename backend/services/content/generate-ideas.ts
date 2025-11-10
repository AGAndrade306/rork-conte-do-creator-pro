import { getAIService } from "../ai";
import { generateIdeasOutput, type GenerateIdeasInput } from "../../../schemas/content";

const SYSTEM_PROMPT = `
Você cria ideias de conteúdo curtas, com hooks fortes e outline prático.
Responda sempre em JSON puro.
`;

const USER_PROMPT_PREFIX = "Gere {ideas: [{title,hook,outline[],cta,platform,viralScore,references?}]}. INPUT:\n";

const extractJsonBlock = (text: string) => {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");

  if (first === -1 || last === -1 || last <= first) {
    throw new Error("Resposta da IA não contém JSON válido");
  }

  return text.slice(first, last + 1);
};

export async function generateIdeas(input: GenerateIdeasInput) {
  console.log("[Content] Generating ideas with input", JSON.stringify(input));

  try {
    const aiService = getAIService();

    const raw = await aiService.generateText({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `${USER_PROMPT_PREFIX}${JSON.stringify(input)}`,
        },
      ],
      temperature: 0.7,
      maxTokens: 2000,
    });

    const jsonBlock = extractJsonBlock(raw);
    const parsed = generateIdeasOutput.parse(JSON.parse(jsonBlock));
    console.log("[Content] Generated ideas count", parsed.ideas.length);
    return parsed;
  } catch (error) {
    console.error("[Content] Failed to generate ideas", error);
    throw new Error("Não foi possível gerar ideias de conteúdo no momento.");
  }
}
