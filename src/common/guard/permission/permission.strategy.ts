import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from 'generated/prisma';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class PermissionStrategy extends PassportStrategy(Strategy, 'permission') {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async validate(req: Request & { user: Users }) {
        console.log(`GUARD ----- PERMISSION - validate`)

        const user = req?.user
        if (!user) {
            console.log(`User Not Found In Protect`)
            throw new BadRequestException("User Not Found")
        }

        if (user.roleId === 1) {

            return user;
        }

        if (!user.roleId) {
            throw new BadRequestException('User has no assigned role');
        }

        const method = req.method

        const endpoint = req.baseUrl + req.route?.path

        const rolePermissionExist = await this.prisma.rolePermission.findFirst({
            where: {
                roleId: user.roleId,
                Permissions: {
                    endpoint: endpoint,
                    method: method,
                },

                isActive: true
            }
        })

        if (!rolePermissionExist) {
            throw new BadRequestException("User not Permission")
        }

        return user;
    }
}
