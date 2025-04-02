import { z } from 'zod';
import { DEFAULT_MODEL, DEFAULT_WHISPER_MODEL } from './llm.constants';

export const LLMConfigSchema = z.object({
  apiKey: z.string().optional(),
  logPrompts: z.boolean().optional().default(false),
  logPath: z.string().optional(),
  defaultModel: z.string().optional().default(DEFAULT_MODEL),
  defaultWhisperModel: z.string().optional().default(DEFAULT_WHISPER_MODEL),
});

export type LLMConfig = z.infer<typeof LLMConfigSchema>;
