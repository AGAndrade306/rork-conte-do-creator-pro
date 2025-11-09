import type { AIService } from './types';
import { RorkAIProvider } from './rork-provider';
import { OpenAIProvider } from './openai-provider';
import { AI_CONFIG } from './config';

let aiService: AIService | null = null;

export function getAIService(): AIService {
  if (aiService) {
    return aiService;
  }

  console.log(`[AI Service] Initializing provider: ${AI_CONFIG.provider}`);

  switch (AI_CONFIG.provider) {
    case 'openai':
      aiService = new OpenAIProvider();
      break;
    case 'rork':
    default:
      aiService = new RorkAIProvider();
      break;
  }

  return aiService;
}

export * from './types';
export * from './config';
