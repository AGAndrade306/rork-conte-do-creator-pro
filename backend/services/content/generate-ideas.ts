import { getAIService } from "../ai";
import type {
  GenerateIdeasInput,
  GenerateIdeasOutput,
} from "../../../schemas/content";

const buildPrompt = (input: GenerateIdeasInput) => {
  const parts = [
    `Você é uma estrategista de conteúdo especializada em criar ideias virais para redes sociais.`,
    ``,
    `CONTEXTO:`,
    `- Nicho: ${input.niche}`,
    `- Plataformas: ${input.platforms.join(', ')}`,
    `- Quantidade de ideias: ${input.count}`,
  ];

  if (input.branding?.voice) {
    parts.push(`- Tom de voz: ${input.branding.voice}`);
  }

  if (input.branding?.values && input.branding.values.length > 0) {
    parts.push(`- Valores: ${input.branding.values.join(', ')}`);
  }

  if (input.inspirationUrl) {
    parts.push(`- URL de inspiração: ${input.inspirationUrl}`);
  }

  parts.push(
    ``,
    `TAREFA:`,
    `Crie ${input.count} ideias de conteúdo viral com:`,
    `1. Título magnético e chamativo`,
    `2. Hook forte para prender atenção nos primeiros 3 segundos`,
    `3. Outline com 3-4 pontos principais do roteiro`,
    `4. CTA (Call-to-Action) específico e claro`,
    `5. Score viral de 0-100 baseado no potencial de viralização`,
    ``,
    `IMPORTANTE: Responda APENAS com um objeto JSON válido seguindo este formato:`,
    `{`,
    `  "ideas": [`,
    `    {`,
    `      "title": "Título da ideia",`,
    `      "hook": "Gancho inicial impactante",`,
    `      "outline": ["Ponto 1", "Ponto 2", "Ponto 3"],`,
    `      "cta": "Call to action específico",`,
    `      "platform": "tiktok",`,
    `      "viralScore": 85`,
    `    }`,
    `  ]`,
    `}`,
    ``,
    `Não inclua texto adicional, apenas o JSON.`,
  );

  return parts.join('\n');
};

export async function generateIdeas(
  input: GenerateIdeasInput,
): Promise<GenerateIdeasOutput> {
  console.log("[Content] Generating ideas with input", JSON.stringify(input));

  try {
    const aiService = getAIService();
    const prompt = buildPrompt(input);

    console.log("[Content] Using prompt:", prompt.substring(0, 300));

    const result = await aiService.generateObject<GenerateIdeasOutput>({
      messages: [
        { role: "user", content: prompt },
      ],
      schema: {} as any,
      temperature: 0.7,
      maxTokens: 2000,
    });

    if (!result.ideas || !Array.isArray(result.ideas) || result.ideas.length === 0) {
      throw new Error('IA retornou formato inválido');
    }

    console.log("[Content] Generated", result.ideas.length, "ideas successfully");
    return result;
  } catch (error) {
    console.error("[Content] Failed to generate ideas:", error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(`Não foi possível gerar ideias: ${message}`);
  }
}
