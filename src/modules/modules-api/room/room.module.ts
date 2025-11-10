import { Module } from '@nestjs/common';
import { RoomsService } from './room.service';
import { RoomsController } from './room.controller';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService],
})
export class RoomsModule { }
