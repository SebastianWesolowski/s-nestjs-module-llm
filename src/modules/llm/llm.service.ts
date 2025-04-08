/**
 * Serwis do komunikacji z API OpenAI.
 * Zapewnia metody do generowania tekstu, konwersji mowy na tekst i analizy obrazów.
 */
import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { promises as fs } from 'fs';
import path from 'path';
import { DEFAULT_MODEL, DEFAULT_WHISPER_MODEL, LLM_MODULE_OPTIONS } from './config/llm.constants';
import { OpenAIError } from './errors/open-ai.error';
import { ChatCompletionResponseType, LLMModuleOptions } from './types';

/**
 * Serwis do komunikacji z API OpenAI.
 * Zapewnia metody do generowania tekstu, konwersji mowy na tekst i analizy obrazów.
 */
@Injectable()
export class LLMService {
  private openai: OpenAI;
  private readonly config: Required<LLMModuleOptions>;
  private readonly logPath: string;

  /**
   * Konstruktor serwisu LLM.
   * Inicjalizuje klienta OpenAI i konfigurację modułu.
   *
   * @param options - Opcje konfiguracyjne modułu
   */
  constructor(
    @Inject(LLM_MODULE_OPTIONS)
    options: LLMModuleOptions
  ) {
    const defaultConfig: Required<LLMModuleOptions> = {
      apiKey: process.env.OPENAI_API_KEY ?? '',
      logPrompts: false,
      logPath: path.join(__dirname, 'prompts.md'),
      defaultModel: DEFAULT_MODEL,
      defaultWhisperModel: DEFAULT_WHISPER_MODEL,
    };

    this.config = { ...defaultConfig, ...options };
    this.openai = new OpenAI({ apiKey: this.config.apiKey });
    this.logPath = this.config.logPath || path.join(__dirname, 'prompts.md');
  }

  /**
   * Generuje odpowiedź tekstową na podstawie wiadomości.
   *
   * @param messages - Tablica wiadomości w formacie wymaganym przez OpenAI
   * @param model - Model OpenAI do użycia (domyślnie: wartość z konfiguracji)
   * @param stream - Czy używać trybu strumieniowego (domyślnie: false)
   * @param jsonMode - Czy wymusić format JSON w odpowiedzi (domyślnie: false)
   * @returns Promise z odpowiedzią lub strumieniem odpowiedzi
   * @throws OpenAIError - W przypadku błędu komunikacji z API
   */
  async completion({
    messages,
    model = this.config.defaultModel,
    stream = false,
    jsonMode = false,
  }: {
    messages: ChatCompletionMessageParam[];
    model?: string;
    stream?: boolean;
    jsonMode?: boolean;
  }): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    try {
      const chatCompletion = await this.openai.chat.completions.create({
        messages,
        model,
        stream,
        response_format: jsonMode ? { type: 'json_object' } : { type: 'text' },
      });

      // Log asynchronicznie bez blokowania
      void this.logCompletion(messages, chatCompletion);

      return chatCompletion as OpenAI.Chat.Completions.ChatCompletion;
    } catch (error) {
      throw new OpenAIError('Nie udało się wygenerować odpowiedzi', { cause: error });
    }
  }

  /**
   * Konwertuje plik audio na tekst przy użyciu modelu Whisper.
   *
   * @param audio - Plik audio do transkrypcji
   * @param options - Opcje konfiguracyjne transkrypcji
   * @returns Promise z tekstem transkrypcji
   * @throws OpenAIError - W przypadku błędu komunikacji z API
   */
  async speechToText(
    audio: File,
    options: {
      language?: string;
      model?: string;
      responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
    } = {}
  ): Promise<string> {
    const { language = 'en', model = this.config.defaultWhisperModel, responseFormat = 'json' } = options;

    try {
      const response = await this.openai.audio.transcriptions.create({
        file: audio,
        model,
        language,
        response_format: responseFormat,
      });

      return response.text;
    } catch (error) {
      throw new OpenAIError('Nie udało się transkrybować audio', { cause: error as Error });
    }
  }

  /**
   * Tworzy kompletację z możliwością dostosowania promptów i formatów odpowiedzi.
   *
   * @param params - Parametry kompletacji
   * @returns Promise z odpowiedzią w formacie ChatCompletionResponse
   * @throws OpenAIError - W przypadku błędu komunikacji z API lub parsowania JSON
   */
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
  }): Promise<ChatCompletionResponseType<T>> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: jsonMode ? { type: 'json_object' } : { type: 'text' },
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new OpenAIError('Nie otrzymano treści od OpenAI');
      }

      const result: ChatCompletionResponseType<T> = {};

      if (jsonMode) {
        try {
          result.parsedContent = JSON.parse(content) as T;
        } catch (parseError) {
          throw new OpenAIError('Nie udało się sparsować odpowiedzi OpenAI jako JSON', { cause: parseError as Error });
        }
      }

      if (includeRaw) {
        result.rawContent = content;
      }

      if (includeFull) {
        result.fullResponse = response;
      }

      if (!jsonMode) {
        result.parsedContent = content as unknown as T;
      }

      return result;
    } catch (error) {
      if (error instanceof OpenAIError) {
        throw error;
      }
      throw new OpenAIError('Nie udało się utworzyć kompletacji', { cause: error as Error });
    }
  }

  /**
   * Loguje wiadomości i odpowiedzi do pliku.
   *
   * @param messages - Wiadomości wysłane do OpenAI
   * @param completion - Odpowiedź otrzymana od OpenAI
   * @throws OpenAIError - W przypadku błędu zapisu do pliku
   */
  private async logCompletion(messages: ChatCompletionMessageParam[], completion: unknown): Promise<void> {
    if (!this.config.logPrompts) return;

    try {
      const logContent =
        `Messages:\n${JSON.stringify(messages, null, 2)}\n\n` +
        `Chat Completion:\n${JSON.stringify(completion, null, 2)}\n\n`;

      // Upewnij się, że katalog istnieje
      await fs.mkdir(path.dirname(this.logPath), { recursive: true });

      // Dopisz do pliku (stworzy go jeśli nie istnieje)
      await fs.appendFile(this.logPath, logContent);
    } catch (error) {
      throw new OpenAIError('Nie udało się zalogować kompletacji', { cause: error });
    }
  }

  /**
   * Otrzymuje opis jednego lub więcej obrazów przy użyciu GPT-4 Vision.
   *
   * @param pictures - Tablica buforów obrazów do analizy
   * @param systemPrompt - Instrukcja systemowa dla analizy obrazów
   * @returns Promise z odpowiedzią zawierającą opis obrazów
   * @throws OpenAIError - W przypadku błędu komunikacji z API
   */
  async getPictureDescription(pictures: Buffer[], systemPrompt: string): Promise<ChatCompletionResponseType<string>> {
    try {
      const imageMessages = pictures.map((pic) => ({
        type: 'image_url' as const,
        image_url: {
          url: `data:image/jpeg;base64,${pic.toString('base64')}`,
        },
      }));

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: imageMessages as any,
          },
        ],
        max_tokens: 1000,
      });

      const content = response.choices[0] ? response.choices[0]?.message?.content : 'Nie otrzymano treści od OpenAI';

      if (!content) {
        throw new OpenAIError('Nie otrzymano treści od OpenAI');
      }

      return {
        parsedContent: content,
        rawContent: content,
        fullResponse: response,
      };
    } catch (error) {
      throw new OpenAIError('Nie udało się uzyskać opisu obrazu', { cause: error });
    }
  }
}
