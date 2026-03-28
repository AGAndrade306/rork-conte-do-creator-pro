import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_TOOLKIT_URL: z.string().url().optional(),
});

const parsed = envSchema.parse({
  EXPO_PUBLIC_TOOLKIT_URL: process.env.EXPO_PUBLIC_TOOLKIT_URL,
});

export const env = {
  EXPO_PUBLIC_TOOLKIT_URL: parsed.EXPO_PUBLIC_TOOLKIT_URL ?? "https://toolkit.rork.com",
};
