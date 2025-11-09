/**
 * CONFIGURAÇÃO DE PROVEDOR DE IA
 * 
 * Para trocar entre Rork e OpenAI:
 * 
 * 1. Crie um arquivo .env na raiz do projeto
 * 2. Adicione: AI_PROVIDER=openai (ou rork)
 * 3. Para OpenAI, adicione também: OPENAI_API_KEY=sk-proj-...
 * 4. Reinicie o servidor
 * 
 * Exemplo .env:
 * ```
 * AI_PROVIDER=openai
 * OPENAI_API_KEY=sk-proj-xxxxxxxxxx
 * OPENAI_MODEL=gpt-4o
 * ```
 * 
 * Ou edite diretamente abaixo trocando 'rork' por 'openai'
 */

export type AIProvider = 'rork' | 'openai';

export const AI_CONFIG = {
  provider: (process.env.AI_PROVIDER || 'rork') as AIProvider,
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
  },
  rork: {
    baseUrl: process.env.EXPO_PUBLIC_TOOLKIT_URL || 'https://toolkit.rork.com',
  },
} as const;
