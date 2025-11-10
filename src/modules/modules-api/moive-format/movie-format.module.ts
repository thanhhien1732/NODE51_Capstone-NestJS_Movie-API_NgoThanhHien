import { Module } from '@nestjs/common';
import { MovieFormatController } from './movie-format.controller';
import { MovieFormatService } from './movie-format.service';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Module({
  controllers: [MovieFormatController],
  providers: [MovieFormatService, PrismaService],
})
export class MoveFormatModule { }
