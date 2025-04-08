# Podstawy NestJS i modułu LLM

## Czym jest NestJS?

NestJS to framework do budowania aplikacji backendowych w Node.js. Jest zbudowany na podstawie Express.js i wykorzystuje TypeScript. Główne cechy NestJS to:

1. **Modułowość** - Aplikacja jest podzielona na moduły, które mogą być niezależnie rozwijane
2. **Wstrzykiwanie zależności** - Automatyczne zarządzanie zależnościami między komponentami
3. **Kontrolery** - Obsługa żądań HTTP i routingu
4. **Serwisy** - Logika biznesowa aplikacji
5. **Pipes** - Transformacja i walidacja danych
6. **Guards** - Ochrona endpointów
7. **Interceptory** - Modyfikacja żądań i odpowiedzi

## Struktura aplikacji NestJS

Typowa aplikacja NestJS składa się z:

```
src/
├── main.ts              # Punkt wejścia aplikacji
├── app.module.ts        # Główny moduł aplikacji
├── app.controller.ts    # Kontroler główny
└── app.service.ts       # Serwis główny
```

## Czym jest moduł LLM?

Moduł LLM to biblioteka dla NestJS, która ułatwia integrację z OpenAI API. Pozwala na:

1. Generowanie tekstu przy użyciu modeli GPT
2. Konwersję mowy na tekst (Whisper)
3. Analizę obrazów (GPT-4 Vision)
4. Obsługę odpowiedzi w formacie JSON
5. Logowanie promptów i odpowiedzi

## Podstawowe pojęcia w module LLM

### 1. Moduł

Moduł to podstawowa jednostka organizacyjna w NestJS. W module LLM mamy:

```typescript
@Module({
  imports: [ConfigModule],
  controllers: [LLMController],
  providers: [LLMService],
  exports: [LLMService],
})
export class LLMModule {}
```

### 2. Kontroler

Kontroler obsługuje żądania HTTP. W module LLM mamy endpointy:

```typescript
@Controller('llm')
export class LLMController {
  @Post('completion')
  async completion(@Body() dto: CompletionDto) {
    // Obsługa żądania
  }
}
```

### 3. Serwis

Serwis zawiera logikę biznesową. W module LLM:

```typescript
@Injectable()
export class LLMService {
  async completion(messages: MessageType[]) {
    // Logika generowania tekstu
  }
}
```

### 4. DTO (Data Transfer Objects) i ZOD

DTO to obiekty używane do transferu danych między warstwami aplikacji. W naszym module używamy ich w połączeniu z ZOD do:

1. **Walidacji danych wejściowych** - sprawdzanie poprawności danych przed przetworzeniem
2. **Dokumentacji API** - automatyczne generowanie dokumentacji Swagger
3. **Typowania danych** - zapewnienie typów TypeScript

Przykład użycia DTO z ZOD:

```typescript
// src/modules/llm/types/index.ts
import { z } from 'zod';

// Definicja schematu ZOD
export const CompletionSchema = z.object({
  messages: z.array(MessageSchema).min(1),
  model: z.string().min(1).optional(),
});

// Typ TypeScript wygenerowany z schematu ZOD
export type CompletionDto = z.infer<typeof CompletionSchema>;

// Użycie w kontrolerze
@Controller('llm')
export class LLMController {
  @Post('completion')
  async completion(@Body() dto: CompletionDto) {
    // dto jest już zwalidowany przez ZOD
    return this.llmService.completion(dto);
  }
}
```

Główne korzyści z takiego podejścia:

1. **Jedno źródło prawdy** - jeden schemat ZOD definiuje zarówno walidację jak i typy
2. **Automatyczna walidacja** - NestJS automatycznie waliduje dane wejściowe
3. **Type safety** - TypeScript zapewnia bezpieczeństwo typów
4. **Dokumentacja** - automatyczne generowanie dokumentacji API

### 5. Typy i interfejsy

Definicje typów TypeScript:

```typescript
export type MessageType = {
  role: string;
  content: string;
};
```

## Jak zacząć?

1. Zainstaluj moduł:

```bash
npm install s-nestjs-module-llm
```

2. Zaimportuj do głównego modułu:

```typescript
@Module({
  imports: [
    LLMModule.forRoot({
      apiKey: 'twój-klucz-api',
    }),
  ],
})
export class AppModule {}
```

3. Użyj w kontrolerze:

```typescript
@Controller('chat')
export class ChatController {
  constructor(private readonly llmService: LLMService) {}

  @Post()
  async chat(@Body() messages: MessageType[]) {
    return this.llmService.completion(messages);
  }
}
```

## Następne kroki

- [Instalacja i konfiguracja](./instalacja.md)
- [Architektura modułu](./architektura.md)
- [Serwisy](./serwisy.md)
- [Kontrolery](./kontrolery.md)
- [Interfejsy i typy](./interfejsy.md)
