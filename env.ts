import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  OPENAI_MODEL: z.string().min(1, "OPENAI_MODEL is required"),
  OPENAI_BASE_URL: z.string().url().optional(),
});

const parsed = envSchema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL ?? "gpt-4o",
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
});

export const env = {
  OPENAI_API_KEY: parsed.OPENAI_API_KEY,
  OPENAI_MODEL: parsed.OPENAI_MODEL,
  OPENAI_BASE_URL: parsed.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
};
