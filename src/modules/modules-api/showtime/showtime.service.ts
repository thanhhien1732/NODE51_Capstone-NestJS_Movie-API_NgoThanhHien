import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { FindAllShowtimeDto } from './dto/find-all-showtime.dto';
import { calculateBasePrice } from 'src/common/helpers/calculate-price.showtime.helper';
import { calculateDurationMinutes } from 'src/common/helpers/calculate-minute.showtime.helper';

@Injectable()
export class ShowtimeService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateShowtimeDto) {
    const showtimeExist = await this.prisma.showtimes.findFirst({
      where: {
        movieId: dto.movieId,
        cinemaId: dto.cinemaId,
        roomId: dto.roomId,
        showDate: new Date(dto.showDate),
        showTimeStart: dto.showTimeStart,
        isDeleted: false,
      },
    });

    if (showtimeExist)
      throw new BadRequestException('A showtime already exists for this movie in this cinema, room and time.');

    const basePrice = await calculateBasePrice(
      this.prisma,
      dto.movieId,
      dto.cinemaId,
      dto.roomId,
      dto.formatId,
    );

    const durationMinutes = calculateDurationMinutes(dto.showTimeStart, dto.showTimeEnd);

    const showtime = await this.prisma.showtimes.create({
      data: {
        movieId: dto.movieId,
        formatId: dto.formatId,
        cinemaId: dto.cinemaId,
        roomId: dto.roomId,
        showDate: dto.showDate ? new Date(dto.showDate) : null,
        showTimeStart: dto.showTimeStart ?? '00:00',
        showTimeEnd: dto.showTimeEnd ?? '00:00',
        durationMinutes,
        basePrice
      },
      include: {
        Movies: { select: { movieName: true } },
        Cinemas: { select: { cinemaName: true } },
        Rooms: { select: { roomName: true } },
        MovieFormats: { select: { formatName: true } },
      },
    });

