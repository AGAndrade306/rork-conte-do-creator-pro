import { z } from "zod";

export const generateIdeasInput = z.object({
  niche: z.string().min(2),
  branding: z
    .object({
      voice: z.string().optional(),
      values: z.array(z.string()).optional(),
      colors: z.array(z.string()).optional(),
    })
    .default({}),
  platforms: z
    .array(z.enum(["tiktok", "instagram", "youtube", "reels", "shorts"]))
    .default(["tiktok", "reels"]),
  count: z.number().int().min(1).max(20).default(5),
});

export type GenerateIdeasInput = z.infer<typeof generateIdeasInput>;

export const generateIdeasOutput = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      hook: z.string(),
      outline: z.array(z.string()),
      cta: z.string(),
      platform: z.string(),
      viralScore: z.number().min(0).max(100),
      references: z.array(z.string()).optional(),
    })
  ),
});

export type GenerateIdeasOutput = z.infer<typeof generateIdeasOutput>;
