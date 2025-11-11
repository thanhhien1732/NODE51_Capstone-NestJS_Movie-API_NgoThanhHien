import { Module } from '@nestjs/common';
import { UserRatingController } from './user-rating.controller';
import { UserRatingService } from './user-rating.service';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Module({
  controllers: [UserRatingController],
  providers: [UserRatingService, PrismaService],
  exports: [UserRatingService],
})
export class RatingModule { }
