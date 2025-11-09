import { env } from "../../../env";
import { generateIdeasOutput, type GenerateIdeasInput } from "../../../schemas/content";

const baseUrl = `${env.OPENAI_BASE_URL.replace(/\/$/, "")}/chat/completions`;

export async function generateIdeas(input: GenerateIdeasInput) {
  const system = `
Você cria ideias de conteúdo curtas, com hooks fortes e outline prático.
Responda sempre em JSON puro.
  `;

  const user = JSON.stringify(input);

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      temperature: 0.7,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Gere {ideas: [{title,hook,outline[],cta,platform,viralScore}]}. INPUT:\n${user}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const completion = await response.json();
  const raw = completion.choices?.[0]?.message?.content ?? "{}";
  const first = raw.indexOf("{");
  const last = raw.lastIndexOf("}");

  if (first === -1 || last === -1) {
    throw new Error("Invalid JSON response");
  }

  const json = JSON.parse(raw.slice(first, last + 1));

  return generateIdeasOutput.parse(json);
}
