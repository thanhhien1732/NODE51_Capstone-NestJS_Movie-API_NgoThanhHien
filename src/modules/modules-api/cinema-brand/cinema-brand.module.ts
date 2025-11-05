import { Module } from '@nestjs/common';
import { CinemaBrandService } from './cinema-brand.service';
import { CinemaBrandController } from './cinema-brand.controller';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Module({
  controllers: [CinemaBrandController],
  providers: [CinemaBrandService, PrismaService],
})
export class CinemaBrandModule { }
