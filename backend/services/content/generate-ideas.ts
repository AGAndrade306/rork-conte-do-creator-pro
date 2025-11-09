import { getAIService } from "../ai";
import { generateIdeasOutput, type GenerateIdeasInput } from "../../../schemas/content";

export async function generateIdeas(input: GenerateIdeasInput) {
  console.log("[Content] Generating ideas with input", JSON.stringify(input));

  const system = `
Você cria ideias de conteúdo curtas, com hooks fortes e outline prático.
Responda sempre em JSON puro.
  `;

  const user = JSON.stringify(input);

  try {
    const aiService = getAIService();

    const result = await aiService.generateObject({
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Gere {ideas: [{title,hook,outline[],cta,platform,viralScore}]}. INPUT:\n${user}`,
        },
      ],
      schema: generateIdeasOutput,
      temperature: 0.7,
    });

    const parsed = generateIdeasOutput.parse(result);
    console.log("[Content] Generated ideas count", parsed.ideas.length);
    return parsed;
  } catch (error) {
    console.error("[Content] Failed to generate ideas", error);
    throw new Error("Não foi possível gerar ideias de conteúdo no momento.");
  }
}
