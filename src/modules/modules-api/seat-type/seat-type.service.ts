import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateSeatTypeDto } from './dto/create-seat-type.dto';
import { UpdateSeatTypeDto } from './dto/update-seat-type.dto';
import { FindAllSeatTypeDto } from './dto/find-all-seat-type.dto';

@Injectable()
export class SeatTypeService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateSeatTypeDto) {
    const seatTypeExist = await this.prisma.seatTypes.findFirst({
      where: { seatTypeName: dto.seatTypeName, isDeleted: false },
    });

    if (seatTypeExist) throw new BadRequestException('Seat type name already exists!');

    const newSeatType = await this.prisma.seatTypes.create({ data: dto });

    return {
      id: newSeatType.seatTypeId,
      name: newSeatType.seatTypeName,
      multiplier: newSeatType.multiplier,
      createdAt: newSeatType.createdAt,
    };
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllSeatTypeDto) {
    const { page, pageSize, keyword } = query;

    const where = {
      isDeleted: false,
      ...(keyword ? { seatTypeName: { contains: keyword } } : {}),
    };

    const hasPagination = !!(page && pageSize);
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.seatTypes.findMany({
        where,
        skip,
        take,
        orderBy: { seatTypeId: 'desc' },
      }),
      this.prisma.seatTypes.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items: items.map(i => ({
        id: i.seatTypeId,
        name: i.seatTypeName,
        multiplier: i.multiplier,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const seatTypeExist = await this.prisma.seatTypes.findUnique({ where: { seatTypeId: id } });

    if (!seatTypeExist || seatTypeExist.isDeleted) throw new NotFoundException('Seat type not found');

    return {
      id: seatTypeExist.seatTypeId,
      name: seatTypeExist.seatTypeName,
      multiplier: seatTypeExist.multiplier,
      createdAt: seatTypeExist.createdAt,
      updatedAt: seatTypeExist.updatedAt,
    };
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateSeatTypeDto) {
    const seatTypeExist = await this.prisma.seatTypes.findUnique({ where: { seatTypeId: id } });

    if (!seatTypeExist || seatTypeExist.isDeleted) throw new NotFoundException('Seat type not found');

    if (dto.seatTypeName) {
      const duplicate = await this.prisma.seatTypes.findFirst({
        where: {
          seatTypeName: dto.seatTypeName,
          isDeleted: false,
          NOT: { seatTypeId: id }
        },
      });

      if (duplicate) throw new BadRequestException('Seat type name already exists!');
    }

    const updated = await this.prisma.seatTypes.update({
      where: { seatTypeId: id },
      data: dto,
    });

    return {
      id: updated.seatTypeId,
      name: updated.seatTypeName,
      multiplier: updated.multiplier,
      updatedAt: updated.updatedAt,
    };
  }

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const seatTypeExist = await this.prisma.seatTypes.findUnique({ where: { seatTypeId: id } });

    if (!seatTypeExist) throw new NotFoundException('Seat type not found');

    if (seatTypeExist.isDeleted) throw new BadRequestException('Seat type already deleted');

    const deleted = await this.prisma.seatTypes.update({
      where: { seatTypeId: id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return {
      id: deleted.seatTypeId,
      name: deleted.seatTypeName,
      multiplier: deleted.multiplier,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    };
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const seatTypeExist = await this.prisma.seatTypes.findUnique({ where: { seatTypeId: id } });

    if (!seatTypeExist) throw new NotFoundException('Seat type not found');

    if (!seatTypeExist.isDeleted) throw new BadRequestException('Seat type is not deleted');

    const restored = await this.prisma.seatTypes.update({
      where: { seatTypeId: id },
      data: { isDeleted: false, deletedAt: null },
    });

    return {
      id: restored.seatTypeId,
      name: restored.seatTypeName,
      multiplier: restored.multiplier,
      isDeleted: restored.isDeleted,
      deletedAt: restored.deletedAt,
    };
  }
}
