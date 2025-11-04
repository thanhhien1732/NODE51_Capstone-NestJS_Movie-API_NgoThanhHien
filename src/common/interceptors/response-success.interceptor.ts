import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MESSAGE_RESPONSE } from '../decorators/message-response.decorator';

@Injectable()
export class ResponseSuccessInterceptor implements NestInterceptor {

    constructor(private refector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const { statusCode } = context.switchToHttp().getResponse<Response>();

        return next
            .handle()
            .pipe(
                map((data) => {
                    const message = this.refector.get(MESSAGE_RESPONSE, context.getHandler());

                    return {
                        status: `success`,
                        statusCode: statusCode,
                        message: message || `Chưa gắn decorator MessageResponse vào controller`,
                        data: data,
                    }
                }),
            );
    }
}
