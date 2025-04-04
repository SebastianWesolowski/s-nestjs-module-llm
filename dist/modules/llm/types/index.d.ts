import { DynamicModule, InjectionToken, OptionalFactoryDependency, Type } from '@nestjs/common';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { z } from 'zod';
export interface LLMModuleOptions {
    apiKey?: string;
    logPrompts?: boolean;
    logPath?: string;
    defaultModel?: string;
    defaultWhisperModel?: string;
}
export interface LLMModuleAsyncOptions {
    useFactory: (...args: any[]) => Promise<LLMModuleOptions> | LLMModuleOptions;
    inject?: (InjectionToken | OptionalFactoryDependency)[];
    imports?: (Type<any> | DynamicModule | Promise<DynamicModule>)[];
}
export declare const LLMConfigSchema: z.ZodObject<{
    apiKey: z.ZodString;
    logPrompts: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    logPath: z.ZodOptional<z.ZodString>;
    defaultModel: z.ZodOptional<z.ZodString>;
    defaultWhisperModel: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    apiKey: string;
    logPrompts: boolean;
    logPath?: string | undefined;
    defaultModel?: string | undefined;
    defaultWhisperModel?: string | undefined;
}, {
    apiKey: string;
    logPrompts?: boolean | undefined;
    logPath?: string | undefined;
    defaultModel?: string | undefined;
    defaultWhisperModel?: string | undefined;
}>;
export type LLMConfigType = z.infer<typeof LLMConfigSchema>;
export declare const AsyncLLMConfigSchema: z.ZodObject<{
    useFactory: z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodUnion<[z.ZodPromise<z.ZodObject<{
        apiKey: z.ZodString;
        logPrompts: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        logPath: z.ZodOptional<z.ZodString>;
        defaultModel: z.ZodOptional<z.ZodString>;
        defaultWhisperModel: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        apiKey: string;
        logPrompts: boolean;
        logPath?: string | undefined;
        defaultModel?: string | undefined;
        defaultWhisperModel?: string | undefined;
    }, {
        apiKey: string;
        logPrompts?: boolean | undefined;
        logPath?: string | undefined;
        defaultModel?: string | undefined;
        defaultWhisperModel?: string | undefined;
    }>>, z.ZodObject<{
        apiKey: z.ZodString;
        logPrompts: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        logPath: z.ZodOptional<z.ZodString>;
        defaultModel: z.ZodOptional<z.ZodString>;
        defaultWhisperModel: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        apiKey: string;
        logPrompts: boolean;
        logPath?: string | undefined;
        defaultModel?: string | undefined;
        defaultWhisperModel?: string | undefined;
    }, {
        apiKey: string;
        logPrompts?: boolean | undefined;
        logPath?: string | undefined;
        defaultModel?: string | undefined;
        defaultWhisperModel?: string | undefined;
    }>]>>;
    inject: z.ZodOptional<z.ZodArray<z.ZodType<InjectionToken, z.ZodTypeDef, InjectionToken>, "many">>;
    imports: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodType<Type<unknown>, z.ZodTypeDef, Type<unknown>>, z.ZodType<DynamicModule, z.ZodTypeDef, DynamicModule>]>, "many">>;
}, "strict", z.ZodTypeAny, {
    useFactory: (args_0: any, ...args: unknown[]) => {
        apiKey: string;
        logPrompts: boolean;
        logPath?: string | undefined;
        defaultModel?: string | undefined;
        defaultWhisperModel?: string | undefined;
    } | Promise<{
        apiKey: string;
        logPrompts: boolean;
        logPath?: string | undefined;
        defaultModel?: string | undefined;
        defaultWhisperModel?: string | undefined;
    }>;
    inject?: InjectionToken[] | undefined;
    imports?: (Type<unknown> | DynamicModule)[] | undefined;
}, {
    useFactory: (args_0: any, ...args: unknown[]) => {
        apiKey: string;
        logPrompts?: boolean | undefined;
        logPath?: string | undefined;
        defaultModel?: string | undefined;
        defaultWhisperModel?: string | undefined;
    } | Promise<{
        apiKey: string;
        logPrompts?: boolean | undefined;
        logPath?: string | undefined;
        defaultModel?: string | undefined;
        defaultWhisperModel?: string | undefined;
    }>;
    inject?: InjectionToken[] | undefined;
    imports?: (Type<unknown> | DynamicModule)[] | undefined;
}>;
export type AsyncLLMConfigType = z.infer<typeof AsyncLLMConfigSchema>;
export declare const MessageSchema: z.ZodObject<{
    role: z.ZodEnum<["system", "user", "assistant"]>;
    content: z.ZodString;
}, "strict", z.ZodTypeAny, {
    role: "system" | "user" | "assistant";
    content: string;
}, {
    role: "system" | "user" | "assistant";
    content: string;
}>;
declare const MessageDto_base: import("@anatine/zod-nestjs").ZodDtoStatic<z.ZodObject<{
    role: z.ZodEnum<["system", "user", "assistant"]>;
    content: z.ZodString;
}, "strict", z.ZodTypeAny, {
    role: "system" | "user" | "assistant";
    content: string;
}, {
    role: "system" | "user" | "assistant";
    content: string;
}>>;
export declare class MessageDto extends MessageDto_base {
}
export type MessageType = z.infer<typeof MessageSchema>;
export declare const CompletionSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodType<ChatCompletionMessageParam, z.ZodTypeDef, ChatCompletionMessageParam>, "many">;
    model: z.ZodOptional<z.ZodString>;
    stream: z.ZodOptional<z.ZodBoolean>;
    jsonMode: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    messages: ChatCompletionMessageParam[];
    model?: string | undefined;
    stream?: boolean | undefined;
    jsonMode?: boolean | undefined;
}, {
    messages: ChatCompletionMessageParam[];
    model?: string | undefined;
    stream?: boolean | undefined;
    jsonMode?: boolean | undefined;
}>;
declare const CompletionDto_base: import("@anatine/zod-nestjs").ZodDtoStatic<z.ZodObject<{
    messages: z.ZodArray<z.ZodType<ChatCompletionMessageParam, z.ZodTypeDef, ChatCompletionMessageParam>, "many">;
    model: z.ZodOptional<z.ZodString>;
    stream: z.ZodOptional<z.ZodBoolean>;
    jsonMode: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    messages: ChatCompletionMessageParam[];
    model?: string | undefined;
    stream?: boolean | undefined;
    jsonMode?: boolean | undefined;
}, {
    messages: ChatCompletionMessageParam[];
    model?: string | undefined;
    stream?: boolean | undefined;
    jsonMode?: boolean | undefined;
}>>;
export declare class CompletionDto extends CompletionDto_base {
}
export type CompletionType = z.infer<typeof CompletionSchema>;
export declare const ChatCompletionResponseMessageSchema: z.ZodObject<{
    role: z.ZodString;
    content: z.ZodString;
}, "strict", z.ZodTypeAny, {
    role: string;
    content: string;
}, {
    role: string;
    content: string;
}>;
export declare const ChatCompletionResponseSchema: z.ZodObject<{
    messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        role: z.ZodString;
        content: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        role: string;
        content: string;
    }, {
        role: string;
        content: string;
    }>, "many">>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    promptTokens: z.ZodOptional<z.ZodNumber>;
    completionTokens: z.ZodOptional<z.ZodNumber>;
    parsedContent: z.ZodOptional<z.ZodUnknown>;
    rawContent: z.ZodOptional<z.ZodString>;
    fullResponse: z.ZodOptional<z.ZodUnknown>;
}, "strict", z.ZodTypeAny, {
    messages?: {
        role: string;
        content: string;
    }[] | undefined;
    totalTokens?: number | undefined;
    promptTokens?: number | undefined;
    completionTokens?: number | undefined;
    parsedContent?: unknown;
    rawContent?: string | undefined;
    fullResponse?: unknown;
}, {
    messages?: {
        role: string;
        content: string;
    }[] | undefined;
    totalTokens?: number | undefined;
    promptTokens?: number | undefined;
    completionTokens?: number | undefined;
    parsedContent?: unknown;
    rawContent?: string | undefined;
    fullResponse?: unknown;
}>;
export type ChatCompletionResponseType<T = unknown> = z.infer<typeof ChatCompletionResponseSchema> & {
    parsedContent?: T;
};
declare const ChatCompletionResponseDto_base: import("@anatine/zod-nestjs").ZodDtoStatic<z.ZodObject<{
    messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        role: z.ZodString;
        content: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        role: string;
        content: string;
    }, {
        role: string;
        content: string;
    }>, "many">>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    promptTokens: z.ZodOptional<z.ZodNumber>;
    completionTokens: z.ZodOptional<z.ZodNumber>;
    parsedContent: z.ZodOptional<z.ZodUnknown>;
    rawContent: z.ZodOptional<z.ZodString>;
    fullResponse: z.ZodOptional<z.ZodUnknown>;
}, "strict", z.ZodTypeAny, {
    messages?: {
        role: string;
        content: string;
    }[] | undefined;
    totalTokens?: number | undefined;
    promptTokens?: number | undefined;
    completionTokens?: number | undefined;
    parsedContent?: unknown;
    rawContent?: string | undefined;
    fullResponse?: unknown;
}, {
    messages?: {
        role: string;
        content: string;
    }[] | undefined;
    totalTokens?: number | undefined;
    promptTokens?: number | undefined;
    completionTokens?: number | undefined;
    parsedContent?: unknown;
    rawContent?: string | undefined;
    fullResponse?: unknown;
}>>;
export declare class ChatCompletionResponseDto extends ChatCompletionResponseDto_base {
}
export declare const ResponseFormatSchema: z.ZodEnum<["json", "text", "srt", "verbose_json", "vtt"]>;
export declare const SpeechToTextSchema: z.ZodObject<{
    file: z.ZodAny;
    language: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    responseFormat: z.ZodOptional<z.ZodEnum<["json", "text", "srt", "verbose_json", "vtt"]>>;
}, "strict", z.ZodTypeAny, {
    model?: string | undefined;
    file?: any;
    language?: string | undefined;
    responseFormat?: "json" | "text" | "srt" | "verbose_json" | "vtt" | undefined;
}, {
    model?: string | undefined;
    file?: any;
    language?: string | undefined;
    responseFormat?: "json" | "text" | "srt" | "verbose_json" | "vtt" | undefined;
}>;
export type SpeechToTextType = z.infer<typeof SpeechToTextSchema>;
export declare class SpeechToTextDto {
    audio: string;
    language?: string;
    model?: string;
    prompt?: string;
    responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
    temperature?: string;
}
export {};
