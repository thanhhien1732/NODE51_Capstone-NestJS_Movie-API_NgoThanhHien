import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './booking-payment.service';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { InitiatePaymentDto } from './dto/initiate-booking-payment.dto';
import { CallbackPaymentDto } from './dto/callback-booking-payment.dto';

@ApiTags('Payment')
@Controller('payment')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  // ------------------ INITIATE PAYMENT ------------------
  @Post('initiate')
  @ApiOperation({ summary: 'Initiate payment for a booking (mock gateway)' })
  @ApiQuery({ name: 'returnUrl', required: false, example: 'https://your-frontend.com/payment/result' })
  @MessageResponse('Payment initiated successfully!')
  initiate(@Query() body: InitiatePaymentDto, @Query('returnUrl') returnUrl?: string) {
    return this.paymentService.initiatePayment(body.bookingId, body.method ?? 'MOMO', returnUrl);
  }

  // ------------------ HANDLE PAYMENT CALLBACK ------------------
  @Post('callback')
  @ApiOperation({ summary: 'Payment gateway callback (webhook)' })
  @MessageResponse('Payment callback processed!')
  callback(@Query() payload: CallbackPaymentDto) {
    return this.paymentService.handlePaymentCallback(payload);
  }

  // ------------------ GET PAYMENT STATUS ------------------
  @Get(':bookingId/status')
  @ApiOperation({ summary: 'Get payment status of a booking' })
  @MessageResponse('Payment status fetched!')
  status(@Param('bookingId') bookingId: string) {
    return this.paymentService.getPaymentStatus(Number(bookingId));
  }
}
