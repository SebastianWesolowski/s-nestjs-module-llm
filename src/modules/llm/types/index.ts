// src/modules/llm/types/index.ts
import { createZodDto } from '@anatine/zod-nestjs';
import { DynamicModule, InjectionToken, OptionalFactoryDependency, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { z } from 'zod';

/**
 * Interfejsy konfiguracyjne dla modułu LLM.
 * Definiują strukturę opcji konfiguracyjnych dla modułu.
 */

/**
 * Interfejs opcji konfiguracyjnych dla modułu LLM.
 * Definiuje parametry, które można przekazać podczas inicjalizacji modułu.
 */
export interface LLMModuleOptions {
  /**
   * Klucz API OpenAI.
   * Jeśli nie podano, zostanie użyta wartość z zmiennej środowiskowej OPENAI_API_KEY.
   */
  apiKey?: string;

  /**
   * Czy zapisywać prompty i odpowiedzi do pliku.
   * Domyślnie: false
   */
  logPrompts?: boolean;

  /**
   * Ścieżka do pliku logów promptów.
   * Domyślnie: prompt.md w katalogu modułu
   */
  logPath?: string;

  /**
   * Domyślny model OpenAI do generowania tekstu.
   * Domyślnie: gpt-4o
   */
  defaultModel?: string;

  /**
   * Domyślny model Whisper do konwersji mowy na tekst.
   * Domyślnie: whisper-1
   */
  defaultWhisperModel?: string;
}

/**
 * Interfejs opcji asynchronicznej konfiguracji dla modułu LLM.
 * Używany przy konfiguracji modułu z asynchronicznymi źródłami konfiguracji.
 */
export interface LLMModuleAsyncOptions {
  /**
   * Funkcja fabryczna zwracająca opcje konfiguracyjne.
   * Może być asynchroniczna.
   */
  useFactory: (...args: any[]) => Promise<LLMModuleOptions> | LLMModuleOptions;

  /**
   * Tokeny zależności do wstrzyknięcia w funkcję fabryczną.
   */
  inject?: (InjectionToken | OptionalFactoryDependency)[];

  /**
   * Moduły do zaimportowania przed inicjalizacją modułu LLM.
   */
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule>)[];
}

// Config Schemas
export const LLMConfigSchema = z.strictObject({
  apiKey: z.string(),
  logPrompts: z.boolean().optional().default(false),
  logPath: z.string().optional(),
  defaultModel: z.string().optional(),
  defaultWhisperModel: z.string().optional(),
});

export type LLMConfigType = z.infer<typeof LLMConfigSchema>;

export const AsyncLLMConfigSchema = z.strictObject({
  useFactory: z
    .function()
    .args(z.any())
    .returns(z.union([z.promise(LLMConfigSchema), LLMConfigSchema])),
  inject: z.array(z.custom<InjectionToken>()).optional(),
  imports: z.array(z.union([z.custom<Type<unknown>>(), z.custom<DynamicModule>()])).optional(),
});

export type AsyncLLMConfigType = z.infer<typeof AsyncLLMConfigSchema>;

// Message Schema
export const MessageSchema = z.strictObject({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1),
});

export class MessageDto extends createZodDto(MessageSchema) {}
export type MessageType = z.infer<typeof MessageSchema>;

// Completion Schema
export const CompletionSchema = z.strictObject({
  messages: z.array(MessageSchema as unknown as z.ZodType<ChatCompletionMessageParam>).min(1),
  model: z.string().min(1).optional(),
  stream: z.boolean().optional(),
  jsonMode: z.boolean().optional(),
});

export class CompletionDto extends createZodDto(CompletionSchema) {}
export type CompletionType = z.infer<typeof CompletionSchema>;

// Chat Completion Response Schema
export const ChatCompletionResponseMessageSchema = z.strictObject({
  role: z.string(),
  content: z.string(),
});

export const ChatCompletionResponseSchema = z.strictObject({
  messages: z.array(ChatCompletionResponseMessageSchema).optional(),
  totalTokens: z.number().optional(),
  promptTokens: z.number().optional(),
  completionTokens: z.number().optional(),
  parsedContent: z.unknown().optional(),
  rawContent: z.string().optional(),
  fullResponse: z.unknown().optional(),
});

export type ChatCompletionResponseType<T = unknown> = z.infer<typeof ChatCompletionResponseSchema> & {
  parsedContent?: T;
};

export class ChatCompletionResponseDto extends createZodDto(ChatCompletionResponseSchema) {}

// Speech to Text Schema
export const ResponseFormatSchema = z.enum(['json', 'text', 'srt', 'verbose_json', 'vtt']);

export const SpeechToTextSchema = z.strictObject({
  file: z.any(),
  language: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  responseFormat: ResponseFormatSchema.optional(),
});

export type SpeechToTextType = z.infer<typeof SpeechToTextSchema>;

export class SpeechToTextDto {
  @ApiProperty({
    description: 'Plik audio do transkrypcji w formacie base64',
    example: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10...',
  })
  audio: string;

  @ApiProperty({
    description: 'Język audio (opcjonalny)',
    required: false,
    example: 'pl',
  })
  language?: string;

  @ApiProperty({
    description: 'Model Whisper do użycia (opcjonalny)',
    required: false,
    example: 'whisper-1',
  })
  model?: string;

  @ApiProperty({
    description: 'Prompt do pomocy w transkrypcji (opcjonalny)',
    required: false,
    example: 'Transkrypcja rozmowy o programowaniu',
  })
  prompt?: string;

  @ApiProperty({
    description: 'Format odpowiedzi (opcjonalny)',
    required: false,
    enum: ['json', 'text', 'srt', 'verbose_json', 'vtt'],
    default: 'json',
  })
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';

  @ApiProperty({
    description: 'Temperatura próbkowania (opcjonalna)',
    required: false,
    example: 0.7,
  })
  temperature?: string;
}
