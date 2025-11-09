/**
 * CONFIGURAÇÃO DE PROVEDOR DE IA
 *
 * O Rork já fornece um provedor nativo pronto para produção.
 * A URL-base pode ser customizada via EXPO_PUBLIC_TOOLKIT_URL.
 */

export const AI_CONFIG = {
  provider: 'rork' as const,
  rork: {
    baseUrl: process.env.EXPO_PUBLIC_TOOLKIT_URL || 'https://toolkit.rork.com',
  },
} as const;
