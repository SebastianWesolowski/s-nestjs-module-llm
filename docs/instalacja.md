# Instalacja i konfiguracja

## Instalacja

Aby zainstalować moduł LLM w swoim projekcie NestJS, wykonaj następujące kroki:

```bash
npm install s-nestjs-module-llm
```

## Konfiguracja

Aby skonfigurować moduł LLM, musisz zaimportować go do głównego modułu aplikacji.

### Prosta konfiguracja

```typescript
import { Module } from '@nestjs/common';
import { LLMModule } from 's-nestjs-module-llm';

@Module({
  imports: [
    LLMModule.forRoot({
      apiKey: 'twój-klucz-api-openai',
      logPrompts: false,
    }),
  ],
})
export class AppModule {}
```

### Konfiguracja z ConfigService

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LLMModule } from 's-nestjs-module-llm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LLMModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('OPENAI_API_KEY'),
        logPrompts: configService.get('LOG_PROMPTS') === 'true',
        logPath: configService.get('LOG_PATH'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Opcje konfiguracji

Moduł przyjmuje następujące opcje konfiguracyjne:

| Opcja                 | Typ       | Domyślna wartość             | Opis                                        |
| --------------------- | --------- | ---------------------------- | ------------------------------------------- |
| `apiKey`              | `string`  | `process.env.OPENAI_API_KEY` | Klucz API OpenAI                            |
| `logPrompts`          | `boolean` | `false`                      | Czy zapisywać prompty i odpowiedzi do pliku |
| `logPath`             | `string`  | `prompt.md`                  | Ścieżka do pliku logów promptów             |
| `defaultModel`        | `string`  | `gpt-4o`                     | Domyślny model GPT                          |
| `defaultWhisperModel` | `string`  | `whisper-1`                  | Domyślny model Whisper                      |

## Zmienne środowiskowe

Dla poprawnego działania modułu, zalecane jest ustawienie następujących zmiennych środowiskowych:

```
OPENAI_API_KEY=twój-klucz-api-openai
LOG_PROMPTS=true
LOG_PATH=logs/openai.log
```

## Wymagania systemowe

Moduł wymaga następujących zależności:

- Node.js >= 20.17.0
- NestJS >= 11.0.0
- OpenAI API >= 4.91.0

## Następne kroki

Aby dowiedzieć się więcej o architekturze modułu, przejdź do [Architektura](./architektura.md).
