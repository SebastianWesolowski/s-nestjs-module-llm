import { ChatCompletion } from 'openai/resources/chat/completions';

export interface ChatCompletionResponse<T = unknown> {
  parsedContent?: T;
  rawContent?: string;
  fullResponse?: ChatCompletion;
}
