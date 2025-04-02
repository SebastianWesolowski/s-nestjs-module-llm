import { z } from 'zod';

export const SpeechToTextSchema = z.object({
  file: z.any(), // dla plików binarnych
  language: z.string().optional(),
  model: z.string().optional(),
  responseFormat: z.enum(['json', 'text', 'srt', 'verbose_json', 'vtt']).optional().default('json'),
});

export type SpeechToTextInput = z.infer<typeof SpeechToTextSchema>;
