import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value) as unknown;
    } catch (error) {
      throw new BadRequestException('Błąd walidacji', {
        cause: error,
        description: 'Nieprawidłowe dane wejściowe',
      });
    }
  }
}
