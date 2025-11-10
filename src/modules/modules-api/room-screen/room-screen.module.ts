import { Module } from '@nestjs/common';
import { ScreenTechService } from './room-screen.service';
import { ScreenTechController } from './room-screen.controller';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Module({
  controllers: [ScreenTechController],
  providers: [ScreenTechService, PrismaService],
})
export class ScreenTechModule { }
