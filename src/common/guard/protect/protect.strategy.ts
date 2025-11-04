import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ACCESS_TOKEN_SECRET } from 'src/common/constant/app.constant';
import { Users } from 'generated/prisma';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Injectable()
export class ProtectStrategy extends PassportStrategy(Strategy, 'protect') {
    constructor(private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: ACCESS_TOKEN_SECRET,
        });
    }

    async validate({ userId }: { userId: Users['userId'] }) {
        const user = await this.prisma.users.findUnique({
            where: {
                userId: userId
            }
        })

        if (!user || user.isDeleted) {
            throw new UnauthorizedException('Account has been disabled or does not exist');
        }

        console.log(`validate`, user)

        return user;
    }
}
