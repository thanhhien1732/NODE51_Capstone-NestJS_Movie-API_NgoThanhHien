import { Module } from '@nestjs/common';
import { SoundSystemService } from './room-sound.service';
import { SoundSystemController } from './room-sound.controller';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Module({
  controllers: [SoundSystemController],
  providers: [SoundSystemService, PrismaService],
})
export class SoundSystemModule { }
