import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger("API")

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();

        const { method, url } = context.switchToHttp().getRequest<Request>();

        return next
            .handle()
            .pipe(
                finalize(() => this.logger.log(`${method} ${url} ${Date.now() - now}ms`)),
            );
    }
}
