import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { FindAllSeatDto } from './dto/find-all-seat.dto';

@Injectable()
export class SeatService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateSeatDto) {
    const seatExist = await this.prisma.seats.findFirst({
      where: {
        seatName: dto.seatName,
        rowLabel: dto.rowLabel,
        isDeleted: false,
      },
    });

    if (seatExist) throw new BadRequestException('Seat name already exists in this row!');

    const newSeat = await this.prisma.seats.create({
      data: dto,
      include: {
        SeatTypes: { select: { seatTypeName: true } },
      },
    });

    return {
      seatId: newSeat.seatId,
      seatName: newSeat.seatName,
      rowLabel: newSeat.rowLabel,
      columnIndex: newSeat.columnIndex,
      seatTypeName: newSeat.SeatTypes?.seatTypeName ?? null,
      createdAt: newSeat.createdAt,
    }
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllSeatDto) {
    const { page, pageSize, keyword, seatTypeId } = query;

    const where = {
      isDeleted: false,
      ...(keyword ? { seatName: { contains: keyword } } : {}),
      ...(seatTypeId ? { seatTypeId: Number(seatTypeId) } : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.seats.findMany({
        where,
        skip,
        take,
        include: { SeatTypes: true },
        orderBy: { seatId: 'desc' },
      }),
      this.prisma.seats.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items: items.map(i => ({
        seatId: i.seatId,
        seatName: i.seatName,
        rowLabel: i.rowLabel,
        columnIndex: i.columnIndex,
        seatTypeName: i.SeatTypes?.seatTypeName ?? null,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const seatExist = await this.prisma.seats.findUnique({
      where: { seatId: id },
      include: { SeatTypes: true },
    });

    if (!seatExist || seatExist.isDeleted) throw new NotFoundException('Seat not found');

    return {
      seatId: seatExist.seatId,
      seatName: seatExist.seatName,
      rowLabel: seatExist.rowLabel,
      columnIndex: seatExist.columnIndex,
      seatTypeName: seatExist.SeatTypes?.seatTypeName ?? null,
      createdAt: seatExist.createdAt,
      updatedAt: seatExist.updatedAt,
    };
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateSeatDto) {
    const seatExist = await this.prisma.seats.findUnique({ where: { seatId: id } });

    if (!seatExist || seatExist.isDeleted) throw new NotFoundException('Seat not found');

    if (dto.seatName) {
      const duplicate = await this.prisma.seats.findFirst({
        where: {
          seatName: dto.seatName,
          rowLabel: dto.rowLabel,
          isDeleted: false,
          NOT: { seatId: id },
        },
      });

      if (duplicate)
        throw new BadRequestException('Seat name already exists in this row!');
    }

    const updated = await this.prisma.seats.update({
      where: { seatId: id },
      data: dto,
      include: {
        SeatTypes: { select: { seatTypeName: true } },
      },
    });

    return {
      seatId: updated.seatId,
      seatName: updated.seatName,
      rowLabel: updated.rowLabel,
      columnIndex: updated.columnIndex,
      seatTypeName: updated.SeatTypes?.seatTypeName ?? null,
      updatedAt: updated.updatedAt,
    };
  }

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const seatExist = await this.prisma.seats.findUnique({
      where: { seatId: id }
    });

    if (!seatExist) throw new NotFoundException('Seat not found');

    if (seatExist.isDeleted) throw new BadRequestException('Seat already deleted');

    const deleted = await this.prisma.seats.update({
      where: { seatId: id },
      data: { isDeleted: true, deletedAt: new Date() },
      include: {
        SeatTypes: { select: { seatTypeName: true } },
      },
    });

    return {
      seatId: deleted.seatId,
      seatName: deleted.seatName,
      rowLabel: deleted.rowLabel,
      columnIndex: deleted.columnIndex,
      seatTypeName: deleted.SeatTypes?.seatTypeName ?? null,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    };
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const seatExist = await this.prisma.seats.findUnique({
      where: { seatId: id }
    });

    if (!seatExist) throw new NotFoundException('Seat not found');

    if (!seatExist.isDeleted) throw new BadRequestException('Seat is not deleted');

    const restored = await this.prisma.seats.update({
      where: { seatId: id },
      data: { isDeleted: false, deletedAt: null },
      include: {
        SeatTypes: { select: { seatTypeName: true } },
      },
    });

    return {
      seatId: restored.seatId,
      seatName: restored.seatName,
      rowLabel: restored.rowLabel,
      columnIndex: restored.columnIndex,
      seatTypeName: restored.SeatTypes?.seatTypeName ?? null,
      isDeleted: restored.isDeleted,
      deletedAt: restored.deletedAt,
    };
  }
}
