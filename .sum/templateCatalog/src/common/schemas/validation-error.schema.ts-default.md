import { z } from 'zod';

export const ValidationErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  errors: z.array(
    z.object({
      validation: z.object({
        type: z.enum(['params', 'response', 'unknown']),
        field: z.string(),
        fullPath: z.string(),
        error: z.string(),
      }),
      details: z.object({
        message: z.string(),
        code: z.string(),
        path: z.array(z.string()),
      }),
      debug: z
        .object({
          issue: z.any(),
          context: z.string(),
        })
        .optional(),
    }),
  ),
  meta: z.object({
    timestamp: z.string(),
    type: z.string(),
    total: z.number(),
  }),
  stack: z.string().optional(),
});
