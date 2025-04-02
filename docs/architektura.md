# Architektura

## Struktura modułu

Moduł LLM jest zbudowany zgodnie z konwencjami NestJS i składa się z następujących głównych elementów:

```
src/modules/llm/
├── config/             # Konfiguracja modułu
│   ├── app.config.ts
│   ├── llm-config.interface.ts
│   ├── llm-config.schema.ts
│   └── llm.constants.ts
├── controllers/        # Kontrolery REST API
│   └── llm.controller.ts
├── dto/                # Obiekty transferu danych
│   ├── completion.dto.ts
│   └── speech-to-text.dto.ts
├── entities/           # Encje bazodanowe (jeśli używane)
├── errors/             # Niestandardowe klasy błędów
│   └── open-ai.error.ts
├── interfaces/         # Interfejsy i typy
│   └── chat-completion-response.interface.ts
├── schemas/            # Schematy walidacyjne Zod
│   └── speech-to-text.schema.ts
├── services/           # Dodatkowe serwisy
├── index.ts            # Publiczne API modułu
├── llm.module.ts       # Główny moduł
└── llm.service.ts      # Główny serwis
```

## Przepływ danych

1. **Konfiguracja** - Moduł jest inicjalizowany z opcjami konfiguracji poprzez `LLMModule.forRoot()` lub `LLMModule.forRootAsync()`
2. **Wstrzykiwanie zależności** - Moduł korzysta z mechanizmu DI NestJS do wstrzykiwania zależności
3. **Komunikacja z API** - `LLMService` komunikuje się z API OpenAI
4. **Kontrolery REST** - Udostępniają endpointy do wykorzystania funkcji modułu przez klientów

## Ważne komponenty

### LLMModule

Główny moduł, który konfiguruje i eksportuje funkcjonalności. Posiada dwie metody konfiguracyjne:

- `forRoot()` - Statyczna konfiguracja
- `forRootAsync()` - Konfiguracja asynchroniczna, np. z użyciem ConfigService

```typescript
@Module({
  imports: [ZodConfigModule],
  controllers: [LLMController],
  providers: [
    {
      provide: LLM_MODULE_OPTIONS,
      useValue: {},
    },
    LLMService,
  ],
  exports: [LLMService],
})
export class LLMModule {
  static forRoot(options?: LLMModuleOptions): DynamicModule {
    // ...
  }

  static forRootAsync(options: LLMModuleAsyncOptions): DynamicModule {
    // ...
  }
}
```

### LLMService

Główny serwis, który obsługuje komunikację z API OpenAI. Udostępnia metody do:

- Generowania tekstu (chat completions)
- Konwersji mowy na tekst
- Analizy obrazów

### Walidacja

Moduł wykorzystuje bibliotekę Zod do walidacji danych wejściowych:

- `ZodValidationPipe` - Pipe do walidacji żądań HTTP
- `LLMConfigSchema` - Schemat walidacyjny dla opcji konfiguracyjnych

## Obsługa błędów

Moduł ma własną klasę błędu `OpenAIError`, która rozszerza standardową klasę `Error`. Służy do obsługi błędów związanych z API OpenAI.

## Metody eksportowane

Moduł eksportuje:

- `LLMModule` - Główny moduł do konfiguracji
- `LLMService` - Serwis do wykorzystania w innych modułach
- Interfejsy i typy - Do zachowania typowania

## Następne kroki

Aby dowiedzieć się więcej o serwisach dostępnych w module, przejdź do [Serwisy](./serwisy.md).
