import { z } from 'zod';
export declare const SpeechToTextSchema: z.ZodObject<{
    file: z.ZodAny;
    language: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    responseFormat: z.ZodDefault<z.ZodOptional<z.ZodEnum<["json", "text", "srt", "verbose_json", "vtt"]>>>;
}, "strip", z.ZodTypeAny, {
    responseFormat: "json" | "text" | "srt" | "verbose_json" | "vtt";
    file?: any;
    language?: string | undefined;
    model?: string | undefined;
}, {
    file?: any;
    language?: string | undefined;
    model?: string | undefined;
    responseFormat?: "json" | "text" | "srt" | "verbose_json" | "vtt" | undefined;
}>;
export type SpeechToTextInput = z.infer<typeof SpeechToTextSchema>;
