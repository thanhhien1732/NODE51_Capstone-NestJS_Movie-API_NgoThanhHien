import { Module } from '@nestjs/common';
import { CinemaAreaService } from './cinema-area.service';
import { CinemaAreaController } from './cinema-area.controller';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Module({
  controllers: [CinemaAreaController],
  providers: [CinemaAreaService, PrismaService],
})
export class CinemaAreaModule { }
