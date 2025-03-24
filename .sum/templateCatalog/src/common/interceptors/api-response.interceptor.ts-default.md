import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  createApiResponse,
  isApiResponse,
} from '../schemas/api-response.schema';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        // Jeśli odpowiedź już jest w formacie API
        if (isApiResponse(data)) {
          return data;
        }

        // Obsługa błędów
        if ('error' in data) {
          return createApiResponse(data, 'Error');
        }

        // Standardowa odpowiedź
        return createApiResponse(data);
      }),
    );
  }
}
