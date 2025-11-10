import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { BookingExpirationJob } from 'src/common/jobs/booking-expiration.job';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService, BookingExpirationJob],
})
export class BookingModule { }
