import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/modules/modules-system/token/token.module';
import { PrismaModule } from 'src/modules/modules-system/prisma/prisma.module';

@Module({
  imports: [TokenModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
