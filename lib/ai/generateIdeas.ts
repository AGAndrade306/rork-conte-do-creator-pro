import { trpcClient } from "../trpc";
import {
  type GenerateIdeasInput,
  type GenerateIdeasOutput,
} from "../../schemas/content";

export async function generateIdeasWithRork(
  input: GenerateIdeasInput,
): Promise<GenerateIdeasOutput> {
  console.log("[AI] Generating ideas via backend", JSON.stringify(input));

  try {
    const result = await trpcClient.content.generateIdeas.mutate(input);
    console.log("[AI] Generated ideas count", result.ideas.length);
    return result;
  } catch (error) {
    console.error("[AI] Failed to generate ideas", error);
    throw new Error("Não foi possível gerar ideias de conteúdo no momento.");
  }
}
