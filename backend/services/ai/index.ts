import type { AIService } from './types';
import { RorkAIProvider } from './rork-provider';
import { AI_CONFIG } from './config';

let aiService: AIService | null = null;

export function getAIService(): AIService {
  if (aiService) {
    return aiService;
  }

  console.log(`[AI Service] Initializing provider: ${AI_CONFIG.provider}`);
  aiService = new RorkAIProvider();

  return aiService;
}

export * from './types';
