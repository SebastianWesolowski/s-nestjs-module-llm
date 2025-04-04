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

Metoda do generowania tekstu z możliwością dostosowania promptów i formatów odpowiedzi:

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
}): Promise<ChatCompletionResponseType<T>>
```

#### Parametry

- `userPrompt` - Prompt od użytkownika
- `systemPrompt` - Prompt systemowy
- `jsonMode` - Czy wymusić format JSON w odpowiedzi
- `includeRaw` - Czy dołączyć surową odpowiedź
- `includeFull` - Czy dołączyć pełną odpowiedź z API

#### Zwracana wartość

- Obiekt `ChatCompletionResponseType<T>` zawierający przetworzoną odpowiedź

#### getPictureDescription

Metoda do analizy obrazów przy użyciu GPT-4 Vision:

```typescript
async getPictureDescription(
  pictures: Buffer[],
  systemPrompt: string
): Promise<ChatCompletionResponseType<string>>
```

#### Parametry

- `pictures` - Tablica buforów z obrazami do analizy
- `systemPrompt` - Instrukcja systemowa dla analizy obrazów

#### Zwracana wartość

- Obiekt `ChatCompletionResponseType<string>` zawierający opis obrazów

**Przykład użycia:**

```

```
