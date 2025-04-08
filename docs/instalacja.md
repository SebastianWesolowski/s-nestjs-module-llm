# Instalacja i konfiguracja

## Wymagania wstępne

Przed instalacją modułu LLM upewnij się, że masz:

1. Zainstalowany Node.js w wersji 20.17.0 lub nowszej
2. Zainstalowany NestJS w wersji 11.0.0 lub nowszej
3. Klucz API OpenAI (możesz go uzyskać na [platformie OpenAI](https://platform.openai.com/))

## Instalacja

Aby zainstalować moduł LLM w swoim projekcie NestJS, wykonaj następujące kroki:

1. Otwórz terminal w katalogu projektu
2. Wykonaj komendę:

```bash
npm install s-nestjs-module-llm
```

## Konfiguracja

### 1. Prosta konfiguracja

Najprostszy sposób konfiguracji modułu:

```typescript
// src/app.module.ts
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

### 2. Konfiguracja z użyciem zmiennych środowiskowych

Lepszym rozwiązaniem jest użycie zmiennych środowiskowych:

1. Utwórz plik `.env` w głównym katalogu projektu:

```env
OPENAI_API_KEY=twój-klucz-api-openai
LOG_PROMPTS=true
LOG_PATH=logs/openai.log
```

2. Zaktualizuj konfigurację modułu:

```typescript
// src/app.module.ts
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

## Opcje konfiguracyjne

Moduł przyjmuje następujące opcje konfiguracyjne:

| Opcja                 | Typ       | Domyślna wartość             | Opis                                        |
| --------------------- | --------- | ---------------------------- | ------------------------------------------- |
| `apiKey`              | `string`  | `process.env.OPENAI_API_KEY` | Klucz API OpenAI                            |
| `logPrompts`          | `boolean` | `false`                      | Czy zapisywać prompty i odpowiedzi do pliku |
| `logPath`             | `string`  | `prompt.md`                  | Ścieżka do pliku logów promptów             |
| `defaultModel`        | `string`  | `gpt-4o`                     | Domyślny model GPT                          |
| `defaultWhisperModel` | `string`  | `whisper-1`                  | Domyślny model Whisper                      |

## Weryfikacja instalacji

Aby sprawdzić, czy moduł został poprawnie zainstalowany:

1. Utwórz prosty kontroler:

```typescript
// src/chat/chat.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { LLMService } from 's-nestjs-module-llm';

@Controller('chat')
export class ChatController {
  constructor(private readonly llmService: LLMService) {}

  @Post()
  async chat(@Body() messages: { role: string; content: string }[]) {
    return this.llmService.completion(messages);
  }
}
```

2. Zarejestruj kontroler w module:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [
    // ... konfiguracja LLMModule
  ],
  controllers: [ChatController],
})
export class AppModule {}
```

3. Uruchom aplikację:

```bash
npm run start:dev
```

4. Przetestuj endpoint:

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '[{"role":"user","content":"Cześć!"}]'
```

## Rozwiązywanie problemów

### 1. Błąd "Cannot find module 's-nestjs-module-llm'"

Upewnij się, że:

- Moduł został poprawnie zainstalowany
- Ścieżka do modułu jest poprawna
- Masz dostęp do rejestru npm

### 2. Błąd "Invalid API key"

Sprawdź, czy:

- Klucz API jest poprawny
- Klucz API jest prawidłowo skonfigurowany
- Masz dostęp do API OpenAI

### 3. Błąd "Module not found"

Upewnij się, że:

- Moduł jest poprawnie zaimportowany
- Wszystkie zależności są zainstalowane
- Ścieżki importów są poprawne

## Następne kroki

Po poprawnym zainstalowaniu i skonfigurowaniu modułu, możesz:

- Poznać [architekturę modułu](./architektura.md)
- Dowiedzieć się więcej o [serwisach](./serwisy.md)
- Poznać [kontrolery](./kontrolery.md)
- Zrozumieć [interfejsy i typy](./interfejsy.md)
