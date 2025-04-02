// Serwis do obsługi danych użytkowników
import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions';
import { promises as fs } from 'fs';
import path from 'path';
import { LLMModuleOptions } from './config/llm-config.interface';
import { DEFAULT_MODEL, DEFAULT_WHISPER_MODEL, LLM_MODULE_OPTIONS } from './config/llm.constants';
import { OpenAIError } from './errors/open-ai.error';
import { ChatCompletionResponse } from './interfaces/chat-completion-response.interface';

/**
 * Service class for interacting with OpenAI's API.
 * @class LLMService
 * @description Handles OpenAI integrations including chat completions, speech-to-text, etc.
 */
@Injectable()
export class LLMService {
  private openai: OpenAI;
  private readonly config: Required<LLMModuleOptions>;

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

  /**
   * Generates a chat completion using OpenAI's API.
   * @async
   * @param {ChatCompletionMessageParam[]} messages - Array of chat messages to send to OpenAI
   * @param {string} [model] - The OpenAI model to use for completion
   * @param {boolean} [stream=false] - Whether to stream the response
   * @param {boolean} [jsonMode=false] - Whether to force JSON output format
   * @returns {Promise<ChatCompletion | AsyncIterable<ChatCompletionChunk>>}
   * Returns either a complete response or a stream of chunks based on the stream parameter
   * @throws {OpenAIError} Throws an error if the API request fails
   */
  async completion(
    messages: ChatCompletionMessageParam[],
    model = this.config.defaultModel,
    stream = false,
    jsonMode = false
  ): Promise<ChatCompletion | AsyncIterable<ChatCompletionChunk>> {
    try {
      const chatCompletion = await this.openai.chat.completions.create({
        messages,
        model,
        stream,
        response_format: jsonMode ? { type: 'json_object' } : { type: 'text' },
      });

      // Log asynchronously without blocking
      void this.logCompletion(messages, chatCompletion);

      return chatCompletion;
    } catch (error) {
      throw new OpenAIError('Failed to generate completion', { cause: error });
    }
  }

