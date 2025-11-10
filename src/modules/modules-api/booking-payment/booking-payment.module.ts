import { Module } from '@nestjs/common';
import { PaymentController } from './booking-payment.controller';
import { PaymentService } from './booking-payment.service';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService],
  exports: [PaymentService],
})
export class PaymentModule { }
