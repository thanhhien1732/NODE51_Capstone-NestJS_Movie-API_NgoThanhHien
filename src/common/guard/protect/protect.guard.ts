import {
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class ProtectGuard extends AuthGuard('protect') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        console.log(`canActivate - chạy đầu tiên`)

        const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
        console.log({ isPublic })

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        console.log(`handleRequest - luôn luôn chạy cuối cùng`, { err, user, info })

        if (err || !user) {
            if (info instanceof TokenExpiredError) {
                throw new ForbiddenException(info.message);
            }
            throw err || new UnauthorizedException();
        }

        return user;
    }
}
