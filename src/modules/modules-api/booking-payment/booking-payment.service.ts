import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { $Enums } from 'generated/prisma';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ INITIATE PAYMENT ------------------
  async initiatePayment(bookingId: number,
    method: 'ATM_CARD' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MOMO' | 'ZALOPAY' | 'VNPAY' | 'SHOPEEPAY' | 'APPLEPAY',
    returnUrl?: string) {
    const booking = await this.prisma.bookings.findUnique({ where: { bookingId } });

    if (!booking) throw new NotFoundException('Booking not found');

    // Không khởi tạo nếu đã thanh toán
    if (booking.paymentStatus === 'PAID') {
      throw new BadRequestException('Booking already paid!');
    }

    if (booking.paymentStatus === 'CANCELED') {
      throw new BadRequestException('Booking already canceled!');
    }

    // Đánh dấu đang chờ thanh toán
    await this.prisma.bookings.update({
      where: { bookingId },
      data: {
        paymentStatus: $Enums.Bookings_paymentStatus.PENDING,
        paymentMethod: method,
      },
    });

    // Giả lập “paymentUrl” cho frontend redirect (thực tế sẽ tạo URL từ gateway)
    const paymentUrl = returnUrl ?? `https://fake-gateway.local/pay?bookingId=${bookingId}&method=${method}&seatPrice=${booking.seatPrice}`;

    return {
      bookingId,
      seatPrice: booking.seatPrice,
      method,
      paymentUrl,
    };
  }

  // ------------------ HANDLE PAYMENT CALLBACK ------------------
  async handlePaymentCallback(payload: {
    bookingId: number;
    transactionId: string;
    resultCode: number; // 0: success
    method?: 'ATM_CARD' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MOMO' | 'ZALOPAY' | 'VNPAY' | 'SHOPEEPAY' | 'APPLEPAY';
    signature?: string;
  }) {
    const { bookingId, transactionId, resultCode, method } = payload;

    const booking = await this.prisma.bookings.findUnique({ where: { bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    if (resultCode === 0) {
      // Thành công
      const updated = await this.prisma.bookings.update({
        where: { bookingId },
        data: {
          paymentStatus: $Enums.Bookings_paymentStatus.PAID,
          isBooked: true,
          transactionId,
          paymentMethod: method ?? booking.paymentMethod ?? 'MOMO',
          paidAt: new Date(),
        },
      });
      return { bookingId, status: updated.paymentStatus, transactionId };
    }

    // Thất bại
    const updated = await this.prisma.bookings.update({
      where: { bookingId },
      data: {
        paymentStatus: $Enums.Bookings_paymentStatus.CANCELED,
        transactionId,
      },
    });

    return { bookingId, status: updated.paymentStatus, transactionId };
  }

  // ------------------ GET PAYMENT STATUS ------------------
  async getPaymentStatus(bookingId: number) {
    const booking = await this.prisma.bookings.findUnique({
      where: { bookingId },
      select: {
        bookingId: true,
        paymentStatus: true,
        paymentMethod: true,
        transactionId: true,
        paidAt: true,
        isBooked: true,
        bookingDateTime: true,
        seatPrice: true,
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
