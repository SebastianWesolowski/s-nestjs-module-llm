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
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule>)[];
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

### ChatCompletionResponseType

Typ reprezentujący odpowiedź z API chat completion:

```typescript
export type ChatCompletionResponseType<T = unknown> = {
  messages?: {
    role: string;
    content: string;
  }[];
  totalTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  parsedContent?: T;
  rawContent?: string;
  fullResponse?: unknown;
};
```

## DTO (Data Transfer Objects)

### SpeechToTextDto

Obiekt transferu danych dla endpointu konwersji mowy na tekst:

```typescript
export class SpeechToTextDto implements SpeechToTextInput {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Multer.File;

  @ApiProperty({ required: false })
  language?: string;

  @ApiProperty({ required: false })
  model?: string;

  @ApiProperty({
    required: false,
    enum: ['json', 'text', 'srt', 'verbose_json', 'vtt'],
    default: 'json',
  })
  responseFormat: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';

  static validate(data: unknown): SpeechToTextInput {
    return SpeechToTextSchema.parse(data);
  }
}
```

### CompletionDto

DTO dla żądań generowania tekstu:

```typescript
export const CompletionSchema = z.strictObject({
  messages: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    })
  ),
  model: z.string().optional(),
  stream: z.boolean().optional().default(false),
  jsonMode: z.boolean().optional().default(false),
});

export class CompletionDto extends createZodDto(CompletionSchema) {}
```

## Schematy Zod

### SpeechToTextSchema

Schemat walidacyjny Zod dla żądań konwersji mowy na tekst:

```typescript
export const SpeechToTextSchema = z.object({
  file: z.any(), // dla plików binarnych
  language: z.string().optional(),
  model: z.string().optional(),
  responseFormat: z.enum(['json', 'text', 'srt', 'verbose_json', 'vtt']).optional().default('json'),
});

export type SpeechToTextInput = z.infer<typeof SpeechToTextSchema>;
```

### CompletionSchema

Schemat walidacyjny Zod dla żądań generowania tekstu:

```typescript
export const CompletionSchema = z.strictObject({
  userPrompt: z.string().min(1),
  systemPrompt: z.string().min(1),
  jsonMode: z.boolean().optional().default(false),
  includeRaw: z.boolean().optional().default(false),
  includeFull: z.boolean().optional().default(false),
});

export type CompletionType = z.infer<typeof CompletionSchema>;
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
