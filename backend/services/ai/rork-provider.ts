import { generateText, generateObject } from '@rork/toolkit-sdk';
import type { AIService, GenerateTextParams, GenerateObjectParams } from './types';

export class RorkAIProvider implements AIService {
  async generateText(params: GenerateTextParams): Promise<string> {
    console.log('[RorkAI] Generating text with', params.messages.length, 'messages');
    
    const result = await generateText({
      messages: params.messages,
    });

    console.log('[RorkAI] Generated text length:', result.length);
    return result;
  }

  async generateObject<T>(params: GenerateObjectParams<T>): Promise<T> {
    console.log('[RorkAI] Generating object with', params.messages.length, 'messages');
    
    const result = await generateObject({
      messages: params.messages,
      schema: params.schema as any,
    });

    console.log('[RorkAI] Generated object:', result);
    return result as T;
  }
}