    return {
      showtimeId: showtime.showtimeId,
      movieName: showtime.Movies?.movieName,
      cinemaName: showtime.Cinemas?.cinemaName,
      roomName: showtime.Rooms?.roomName,
      formatName: showtime.MovieFormats?.formatName,
      basePrice: showtime.basePrice,
      showDate: showtime.showDate,
      showTimeStart: showtime.showTimeStart,
      showTimeEnd: showtime.showTimeEnd,
      durationMinutes: showtime.durationMinutes,
      createdAt: showtime.createdAt,
    };
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllShowtimeDto) {
    const { page, pageSize, movieId, cinemaId, formatId, roomId, showDate, showTimeStart } = query;

    const where = {
      isDeleted: false,
      ...(movieId ? { movieId: Number(movieId) } : {}),
      ...(cinemaId ? { cinemaId: Number(cinemaId) } : {}),
      ...(formatId ? { formatId: Number(formatId) } : {}),
      ...(roomId ? { roomId: Number(roomId) } : {}),
      ...(showDate ? { showDate: new Date(showDate) } : {}),
      ...(showTimeStart ? { showTimeStart: { contains: showTimeStart } } : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.showtimes.findMany({
        where,
        skip,
        take,
        include: {
          Movies: { select: { movieName: true } },
          Cinemas: { select: { cinemaName: true } },
          Rooms: { select: { roomName: true } },
          MovieFormats: { select: { formatName: true } },
        },
        orderBy: { showtimeId: 'desc' },
      }),
      this.prisma.showtimes.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      items: items.map((s) => ({
        showtimeId: s.showtimeId,
        movieName: s.Movies?.movieName ?? null,
        formatName: s.MovieFormats?.formatName ?? null,
        cinemaName: s.Cinemas?.cinemaName ?? null,
        roomName: s.Rooms?.roomName ?? null,
        basePrice: s.basePrice,
        showDate: s.showDate,
        showTimeStart: s.showTimeStart,
        showTimeEnd: s.showTimeEnd,
        durationMinutes: s.durationMinutes,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const showtimeExist = await this.prisma.showtimes.findUnique({
      where: { showtimeId: id },
      include: {
        Movies: { select: { movieName: true } },
        Cinemas: { select: { cinemaName: true } },
        Rooms: { select: { roomName: true } },
        MovieFormats: { select: { formatName: true } },
      },
    });

    if (!showtimeExist || showtimeExist.isDeleted)
      throw new NotFoundException('Showtime not found!');

    return {
      showtimeId: showtimeExist.showtimeId,
      movieName: showtimeExist.Movies?.movieName ?? null,
      formatName: showtimeExist.MovieFormats?.formatName ?? null,
      cinemaName: showtimeExist.Cinemas?.cinemaName ?? null,
      roomName: showtimeExist.Rooms?.roomName ?? null,
      basePrice: showtimeExist.basePrice,
      showDate: showtimeExist.showDate,
      showTimeStart: showtimeExist.showTimeStart,
      showTimeEnd: showtimeExist.showTimeEnd,
      durationMinutes: showtimeExist.durationMinutes,
      createdAt: showtimeExist.createdAt,
      updatedAt: showtimeExist.updatedAt,
    };
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateShowtimeDto) {
    const showtimeExist = await this.prisma.showtimes.findUnique({
      where: { showtimeId: id },
    });

    if (!showtimeExist || showtimeExist.isDeleted)
      throw new NotFoundException('Showtime not found!');

    const movieId = dto.movieId ?? showtimeExist.movieId;
    const cinemaId = dto.cinemaId ?? showtimeExist.cinemaId;
    const roomId = dto.roomId ?? showtimeExist.roomId;
    const formatId = dto.formatId ?? showtimeExist.formatId;
    const showDate = dto.showDate ? new Date(dto.showDate) : showtimeExist.showDate;
    const start = dto.showTimeStart ?? showtimeExist.showTimeStart;
    const end = dto.showTimeEnd ?? showtimeExist.showTimeEnd;

    const duplicate = await this.prisma.showtimes.findFirst({
      where: {
        movieId: movieId,
        cinemaId: cinemaId,
        roomId: roomId,
        showDate: showDate,
        showTimeStart: start,
        isDeleted: false,
        NOT: { showtimeId: id },
      },
    });

    if (duplicate) throw new BadRequestException('This showtime already exists for the same cinema, room and time slot!');

    const durationMinutes = calculateDurationMinutes(start, end);

    let basePrice = showtimeExist.basePrice;

    if (
      movieId != null &&
      formatId != null &&
      cinemaId != null &&
      roomId != null
    ) {
      basePrice = await calculateBasePrice(
        this.prisma,
        movieId,
        formatId,
        cinemaId,
        roomId,
      );
    }

    const updated = await this.prisma.showtimes.update({
      where: { showtimeId: id },
      data: {
        movieId,
        formatId,
        cinemaId,
        roomId,
        showDate,
        showTimeStart: start,
        showTimeEnd: end,
        durationMinutes,
        basePrice,
      },
      include: {
        Movies: { select: { movieName: true } },
        Cinemas: { select: { cinemaName: true } },
        Rooms: { select: { roomName: true } },
        MovieFormats: { select: { formatName: true } },
      },
    });

    return {
      showtimeId: updated.showtimeId,
      movieName: updated.Movies?.movieName ?? null,
      formatName: updated.MovieFormats?.formatName ?? null,
      cinemaName: updated.Cinemas?.cinemaName ?? null,
      roomName: updated.Rooms?.roomName ?? null,
      basePrice: updated.basePrice,
      showDate: updated.showDate,
      showTimeStart: updated.showTimeStart,
      showTimeEnd: updated.showTimeEnd,
      durationMinutes: updated.durationMinutes,
      updatedAt: updated.updatedAt,
    };
  };

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const showtimeExist = await this.prisma.showtimes.findUnique({
      where: { showtimeId: id },
    });
    if (!showtimeExist) throw new NotFoundException('Showtime not found!');
    if (showtimeExist.isDeleted)
      throw new BadRequestException('Showtime already deleted!');

    const deleted = await this.prisma.showtimes.update({
      where: { showtimeId: id },
      data: { isDeleted: true, deletedAt: new Date() },
      include: {
        Movies: { select: { movieName: true } },
        Cinemas: { select: { cinemaName: true } },
        Rooms: { select: { roomName: true } },
        MovieFormats: { select: { formatName: true } },
      },
    });

    return {
      showtimeId: deleted.showtimeId,
      movieName: deleted.Movies?.movieName ?? null,
      formatName: deleted.MovieFormats?.formatName ?? null,
      cinemaName: deleted.Cinemas?.cinemaName ?? null,
      roomName: deleted.Rooms?.roomName ?? null,
      basePrice: deleted.basePrice,
      showDate: deleted.showDate,
      showTimeStart: deleted.showTimeStart,
      showTimeEnd: deleted.showTimeEnd,
      durationMinutes: deleted.durationMinutes,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    };
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const showtimeExist = await this.prisma.showtimes.findUnique({
      where: { showtimeId: id },
    });

    if (!showtimeExist) throw new NotFoundException('Showtime not found!');

    if (!showtimeExist.isDeleted) throw new BadRequestException('Showtime is not deleted!');

    const restored = await this.prisma.showtimes.update({
      where: { showtimeId: id },
      data: { isDeleted: false, deletedAt: null },
      include: {
        Movies: { select: { movieName: true } },
        Cinemas: { select: { cinemaName: true } },
        Rooms: { select: { roomName: true } },
        MovieFormats: { select: { formatName: true } },
      },
    });

    return {
      showtimeId: restored.showtimeId,
      movieName: restored.Movies?.movieName ?? null,
      formatName: restored.MovieFormats?.formatName ?? null,
      cinemaName: restored.Cinemas?.cinemaName ?? null,
      roomName: restored.Rooms?.roomName ?? null,
      basePrice: restored.basePrice,
      showDate: restored.showDate,
      showTimeStart: restored.showTimeStart,
      showTimeEnd: restored.showTimeEnd,
      durationMinutes: restored.durationMinutes,
      isDeleted: restored.isDeleted,
      deletedAt: restored.deletedAt,
    };
  }
}
