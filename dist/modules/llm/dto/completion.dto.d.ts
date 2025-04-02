declare const CompletionDto_base: import("@anatine/zod-nestjs").ZodDtoStatic<import("zod").ZodObject<{
    userPrompt: import("zod").ZodString;
    systemPrompt: import("zod").ZodString;
    jsonMode: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
    includeRaw: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
    includeFull: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
}, "strict", import("zod").ZodTypeAny, {
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
}>>;
export declare class CompletionDto extends CompletionDto_base {
}
export {};
