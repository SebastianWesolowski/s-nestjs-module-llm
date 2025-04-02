# Kontrolery

## LLMController

`LLMController` to kontroler REST API, który udostępnia endpointy do korzystania z funkcji LLM bez konieczności pisania własnego kodu.

### Konfiguracja

Kontroler jest automatycznie rejestrowany podczas importu `LLMModule`:

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
  // ...
}
```

### Endpointy

#### POST /llm/speech-to-text

Endpoint służący do konwersji pliku audio na tekst.

```typescript
@Post('speech-to-text')
@ApiOperation({ summary: 'Konwertuje mowę na tekst' })
@ApiResponse({ status: 200, description: 'Tekst z audio' })
@UsePipes(new ZodValidationPipe(SpeechToTextSchema))
async speechToText(@Body() dto: SpeechToTextDto): Promise<string> {
  return this.llmService.speechToText(dto.file, {
    language: dto.language,
    model: dto.model,
    responseFormat: dto.responseFormat,
  });
}
```

**Parametry żądania:**

- `file` - Plik audio (wymagany)
- `language` - Kod języka (opcjonalny, domyślnie 'en')
- `model` - Model Whisper do użycia (opcjonalny)
- `responseFormat` - Format odpowiedzi (opcjonalny, domyślnie 'json')

**Odpowiedź:**

- Tekst transkrypcji

**Przykład żądania:**

```http
POST /llm/speech-to-text
Content-Type: multipart/form-data

file=@nagranie.mp3
language=pl
```

**Przykład odpowiedzi:**

```
To jest transkrypcja mojego nagrania audio.
```

### Dokumentacja API

Kontroler jest skonfigurowany z użyciem dekoratorów `@ApiOperation` i `@ApiResponse` z pakietu `@nestjs/swagger`, co pozwala na automatyczne generowanie dokumentacji API.

```typescript
@ApiOperation({ summary: 'Konwertuje mowę na tekst' })
@ApiResponse({ status: 200, description: 'Tekst z audio' })
```

### Walidacja

Kontroler wykorzystuje `ZodValidationPipe` do walidacji danych wejściowych:

```typescript
@UsePipes(new ZodValidationPipe(SpeechToTextSchema))
```

Schemat walidacyjny `SpeechToTextSchema` definiuje oczekiwane pola i ich typy:

```typescript
export const SpeechToTextSchema = z.object({
  file: z.instanceof(File),
  language: z.string().optional(),
  model: z.string().optional(),
  responseFormat: z.enum(['json', 'text', 'srt', 'verbose_json', 'vtt']).optional(),
});
```

## Tworzenie własnych kontrolerów

Możesz tworzyć własne kontrolery, wstrzykując `LLMService`:

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { LLMService } from 's-nestjs-module-llm';

@Controller('moj-kontroler')
export class MojKontroler {
  constructor(private readonly llmService: LLMService) {}

  @Post('generuj-tekst')
  async generujTekst(@Body() body: { prompt: string }): Promise<{ response: string }> {
    const completion = await this.llmService.completion([{ role: 'user', content: body.prompt }]);

    return {
      response: completion.choices[0].message.content,
    };
  }
}
```

## Następne kroki

Aby dowiedzieć się więcej o interfejsach i typach dostępnych w module, przejdź do [Interfejsy i typy](./interfejsy.md).
