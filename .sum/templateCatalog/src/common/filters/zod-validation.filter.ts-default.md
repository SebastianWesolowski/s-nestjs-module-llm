import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodValidationFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {}

  catch(
    exception: ZodError & { _type?: 'params' | 'response' },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const isDevelopment = this.configService.get('NODE_ENV') === 'development';

    const errorResponse = {
      statusCode: 400,
      message: `Błąd walidacji ${exception._type === 'response' ? 'odpowiedzi' : 'parametrów'}`,
      errors: exception.errors.map((err) => ({
        validation: {
          type: exception._type || 'unknown',
          field: err.path[err.path.length - 1] || 'root',
          fullPath: err.path.length ? err.path.join('.') : 'root',
          error: err.code,
        },
        details: {
          message: this.getReadableError(err),
          code: err.code,
          path: err.path,
        },
        debug: isDevelopment
          ? {
              issue: err,
              context: err.path.join(' -> ') || 'root',
            }
          : undefined,
      })),
      meta: {
        timestamp: new Date().toISOString(),
        type: exception._type === 'response' ? 'odpowiedzi' : 'parametrów',
        total: exception.errors.length,
      },
      ...(isDevelopment && {
        stack: exception.stack,
      }),
    };

    response.status(400).json(errorResponse);
  }

  private getReadableError(err: ZodError['errors'][0]): string {
    switch (err.code) {
      case 'invalid_type':
        return `Pole ${err.path.join('.')} powinno być typu ${err.expected}, otrzymano ${err.received}`;
      case 'invalid_enum_value':
        return `Niedozwolona wartość dla pola ${err.path.join('.')}`;
      case 'invalid_string':
        return `Nieprawidłowy format tekstu w polu ${err.path.join('.')}`;
      case 'too_small':
        return `Wartość w polu ${err.path.join('.')} jest za mała`;
      case 'too_big':
        return `Wartość w polu ${err.path.join('.')} jest za duża`;
      case 'custom':
        return err.message;
      default:
        return err.message;
    }
  }
}
