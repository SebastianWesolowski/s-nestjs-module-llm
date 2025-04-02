import { z } from 'zod';
export declare const LLMConfigSchema: z.ZodObject<{
    apiKey: z.ZodOptional<z.ZodString>;
    logPrompts: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    logPath: z.ZodOptional<z.ZodString>;
    defaultModel: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    defaultWhisperModel: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    logPrompts: boolean;
    defaultModel: string;
    defaultWhisperModel: string;
    apiKey?: string | undefined;
    logPath?: string | undefined;
}, {
    apiKey?: string | undefined;
    logPrompts?: boolean | undefined;
    logPath?: string | undefined;
    defaultModel?: string | undefined;
    defaultWhisperModel?: string | undefined;
}>;
export type LLMConfig = z.infer<typeof LLMConfigSchema>;
