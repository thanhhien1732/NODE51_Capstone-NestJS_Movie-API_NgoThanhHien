import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateCinemaAreaDto } from './dto/create-cinema-area.dto';
import { UpdateCinemaAreaDto } from './dto/update-cinema-area.dto';
import { FindAllCinemaAreaDto } from './dto/find-all-cinema-area.dto';

@Injectable()
export class CinemaAreaService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateCinemaAreaDto) {
    const exists = await this.prisma.cinemaAreas.findFirst({
      where: { areaName: dto.areaName, isDeleted: false },
    });
    if (exists) throw new BadRequestException('This cinema area already exists');

    return this.prisma.cinemaAreas.create({ data: dto });
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllCinemaAreaDto) {
    const { page, pageSize, keyword } = query;

    const where = {
      isDeleted: false,
      ...(keyword ? { areaName: { contains: keyword } } : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.cinemaAreas.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.cinemaAreas.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items,
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const area = await this.prisma.cinemaAreas.findUnique({ where: { areaId: id } });
    if (!area || area.isDeleted) throw new NotFoundException('Cinema area not found');
    return area;
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateCinemaAreaDto) {
    const area = await this.prisma.cinemaAreas.findUnique({ where: { areaId: id } });
    if (!area || area.isDeleted) throw new NotFoundException('Cinema area not found');

    if (dto.areaName) {
      const duplicate = await this.prisma.cinemaAreas.findFirst({
        where: {
          areaName: dto.areaName,
          isDeleted: false,
          NOT: { areaId: id },
        },
      });

      if (duplicate)
        throw new BadRequestException('A cinema area with this name already exists!');
    }

    await this.prisma.cinemaAreas.update({
      where: { areaId: id },
      data: dto,
    });

    return this.prisma.cinemaAreas.update({
      where: { areaId: id },
      data: {
        ...(dto.areaName ? { areaName: dto.areaName } : {}),
        updatedAt: new Date(),
      },
    });
  }

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const area = await this.prisma.cinemaAreas.findUnique({ where: { areaId: id } });
    if (!area) throw new NotFoundException('Cinema area not found');
    if (area.isDeleted) throw new BadRequestException('This area has already been deleted');

    return this.prisma.cinemaAreas.update({
      where: { areaId: id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const area = await this.prisma.cinemaAreas.findUnique({ where: { areaId: id } });
    if (!area) throw new NotFoundException('Cinema area not found');
    if (!area.isDeleted) throw new BadRequestException('This area is not deleted');

    return this.prisma.cinemaAreas.update({
      where: { areaId: id },
      data: {
        isDeleted: false,
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  }
}
