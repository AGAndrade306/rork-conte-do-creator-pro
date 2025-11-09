import { generateText, generateObject } from '@rork-ai/toolkit-sdk';
import type { AIService, GenerateTextParams, GenerateObjectParams } from './types';
import { AI_CONFIG } from './config';

const baseUrl = AI_CONFIG.rork.baseUrl;

export class RorkAIProvider implements AIService {
  async generateText(params: GenerateTextParams): Promise<string> {
    console.log('[RorkAI] Generating text with', params.messages.length, 'messages');

    const result = await generateText({
      messages: params.messages,
      ...(params.temperature !== undefined ? { temperature: params.temperature } : {}),
      ...(params.maxTokens !== undefined ? { maxOutputTokens: params.maxTokens } : {}),
      baseUrl,
    });

    console.log('[RorkAI] Generated text length:', result.length);
    return result;
  }

  async generateObject<T>(params: GenerateObjectParams<T>): Promise<T> {
    console.log('[RorkAI] Generating object with', params.messages.length, 'messages');

    const result = await generateObject({
      messages: params.messages,
      schema: params.schema as any,
      ...(params.temperature !== undefined ? { temperature: params.temperature } : {}),
      ...(params.maxTokens !== undefined ? { maxOutputTokens: params.maxTokens } : {}),
      baseUrl,
    });

    console.log('[RorkAI] Generated object:', result);
    return result as T;
  }
}
