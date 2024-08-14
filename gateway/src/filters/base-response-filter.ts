import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class baseResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        value = value ? value : [];
        if (value?.code == 401) {
          throw new UnauthorizedException('Unauthorized');
        }
        return {
          statusCode: 200,
          success: true,
          message: null,
          data: value,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
