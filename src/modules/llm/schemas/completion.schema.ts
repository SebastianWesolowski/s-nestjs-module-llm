import { z } from 'zod';

export const CompletionSchema = z.strictObject({
  userPrompt: z.string().min(1),
  systemPrompt: z.string().min(1),
  jsonMode: z.boolean().optional().default(false),
  includeRaw: z.boolean().optional().default(false),
  includeFull: z.boolean().optional().default(false),
});

export type CompletionType = z.infer<typeof CompletionSchema>;
