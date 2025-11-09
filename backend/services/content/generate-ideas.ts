import { z } from 'zod';
import { getAIService } from '../ai';

export const ideaSchema = z.object({
  title: z.string(),
  hook: z.string(),
  script: z.string(),
  cta: z.string(),
});

export const generateIdeasInputSchema = z.object({
  niche: z.string().min(1),
  branding: z.string().optional(),
  purpose: z.string().optional(),
  quantity: z.number().int().min(1).max(15),
});

export type GenerateIdeasInput = z.infer<typeof generateIdeasInputSchema>;
export type GeneratedIdea = z.infer<typeof ideaSchema>;

export async function generateContentIdeas(
  input: GenerateIdeasInput,
): Promise<GeneratedIdea[]> {
  const ai = getAIService();

  const prompt = `Você é um especialista em criação de conteúdo viral para redes sociais.

Gere EXATAMENTE ${input.quantity} ideias de conteúdo para o seguinte nicho: ${input.niche}
${input.branding ? `Características do branding: ${input.branding}` : ''}
${input.purpose ? `Propósito do conteúdo: ${input.purpose}` : ''}

Para cada ideia, forneça:
1. Título atrativo
2. Hook inicial (primeira frase/cena)
3. Roteiro completo (estrutura do vídeo)
4. CTA final

Responda APENAS com um array JSON válido. Formato:
[
  {
    "title": "título aqui",
    "hook": "hook aqui",
    "script": "roteiro completo aqui",
    "cta": "call to action aqui"
  }
]`;

  const result = await ai.generateText({
    messages: [
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    maxTokens: 4096,
  });

  let text = result.trim();
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

  const arrayStartIndex = text.indexOf('[');
  const arrayEndIndex = text.lastIndexOf(']');

  if (arrayStartIndex === -1 || arrayEndIndex === -1) {
    throw new Error('Could not find JSON array in response');
  }

  text = text.substring(arrayStartIndex, arrayEndIndex + 1);

  const ideas = z.array(ideaSchema).parse(JSON.parse(text));

  return ideas;
}
