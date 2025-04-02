import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AddAssignedDateInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (!Array.isArray(data)) {
          return data;
        }

        const today = new Date();
        return data.map((item, index) => {
          if (typeof item !== 'object' || item === null) {
            return item;
          }

          const assignedDate = new Date(today);
          assignedDate.setDate(today.getDate() + index);

          return {
            ...item,
            assignedDate: assignedDate.toISOString().split('T')[0],
          };
        });
      })
    );
  }
}
