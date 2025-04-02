import { generateMock } from '@anatine/zod-mock';
import { generateSchema } from '@anatine/zod-openapi';
import { ApiResponse } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ZodSchema } from 'zod';

/**
 * Konwertuje schemat Zod na obiekt OpenAPI Schema
 */
export function zodToOpenAPI(schema: ZodSchema): SchemaObject {
  return generateSchema(schema) as unknown as SchemaObject;
}

/**
 * Dekorator do generowania dokumentacji Swagger dla zwracanych odpowiedzi
 * wykorzystując automatyczne generowanie przykładów z @anatine/zod-mock
 */
export function ApiZodResponse(schema: ZodSchema) {
  // Generujemy przykład z użyciem @anatine/zod-mock
  const mockExample = generateMock(schema) as Record<string, unknown>;

  return ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: zodToOpenAPI(schema),
        example: mockExample,
      },
    },
    description: 'Successful response',
  });
}
