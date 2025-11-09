import type { AIService, GenerateTextParams, GenerateObjectParams, AIMessage } from './types';
import { AI_CONFIG } from './config';

export class OpenAIProvider implements AIService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = AI_CONFIG.openai.apiKey;
    this.baseUrl = AI_CONFIG.openai.baseUrl;
    this.model = AI_CONFIG.openai.model;

    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required for OpenAI provider');
    }
  }

  private convertMessages(messages: AIMessage[]) {
    return messages.map(msg => {
      if (typeof msg.content === 'string') {
        return {
          role: msg.role,
          content: msg.content,
        };
      }
      
      return {
        role: msg.role,
        content: msg.content.map(part => {
          if (part.type === 'text') {
            return { type: 'text', text: part.text };
          }
          return {
            type: 'image_url',
            image_url: { url: part.image },
          };
        }),
      };
    });
  }

  async generateText(params: GenerateTextParams): Promise<string> {
    console.log('[OpenAI] Generating text with', params.messages.length, 'messages');
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: this.convertMessages(params.messages),
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[OpenAI] Error:', error);
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content || '';
    
    console.log('[OpenAI] Generated text length:', result.length);
    return result;
  }

  async generateObject<T>(params: GenerateObjectParams<T>): Promise<T> {
    console.log('[OpenAI] Generating structured output with', params.messages.length, 'messages');
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: this.convertMessages(params.messages),
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 4096,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[OpenAI] Error:', error);
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';
    const result = JSON.parse(content);
    
    console.log('[OpenAI] Generated object:', result);
    return result as T;
  }
}
