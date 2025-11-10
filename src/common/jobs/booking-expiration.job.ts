import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Injectable()
export class BookingExpirationJob {
    private readonly logger = new Logger(BookingExpirationJob.name);

    constructor(private readonly prisma: PrismaService) { }

    // Chạy mỗi phút: hủy booking quá 10 phút nếu paymentStatus vẫn PENDING
    @Cron(CronExpression.EVERY_MINUTE)
    async cancelExpiredPendingBookings() {
        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

        // Tìm những booking đã “giữ ghế” >10 phút nhưng vẫn chưa thanh toán (PENDING)
        const expired = await this.prisma.bookings.findMany({
            where: {
                isBooked: true,
                paymentStatus: 'PENDING',
                bookingDateTime: { lt: tenMinutesAgo },
            },
            select: { bookingId: true },
        });

        if (!expired.length) return;

        const ids = expired.map((b) => b.bookingId);

        await this.prisma.bookings.updateMany({
            where: { bookingId: { in: ids } },
            data: {
                isBooked: false,
                paymentStatus: 'CANCELED',
                bookingDateTime: null,
            },
        });

        this.logger.log(`Canceled ${ids.length} expired bookings: [${ids.join(', ')}]`);
    }
}
