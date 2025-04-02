import type { ChatCompletion, ChatCompletionChunk, ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { LLMModuleOptions } from './config/llm-config.interface';
import { ChatCompletionResponse } from './interfaces/chat-completion-response.interface';
export declare class LLMService {
    private openai;
    private readonly config;
    constructor(options: LLMModuleOptions);
    completion(messages: ChatCompletionMessageParam[], model?: string, stream?: boolean, jsonMode?: boolean): Promise<ChatCompletion | AsyncIterable<ChatCompletionChunk>>;
    speechToText(audio: File, options?: {
        language?: string;
        model?: string;
        responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
    }): Promise<string>;
    createCompletion<T = unknown>({ userPrompt, systemPrompt, jsonMode, includeRaw, includeFull, }: {
        userPrompt: string;
        systemPrompt: string;
        jsonMode?: boolean;
        includeRaw?: boolean;
        includeFull?: boolean;
    }): Promise<ChatCompletionResponse<T>>;
    private logCompletion;
    getPictureDescription(pictures: Buffer[], systemPrompt: string): Promise<ChatCompletionResponse<string>>;
}
