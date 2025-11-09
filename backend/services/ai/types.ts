export type TextPart = { type: 'text'; text: string };
export type ImagePart = { type: 'image'; image: string };
export type UserMessage = { role: 'user'; content: string | (TextPart | ImagePart)[] };
export type AssistantMessage = { role: 'assistant'; content: string | TextPart[] };
export type AIMessage = UserMessage | AssistantMessage;

export interface GenerateTextParams {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface GenerateObjectParams<T> {
  messages: AIMessage[];
  schema: T;
  temperature?: number;
  maxTokens?: number;
}

export interface AIService {
  generateText(params: GenerateTextParams): Promise<string>;
  generateObject<T>(params: GenerateObjectParams<T>): Promise<T>;
}
