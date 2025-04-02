# Interfejsy i typy

Moduł LLM eksportuje szereg interfejsów i typów, które ułatwiają pracę z typami w TypeScript.

## Konfiguracja

### LLMModuleOptions

Interfejs opisujący opcje konfiguracyjne dla modułu LLM:

```typescript
export interface LLMModuleOptions {
  apiKey?: string;
  logPrompts?: boolean;
  logPath?: string;
  defaultModel?: string;
  defaultWhisperModel?: string;
}
```

### LLMModuleAsyncOptions

Interfejs opisujący opcje konfiguracyjne dla asynchronicznej inicjalizacji modułu:

```typescript
export interface LLMModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<LLMModuleOptions> | LLMModuleOptions;
  inject?: any[];
  imports?: any[];
}
```

## Obsługa odpowiedzi

### ChatCompletionResponse

Generyczny interfejs dla wszystkich odpowiedzi zwracanych przez metody serwisu LLM:

```typescript
export interface ChatCompletionResponse<T = unknown> {
  parsedContent?: T;
  rawContent?: string;
  fullResponse?: ChatCompletion;
}
```

Gdzie:

- `parsedContent` - Zawartość przetworzona (np. jako JSON dla trybu JSON)
- `rawContent` - Surowa treść odpowiedzi w formie tekstowej
- `fullResponse` - Pełna odpowiedź z API OpenAI, zawierająca metadane

## DTO (Data Transfer Objects)

### SpeechToTextDto

Obiekt transferu danych dla endpointu konwersji mowy na tekst:

```typescript
export class SpeechToTextDto {
  file: File;
  language?: string;
  model?: string;
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
}
```

### CompletionDto

Obiekt transferu danych dla kompletacji tekstu:

```typescript
export class CompletionDto {
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  model?: string;
  stream?: boolean;
  jsonMode?: boolean;
}
```

## Schematy Zod

### SpeechToTextSchema

Schemat walidacyjny Zod dla żądań konwersji mowy na tekst:

```typescript
export const SpeechToTextSchema = z.object({
  file: z.instanceof(File),
  language: z.string().optional(),
  model: z.string().optional(),
  responseFormat: z.enum(['json', 'text', 'srt', 'verbose_json', 'vtt']).optional(),
});
```

### LLMConfigSchema

Schemat walidacyjny Zod dla konfiguracji modułu:

```typescript
export const LLMConfigSchema = z.object({
  apiKey: z.string().optional(),
  logPrompts: z.boolean().optional().default(false),
  logPath: z.string().optional(),
  defaultModel: z.string().optional().default(DEFAULT_MODEL),
  defaultWhisperModel: z.string().optional().default(DEFAULT_WHISPER_MODEL),
});

export type LLMConfig = z.infer<typeof LLMConfigSchema>;
```

## Błędy

### OpenAIError

Klasa błędu do obsługi wyjątków związanych z API OpenAI:

```typescript
/**
 * Klasa błędu dla operacji związanych z OpenAI API
 */
export class OpenAIError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'OpenAIError';
  }
}
```

## Importowanie typów

Aby korzystać z tych typów w swojej aplikacji, zaimportuj je bezpośrednio z modułu:

```typescript
import { LLMModuleOptions, ChatCompletionResponse, OpenAIError } from 's-nestjs-module-llm';
```

## Przykład wykorzystania typów

```typescript
import { Injectable } from '@nestjs/common';
import { LLMService, ChatCompletionResponse, OpenAIError } from 's-nestjs-module-llm';

interface User {
  name: string;
  age: number;
}

@Injectable()
export class UserAnalysisService {
  constructor(private readonly llmService: LLMService) {}

  async extractUserInfo(text: string): Promise<User> {
    try {
      const result: ChatCompletionResponse<User> = await this.llmService.createCompletion<User>({
        userPrompt: text,
        systemPrompt: 'Wyodrębnij informacje o użytkowniku w formacie JSON',
        jsonMode: true,
      });

      return result.parsedContent;
    } catch (error) {
      if (error instanceof OpenAIError) {
        console.error('Błąd API OpenAI:', error.message);
      }
      throw error;
    }
  }
}
```

## Powrót do strony głównej

Aby wrócić do strony głównej dokumentacji, kliknij [tutaj](./index.md).
