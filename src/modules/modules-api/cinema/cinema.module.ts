import { Module } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CinemaController } from './cinema.controller';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Module({
  controllers: [CinemaController],
  providers: [CinemaService, PrismaService],
  exports: [CinemaService],
})
export class CinemaModule { }
