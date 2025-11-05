import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/modules-system/prisma/prisma.module';
import { TokenModule } from './modules/modules-system/token/token.module';
import { ProtectStrategy } from './common/guard/protect/protect.strategy';
import { PermissionStrategy } from './common/guard/permission/permission.strategy';
import { AuthModule } from './modules/modules-api/auth/auth.module';
import { UserModule } from './modules/modules-api/user/user.module';
import { RoleModule } from './modules/modules-api/role/role.module';
import { PermissionModule } from './modules/modules-api/permission/permission.module';
import { CinemaModule } from './modules/modules-api/cinema/cinema.module';
import { CinemaBrandModule } from './modules/modules-api/cinema-brand/cinema-brand.module';
import { CinemaAreaModule } from './modules/modules-api/cinema-area/cinema-area.module';

@Module({
  imports: [PrismaModule, TokenModule, AuthModule, UserModule, RoleModule, PermissionModule, CinemaModule, CinemaBrandModule, CinemaAreaModule],
  controllers: [AppController],
  providers: [AppService, ProtectStrategy, PermissionStrategy],
})
export class AppModule { }
