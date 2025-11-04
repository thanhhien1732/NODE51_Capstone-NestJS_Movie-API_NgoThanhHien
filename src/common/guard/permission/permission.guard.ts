import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { SKIP_PERMISSION } from 'src/common/decorators/skip-permission.decorator';

@Injectable()
export class PermissionGuard extends AuthGuard('permission') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        console.log(`GUARD ----- PERMISSION - canActivate`)

        const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
        console.log({ isPublic })

        if (isPublic) {
            return true;
        }

        const isSkipPermission = this.reflector.get(SKIP_PERMISSION, context.getHandler());
        console.log({ isSkipPermission })

        if (isSkipPermission) {
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        console.log(`GUARD ----- PERMISSION- handleRequest`, { err, user, info })

        if (err || !user) {
            throw err || new UnauthorizedException();
        }

        return user;
    }
}
