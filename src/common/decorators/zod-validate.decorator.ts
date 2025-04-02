import { UseFilters } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ZodValidationFilter } from '../filters/zod-validation.filter';

export const ZodValidate = <TInput, TOutput>(paramSchema?: ZodSchema<TInput>, responseSchema?: ZodSchema<TOutput>) => {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value as (...args: unknown[]) => Promise<unknown>;

    descriptor.value = async function (...args: unknown[]) {
      // Walidacja parametrów wejściowych
      if (paramSchema && args.length > 0) {
        const paramResult = paramSchema.safeParse(args[0]);
        if (!paramResult.success) {
          throw Object.assign(paramResult.error, { _type: 'params' });
        }
        args[0] = paramResult.data;
      }

      // Wywołanie oryginalnej metody
      const result = await originalMethod.apply(this, args);

      // Walidacja odpowiedzi
      if (responseSchema) {
        const responseResult = responseSchema.safeParse(result);
        if (!responseResult.success) {
          throw Object.assign(responseResult.error, { _type: 'response' });
        }
        return responseResult.data;
      }

      return result;
    };

    UseFilters(ZodValidationFilter)(target, propertyKey, descriptor);
    return descriptor;
  };
};
