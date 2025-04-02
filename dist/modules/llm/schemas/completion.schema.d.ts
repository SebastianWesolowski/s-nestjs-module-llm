import { z } from 'zod';
export declare const CompletionSchema: z.ZodObject<{
    userPrompt: z.ZodString;
    systemPrompt: z.ZodString;
    jsonMode: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeRaw: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeFull: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strict", z.ZodTypeAny, {
    userPrompt: string;
    systemPrompt: string;
    jsonMode: boolean;
    includeRaw: boolean;
    includeFull: boolean;
}, {
    userPrompt: string;
    systemPrompt: string;
    jsonMode?: boolean | undefined;
    includeRaw?: boolean | undefined;
    includeFull?: boolean | undefined;
}>;
export type CompletionType = z.infer<typeof CompletionSchema>;
