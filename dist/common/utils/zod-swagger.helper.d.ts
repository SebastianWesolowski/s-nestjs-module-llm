import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ZodSchema } from 'zod';
export declare function zodToOpenAPI(schema: ZodSchema): SchemaObject;
export declare function ApiZodResponse(schema: ZodSchema): MethodDecorator & ClassDecorator;
