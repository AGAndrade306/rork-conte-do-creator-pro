import { generateText } from '@rork-ai/toolkit-sdk';
import type { AIService, GenerateTextParams, GenerateObjectParams } from './types';

export class RorkAIProvider implements AIService {
  async generateText(params: GenerateTextParams): Promise<string> {
    console.log('[RorkAI] Generating text with', params.messages.length, 'messages');

    try {
      const result = await generateText({
        messages: params.messages,
      });

      console.log('[RorkAI] Generated text length:', result.length);
      return result;
    } catch (error) {
      console.error('[RorkAI] Error generating text:', error);
      throw new Error('Falha ao gerar texto com IA');
    }
  }

  async generateObject<T>(params: GenerateObjectParams<T>): Promise<T> {
    console.log('[RorkAI] Generating object with', params.messages.length, 'messages');

    try {
      const promptMessages = params.messages.map(m => {
        if (m.role === 'system') {
          return m.content;
        }
        if (m.role === 'user') {
          return m.content;
        }
        return '';
      }).filter(Boolean);

      const fullPrompt = [
        ...promptMessages,
        '',
        'IMPORTANTE: Responda APENAS com JSON válido, sem texto adicional.',
        'O JSON deve seguir exatamente a estrutura solicitada.',
      ].join('\n\n');

      const textResult = await generateText({
        messages: [
          {
            role: 'user',
            content: fullPrompt,
          },
        ],
      });

      console.log('[RorkAI] Raw response:', textResult.substring(0, 200));

      let cleanedText = textResult.trim();
      
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(cleanedText);
      console.log('[RorkAI] Successfully parsed object');
      return parsed as T;
    } catch (error) {
      console.error('[RorkAI] Error generating object:', error);
      if (error instanceof SyntaxError) {
        throw new Error('Resposta da IA não está em formato JSON válido');
      }
      throw new Error('Falha ao gerar objeto com IA');
    }
  }
}