  /**
   * Transcribes audio file to text using OpenAI's Whisper model
   * @param {File} audio - Audio file to transcribe
   * @param {Object} options - Optional configuration for transcription
   * @param {string} [options.language='en'] - Language code of the audio
   * @param {string} [options.model] - Whisper model to use
   * @param {('json'|'text'|'srt'|'verbose_json'|'vtt')} [options.responseFormat='json'] - Format of the response
   * @returns {Promise<string>} Transcribed text from the audio file
   * @throws {OpenAIError} If transcription fails
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
      throw new OpenAIError('Failed to transcribe audio', { cause: error });
    }
  }

  /**
   * Creates a chat completion with customizable prompts and response handling
   * @template T - Type of the expected parsed response (for JSON responses)
   * @param {Object} params - Parameters for the completion
   * @param {string} params.userPrompt - The user's input prompt
   * @param {string} params.systemPrompt - The system instruction prompt
   * @param {boolean} [params.jsonMode=false] - Whether to force JSON output format
   * @param {boolean} [params.includeRaw=false] - Whether to include raw response content
   * @param {boolean} [params.includeFull=false] - Whether to include full OpenAI response
   * @returns {Promise<ChatCompletionResponse<T>>} Formatted response based on parameters
   * @throws {OpenAIError} If the API request fails or JSON parsing fails when jsonMode is true
   *
   * @example
   * // For simple text responses
   * const textResult = await openAIService.createCompletion({
   *   userPrompt: 'Summarize this article...',
   *   systemPrompt: 'You are a professional summarizer.'
   * });
   *
   * // For structured JSON responses
   * interface UserProfile {
   *   name: string;
   *   age: number;
   *   interests: string[];
   * }
   *
   * const jsonResult = await openAIService.createCompletion<UserProfile>({
   *   userPrompt: 'Extract user profile from: John, 25, likes coding and hiking',
   *   systemPrompt: 'Extract structured user data',
   *   jsonMode: true
   * });
   *
   * // For debugging with full response
   * const debugResult = await openAIService.createCompletion({
   *   userPrompt: 'Debug this...',
   *   systemPrompt: 'Analyze the issue',
   *   includeRaw: true,
   *   includeFull: true
   * });
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
  }): Promise<ChatCompletionResponse<T>> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: jsonMode ? { type: 'json_object' } : { type: 'text' },
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new OpenAIError('No content received from OpenAI');
      }

      const result: ChatCompletionResponse<T> = {};

      if (jsonMode) {
        try {
          result.parsedContent = JSON.parse(content) as T;
        } catch (parseError) {
          throw new OpenAIError('Failed to parse OpenAI response as JSON', { cause: parseError });
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
      throw new OpenAIError('Failed to create completion', { cause: error });
    }
  }

  /**
   * Logs chat completion messages and responses to a file
   * @private
   * @param {ChatCompletionMessageParam[]} messages - The messages sent to OpenAI
   * @param {unknown} completion - The completion response from OpenAI
   * @throws {OpenAIError} When logging fails
   * @description
   * This method logs both the input messages and completion response to a file specified in config.logPath.
   * Logging only occurs if config.logPrompts is true.
   *
   * Format of the log:
   * ```
   * Messages:
   * [serialized messages]
   *
   * Chat Completion:
   * [serialized completion]
   * ```
   *
   * @example
   * // Inside a public method:
   * await this.logCompletion(messages, response);
   */
  private async logCompletion(messages: ChatCompletionMessageParam[], completion: unknown): Promise<void> {
    if (!this.config.logPrompts) return;

    try {
      const logContent =
        `Messages:\n${JSON.stringify(messages, null, 2)}\n\n` +
        `Chat Completion:\n${JSON.stringify(completion, null, 2)}\n\n`;

      await fs.appendFile(this.config.logPath, logContent);
    } catch (error) {
      throw new OpenAIError('Failed to log completion', { cause: error });
    }
  }

  /**
   * Gets a description of one or more images using GPT-4 Vision
   * @param {Buffer[]} pictures - Array of image buffers to analyze
   * @param {string} systemPrompt - The system instruction prompt for image analysis
   * @returns {Promise<ChatCompletionResponse<string>>} The description of the images
   * @throws {OpenAIError} If the API request fails
   *
   * @example
   * // Single image analysis
   * const imageBuffer = await fs.readFile('image.jpg');
   * const description = await openAIService.getPictureDescription(
   *   [imageBuffer],
   *   'Describe this image in detail, focusing on key elements'
   * );
   *
   * // Multiple images comparison
   * const images = await Promise.all([
   *   fs.readFile('before.jpg'),
   *   fs.readFile('after.jpg')
   * ]);
   * const comparison = await openAIService.getPictureDescription(
   *   images,
   *   'Compare these two images and highlight the differences'
   * );
   *
   * @description
   * Best used for:
   * - Image content analysis
   * - Object detection and description
   * - Scene understanding
   * - Text extraction from images
   * - Image comparison
   */
  async getPictureDescription(pictures: Buffer[], systemPrompt: string): Promise<ChatCompletionResponse<string>> {
    try {
      const imageMessages = pictures.map((pic) => ({
        type: 'image_url' as const,
        image_url: {
          url: `data:image/jpeg;base64,${pic.toString('base64')}`,
        },
      }));

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            content: imageMessages as any,
          },
        ],
        max_tokens: 1000,
      });

      const content = response.choices[0] ? response.choices[0]?.message?.content : 'No content received from OpenAI';

      if (!content) {
        throw new OpenAIError('No content received from OpenAI');
      }

      return {
        parsedContent: content,
        rawContent: content,
        fullResponse: response,
      };
    } catch (error) {
      throw new OpenAIError('Failed to get picture description', { cause: error });
    }
  }
}
