import { Module } from '@nestjs/common';
import { TokenModule } from 'src/modules/modules-system/token/token.module';
import { PrismaModule } from 'src/modules/modules-system/prisma/prisma.module';
import { UsersController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TokenModule, PrismaModule],
  controllers: [UsersController],
  providers: [UserService],
})
export class UserModule { }
