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
    const areaExist = await this.prisma.cinemaAreas.findFirst({
      where: { areaName: dto.areaName, isDeleted: false },
    });

    if (areaExist) throw new BadRequestException('This cinema area already exists');

    const newArea = await this.prisma.cinemaAreas.create({ data: dto, });

    return {
      id: newArea.areaId,
      name: newArea.areaName,
      priceAddition: newArea.priceAddition,
      createdAt: newArea.createdAt,
    }
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
        orderBy: { areaId: 'desc' },
      }),
      this.prisma.cinemaAreas.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items: items.map(i => ({
        id: i.areaId,
        name: i.areaName,
        priceAddition: i.priceAddition,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const areaExist = await this.prisma.cinemaAreas.findUnique({ where: { areaId: id } });

    if (!areaExist || areaExist.isDeleted) throw new NotFoundException('Cinema area not found');

    return {
      id: areaExist.areaId,
      name: areaExist.areaName,
      priceAddition: areaExist.priceAddition,
      createdAt: areaExist.createdAt,
      updatedAt: areaExist.updatedAt,
    };
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateCinemaAreaDto) {
    const areaExist = await this.prisma.cinemaAreas.findUnique({ where: { areaId: id } });

    if (!areaExist || areaExist.isDeleted) throw new NotFoundException('Cinema area not found');

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

    const updated = await this.prisma.cinemaAreas.update({
      where: { areaId: id },
      data: dto,
    });

    return {
      id: updated.areaId,
      name: updated.areaName,
      priceAddition: updated.priceAddition,
      updatedAt: updated.updatedAt,
    };
  }

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const areaExist = await this.prisma.cinemaAreas.findUnique({ where: { areaId: id } });

    if (!areaExist) throw new NotFoundException('Cinema area not found');

    if (areaExist.isDeleted) throw new BadRequestException('This cinema area has already been deleted');

    const deleted = await this.prisma.cinemaAreas.update({
      where: { areaId: id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      id: deleted.areaId,
      name: deleted.areaName,
      priceAddition: deleted.priceAddition,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    };
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const areaExist = await this.prisma.cinemaAreas.findUnique({ where: { areaId: id } });

    if (!areaExist) throw new NotFoundException('Cinema area not found');

    if (!areaExist.isDeleted) throw new BadRequestException('This cinema area is not deleted!');

    const restored = await this.prisma.cinemaAreas.update({
      where: { areaId: id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return {
      id: restored.areaId,
      name: restored.areaName,
      priceAddition: restored.priceAddition,
      isDeleted: restored.isDeleted,
      deletedAt: restored.deletedAt,
    };
  }
}
