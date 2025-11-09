import { generateObject } from "@rork-ai/toolkit-sdk";
import { env } from "../../env";
import {
  generateIdeasOutput,
  type GenerateIdeasInput,
  type GenerateIdeasOutput,
} from "../../schemas/content";

const systemPrompt = `
Você cria ideias de conteúdo curtas, com hooks fortes e outline prático.
Responda sempre em JSON puro.
`;

export async function generateIdeasWithRork(
  input: GenerateIdeasInput,
): Promise<GenerateIdeasOutput> {
  console.log("[AI] Generating ideas with input", JSON.stringify(input));

  try {
    const result = await generateObject({
      baseUrl: env.EXPO_PUBLIC_TOOLKIT_URL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Gere {ideas: [{title,hook,outline[],cta,platform,viralScore,references?}]}. INPUT:\n${JSON.stringify(
            input,
          )}`,
        },
      ],
      schema: generateIdeasOutput,
      temperature: 0.7,
    });

    const parsed = generateIdeasOutput.parse(result);
    console.log("[AI] Generated ideas count", parsed.ideas.length);
    return parsed;
  } catch (error) {
    console.error("[AI] Failed to generate ideas", error);
    throw new Error("Não foi possível gerar ideias de conteúdo no momento.");
  }
}
