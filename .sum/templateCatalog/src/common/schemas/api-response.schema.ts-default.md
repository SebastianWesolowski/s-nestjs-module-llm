// Schema dla odpowiedzi API
import { z } from 'zod';

// Bazowy schemat dla odpowiedzi API
export const ApiResponseSchema = z.object({
  message: z.string(),
  timestamp: z.string().datetime(),
  data: z.unknown(),
});

// Typ dla odpowiedzi API
export type ApiResponse<T = unknown> = {
  message: string;
  timestamp: string;
  data: T;
};

// Helper do sprawdzania czy odpowiedź jest już w formacie API
export const isApiResponse = (data: unknown): data is ApiResponse => {
  return ApiResponseSchema.safeParse(data).success;
};

// Helper do tworzenia odpowiedzi API
export const createApiResponse = <T>(
  data: T,
  message = 'Success',
): ApiResponse<T> => ({
  message,
  timestamp: new Date().toISOString(),
  data,
});
