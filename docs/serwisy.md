# Serwisy

## LLMService

`LLMService` to główny serwis modułu, oferujący dostęp do funkcji API OpenAI. Serwis posiada następujące główne funkcje:

### Inicjalizacja

Serwis jest inicjalizowany z konfiguracją przekazaną przez moduł:

```typescript
constructor(
  @Inject(LLM_MODULE_OPTIONS)
  options: LLMModuleOptions
) {
  const defaultConfig: Required<LLMModuleOptions> = {
    apiKey: process.env.OPENAI_API_KEY ?? '',
    logPrompts: false,
    logPath: path.join(__dirname, 'prompt.md'),
    defaultModel: DEFAULT_MODEL,
    defaultWhisperModel: DEFAULT_WHISPER_MODEL,
  };

  this.config = { ...defaultConfig, ...options };
  this.openai = new OpenAI({ apiKey: this.config.apiKey });
}
```

### Metody

#### completion

Metoda do generowania odpowiedzi tekstowych z użyciem modeli OpenAI.

```typescript
async completion(
  messages: ChatCompletionMessageParam[],
  model = this.config.defaultModel,
  stream = false,
  jsonMode = false
): Promise<ChatCompletion | AsyncIterable<ChatCompletionChunk>>
```

**Parametry:**

- `messages` - Tablica wiadomości w formacie wymaganym przez OpenAI
- `model` - Nazwa modelu (domyślnie: wartość z konfiguracji)
- `stream` - Czy używać trybu strumieniowego (domyślnie: false)
- `jsonMode` - Czy wymusić format JSON w odpowiedzi (domyślnie: false)

**Zwraca:**

- Obiekt `ChatCompletion` lub `AsyncIterable<ChatCompletionChunk>` w przypadku trybu strumieniowego

**Przykład użycia:**

```typescript
const response = await llmService.completion([{ role: 'user', content: 'Powiedz mi coś o Polsce' }]);
```

#### speechToText

Metoda do konwersji pliku audio na tekst przy użyciu modelu Whisper.

```typescript
async speechToText(
  audio: File,
  options: {
    language?: string;
    model?: string;
    responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
  } = {}
): Promise<string>
```

**Parametry:**

- `audio` - Plik audio do transkrypcji
- `options` - Opcje konfiguracyjne
  - `language` - Kod języka (domyślnie: 'en')
  - `model` - Nazwa modelu (domyślnie: wartość z konfiguracji)
  - `responseFormat` - Format odpowiedzi (domyślnie: 'json')

**Zwraca:**

- Tekst transkrypcji

**Przykład użycia:**

```typescript
const transcript = await llmService.speechToText(audioFile, {
  language: 'pl',
});
```

#### createCompletion

Metoda do tworzenia kompletacji z możliwością dostosowania promptów i formatów odpowiedzi.

```typescript
async createCompletion<T = unknown>({
  userPrompt,
  systemPrompt,
  jsonMode = false,
  includeRaw = false,
  includeFull = false,
}: {
  userPrompt: string;
  systemPrompt: string;
  jsonMode?: boolean;
  includeRaw?: boolean;
  includeFull?: boolean;
}): Promise<ChatCompletionResponse<T>>
```

**Parametry:**

- `userPrompt` - Prompt użytkownika
- `systemPrompt` - Instrukcja systemowa
- `jsonMode` - Czy wymusić format JSON (domyślnie: false)
- `includeRaw` - Czy dołączyć surową odpowiedź (domyślnie: false)
- `includeFull` - Czy dołączyć pełną odpowiedź OpenAI (domyślnie: false)

**Zwraca:**

- Obiekt `ChatCompletionResponse<T>` zawierający przetworzoną odpowiedź

**Przykład użycia:**

```typescript
interface UserProfile {
  name: string;
  age: number;
}

const profile = await llmService.createCompletion<UserProfile>({
  userPrompt: 'Jan Kowalski, 30 lat',
  systemPrompt: 'Wyodrębnij informacje o użytkowniku w formacie JSON',
  jsonMode: true,
});
```

#### getPictureDescription

Metoda do analizy obrazów przy użyciu modelu GPT-4 Vision.

```typescript
async getPictureDescription(
  pictures: Buffer[],
  systemPrompt: string
): Promise<ChatCompletionResponse<string>>
```

**Parametry:**

- `pictures` - Tablica buforów obrazów do analizy
- `systemPrompt` - Instrukcja systemowa

**Zwraca:**

- Obiekt `ChatCompletionResponse<string>` zawierający opis obrazów

**Przykład użycia:**

```typescript
const imageBuffer = await fs.readFile('image.jpg');
const description = await llmService.getPictureDescription(
  [imageBuffer],
  'Opisz szczegółowo, co znajduje się na tym obrazie'
);
```

### Metody prywatne

#### logCompletion

Metoda do logowania promptów i odpowiedzi do pliku.

```typescript
private async logCompletion(
  messages: ChatCompletionMessageParam[],
  completion: unknown
): Promise<void>
```

**Parametry:**

- `messages` - Wiadomości wysłane do OpenAI
- `completion` - Odpowiedź otrzymana od OpenAI

**Zachowanie:**

- Zapisuje logi tylko jeśli `config.logPrompts` jest ustawione na `true`
- Zapisuje dane do pliku określonego w `config.logPath`

## Wstrzykiwanie serwisu

Aby użyć serwisu w innych częściach aplikacji, należy go wstrzyknąć:

```typescript
import { Injectable } from '@nestjs/common';
import { LLMService } from 's-nestjs-module-llm';

@Injectable()
export class MojSerwis {
  constructor(private readonly llmService: LLMService) {}

  async generujTekst(prompt: string): Promise<string> {
    const response = await this.llmService.completion([{ role: 'user', content: prompt }]);
    return response.choices[0].message.content;
  }
}
```

## Następne kroki

Aby dowiedzieć się więcej o kontrolerach dostępnych w module, przejdź do [Kontrolery](./kontrolery.md).
