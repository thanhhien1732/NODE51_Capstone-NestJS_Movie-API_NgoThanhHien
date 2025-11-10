import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FindAllBookingDto } from './dto/find-all-booking.dto';
import { $Enums } from 'generated/prisma';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(userId: number, dto: CreateBookingDto) {
    const bookingExist = await this.prisma.bookings.findFirst({
      where: {
        showtimeId: dto.showtimeId,
        seatId: dto.seatId,
        isBooked: true,
        paymentStatus: { in: ['PENDING', 'PAID'] },
      },
    });

    if (bookingExist) throw new BadRequestException('This seat is already booked for this showtime!');

    const showtime = await this.prisma.showtimes.findUnique({
      where: { showtimeId: dto.showtimeId },
    });

    const seat = await this.prisma.seats.findUnique({
      where: { seatId: dto.seatId },
      include: { SeatTypes: true },
    });

    if (!showtime || !seat) throw new NotFoundException('Invalid showtime or seat ID!');

    const seatMultiplier = Number(seat.SeatTypes?.multiplier ?? 1);
    const seatPrice = Math.round(Number(showtime.basePrice) * seatMultiplier);

    const booking = await this.prisma.bookings.create({
      data: {
        userId,
        showtimeId: dto.showtimeId,
        seatId: dto.seatId,
        seatPrice,
        isBooked: true,
        paymentStatus: 'PENDING',
        bookingDateTime: new Date(),
      },
      include: {
        Users: { select: { fullName: true, email: true } },
        Showtimes: {
          select: {
            Movies: { select: { movieName: true } },
            Cinemas: { select: { cinemaName: true, address: true } },
            Rooms: { select: { roomName: true } },
            showDate: true,
            showTimeStart: true,
            showTimeEnd: true,
            durationMinutes: true,
          },
        },
        Seats: {
          select: {
            seatName: true,
            SeatTypes: { select: { seatTypeName: true } }
          },
        },
      },
    });

    return {
      bookingId: booking.bookingId,
      userName: booking.Users?.fullName ?? null,
      movieName: booking.Showtimes.Movies?.movieName ?? null,
      cinemaName: booking.Showtimes.Cinemas?.cinemaName ?? null,
      cinemaAddress: booking.Showtimes.Cinemas?.address ?? null,
      roomName: booking.Showtimes.Rooms?.roomName ?? null,
      seatName: booking.Seats?.seatName ?? null,
      seatType: booking.Seats?.SeatTypes?.seatTypeName ?? null,
      showDate: booking.Showtimes?.showDate,
      showTimeStart: booking.Showtimes?.showTimeStart,
      showTimeEnd: booking.Showtimes?.showTimeEnd,
      durationMinutes: booking.Showtimes?.durationMinutes,
      seatPrice: booking.seatPrice,
      paymentStatus: booking.paymentStatus,
      isBooked: booking.isBooked,
      bookingDateTime: booking.bookingDateTime,
    };
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllBookingDto) {
    const { page, pageSize, userId, showtimeId, paymentStatus } = query;

    const where = {
      ...(userId ? { userId: Number(userId) } : {}),
      ...(showtimeId ? { showtimeId: Number(showtimeId) } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (page - 1) * pageSize : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.bookings.findMany({
        where,
        skip,
        take,
        include: {
          Users: { select: { fullName: true } },
          Showtimes: {
            select: {
              Movies: { select: { movieName: true } },
              Cinemas: { select: { cinemaName: true, address: true } },
              Rooms: { select: { roomName: true } },
              showDate: true,
              showTimeStart: true,
              showTimeEnd: true,
              durationMinutes: true,
            },
          },
          Seats: {
            select: {
              seatName: true,
              SeatTypes: { select: { seatTypeName: true } }
            },
          },
        },
        orderBy: { bookingId: 'desc' },
      }),
      this.prisma.bookings.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      items: items.map(i => ({
        bookingId: i.bookingId,
        userName: i.Users?.fullName ?? null,
        movieName: i.Showtimes.Movies?.movieName ?? null,
        cinemaName: i.Showtimes.Cinemas?.cinemaName ?? null,
        cinemaAddress: i.Showtimes.Cinemas?.address ?? null,
        roomName: i.Showtimes.Rooms?.roomName ?? null,
        seatName: i.Seats?.seatName ?? null,
        seatType: i.Seats.SeatTypes?.seatTypeName ?? null,
        showDate: i.Showtimes?.showDate ?? null,
        showTimeStart: i.Showtimes?.showTimeStart ?? null,
        showTimeEnd: i.Showtimes?.showTimeStart,
        durationMinutes: i.Showtimes?.durationMinutes,
        seatPrice: i.seatPrice,
        paymentStatus: i.paymentStatus,
        isBooked: i.isBooked,
        bookingDateTime: i.bookingDateTime,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const bookingExist = await this.prisma.bookings.findUnique({
      where: { bookingId: id },
      include: {
        Users: { select: { fullName: true, email: true } },
        Showtimes: {
          select: {
            Movies: { select: { movieName: true } },
            Cinemas: { select: { cinemaName: true, address: true } },
            Rooms: { select: { roomName: true } },
            showDate: true,
            showTimeStart: true,
            showTimeEnd: true,
            durationMinutes: true,
          },
        },
        Seats: {
          select: {
            seatName: true,
            SeatTypes: { select: { seatTypeName: true } }
          },
        },
      },
    });

    if (!bookingExist) throw new NotFoundException('Booking not found!');

    return {
      bookingId: bookingExist.bookingId,
      userName: bookingExist.Users?.fullName ?? null,
      movieName: bookingExist.Showtimes.Movies?.movieName ?? null,
      cinemaName: bookingExist.Showtimes.Cinemas?.cinemaName ?? null,
      cinemaAddress: bookingExist.Showtimes.Cinemas?.address ?? null,
      roomName: bookingExist.Showtimes.Rooms?.roomName ?? null,
      seatName: bookingExist.Seats?.seatName ?? null,
      seatType: bookingExist.Seats.SeatTypes?.seatTypeName ?? null,
      showDate: bookingExist.Showtimes?.showDate ?? null,
      showTimeStart: bookingExist.Showtimes?.showTimeStart ?? null,
      showTimeEnd: bookingExist.Showtimes?.showTimeStart,
      durationMinutes: bookingExist.Showtimes?.durationMinutes,
      seatPrice: bookingExist.seatPrice,
      paymentStatus: bookingExist.paymentStatus,
      isBooked: bookingExist.isBooked,
      bookingDateTime: bookingExist.bookingDateTime,
    };
  }

  // ------------------ CANCEL ------------------
  async cancel(id: number) {
    const bookingExist = await this.prisma.bookings.findUnique({
      where: { bookingId: id },
    });

    if (!bookingExist) throw new NotFoundException('Booking not found!');

    if (!bookingExist.isBooked)
      throw new BadRequestException('This booking has already been canceled!');

    if (bookingExist.paymentStatus === 'PAID')
      throw new BadRequestException('Cannot cancel a paid booking!');

    const canceled = await this.prisma.bookings.update({
      where: { bookingId: id },
      data: {
        isBooked: false,
        paymentStatus: 'CANCELED',
        bookingDateTime: null,
      },
      include: {
        Users: { select: { fullName: true } },
        Showtimes: {
          select: {
            Movies: { select: { movieName: true } },
            Cinemas: { select: { cinemaName: true, address: true } },
            Rooms: { select: { roomName: true } },
            showDate: true,
            showTimeStart: true,
            showTimeEnd: true,
            durationMinutes: true,
          },
        },
        Seats: {
          select: {
            seatName: true,
            SeatTypes: { select: { seatTypeName: true } }
          },
        },
      },
    });

    return {
      bookingId: canceled.bookingId,
      userName: canceled.Users?.fullName ?? null,
      movieName: canceled.Showtimes.Movies?.movieName ?? null,
      cinemaName: canceled.Showtimes.Cinemas?.cinemaName ?? null,
      cinemaAddress: canceled.Showtimes.Cinemas?.address ?? null,
      roomName: canceled.Showtimes.Rooms?.roomName ?? null,
      seatName: canceled.Seats?.seatName ?? null,
      seatType: canceled.Seats.SeatTypes?.seatTypeName ?? null,
      showDate: canceled.Showtimes?.showDate ?? null,
      showTimeStart: canceled.Showtimes?.showTimeStart ?? null,
      showTimeEnd: canceled.Showtimes?.showTimeStart,
      durationMinutes: canceled.Showtimes?.durationMinutes,
      seatPrice: canceled.seatPrice,
      paymentStatus: canceled.paymentStatus,
      isBooked: canceled.isBooked,
      bookingDateTime: canceled.bookingDateTime,
    };
  }
}
