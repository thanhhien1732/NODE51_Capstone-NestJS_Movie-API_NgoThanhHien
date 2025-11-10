import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { FindAllCinemaDto } from './dto/find-all-cinema.dto';

@Injectable()
export class CinemaService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateCinemaDto) {
    const cinemaExist = await this.prisma.cinemas.findFirst({
      where: {
        cinemaName: dto.cinemaName,
        brandId: dto.brandId ?? undefined,
        areaId: dto.areaId ?? undefined,
        isDeleted: false,
      },
    });

    if (cinemaExist) {
      throw new BadRequestException('Cinema with this name already exists in this brand/area!');
    }

    const newCinema = await this.prisma.cinemas.create({
      data: dto,
      include: {
        CinemaBrands: { select: { brandName: true } },
        CinemaAreas: { select: { areaName: true } },
      },
    });

    return {
      cinemaId: newCinema.cinemaId,
      cinemaName: newCinema.cinemaName,
      totalRoom: newCinema.totalRoom,
      brandName: newCinema.CinemaBrands?.brandName ?? null,
      areaName: newCinema.CinemaAreas?.areaName ?? null,
      createAt: newCinema.createdAt,
    };
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllCinemaDto) {
    const { page, pageSize, keyword, areaId, brandId } = query;

    const where = {
      isDeleted: false,
      ...(keyword ? { cinemaName: { contains: keyword } } : {}),
      ...(areaId ? { areaId: Number(areaId) } : {}),
      ...(brandId ? { brandId: Number(brandId) } : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.cinemas.findMany({
        where,
        skip,
        take,
        include: {
          CinemaBrands: { select: { brandName: true } },
          CinemaAreas: { select: { areaName: true } },
        },
        orderBy: { cinemaId: 'desc' },
      }),
      this.prisma.cinemas.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items: items.map(i => ({
        cinemaId: i.cinemaId,
        cinemaName: i.cinemaName,
        totalRoom: i.totalRoom,
        brandName: i.CinemaBrands?.brandName ?? null,
        areaName: i.CinemaAreas?.areaName ?? null,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const cinemaExist = await this.prisma.cinemas.findFirst({
      where: { cinemaId: id, isDeleted: false },
      include: { CinemaAreas: true, CinemaBrands: true, },
    });

    if (!cinemaExist) throw new NotFoundException('Cinema not found');

    return {
      cinemaId: cinemaExist.cinemaId,
      cinemaName: cinemaExist.cinemaName,
      totalRoom: cinemaExist.totalRoom,
      brandName: cinemaExist.CinemaBrands?.brandName ?? null,
      areaName: cinemaExist.CinemaAreas?.areaName ?? null,
      createAt: cinemaExist.createdAt,
    };
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateCinemaDto) {
    const cinemaExist = await this.prisma.cinemas.findUnique({
      where: { cinemaId: id },
    });
    if (!cinemaExist || cinemaExist.isDeleted)
      throw new NotFoundException('Cinema not found!');

    if (dto.cinemaName) {
      const duplicate = await this.prisma.cinemas.findFirst({
        where: {
          cinemaName: dto.cinemaName,
          brandId: dto.brandId ?? cinemaExist.brandId,
          areaId: dto.areaId ?? cinemaExist.areaId,
          isDeleted: false,
          NOT: { cinemaId: id },
        },
      });

      if (duplicate) {
        throw new BadRequestException(
          'Another cinema with this name already exists in this brand/area!',
        );
      }
    }

    const updated = await this.prisma.cinemas.update({
      where: { cinemaId: id },
      data: dto,
      include: {
        CinemaBrands: { select: { brandName: true } },
        CinemaAreas: { select: { areaName: true } },
      },
    });

    return {
      cinemaId: updated.cinemaId,
      cinemaName: updated.cinemaName,
      totalRoom: updated.totalRoom,
      brandName: updated.CinemaBrands?.brandName ?? null,
      areaName: updated.CinemaAreas?.areaName ?? null,
      updatedAt: updated.updatedAt,
    }
  }

  // ------------------ DELETE ------------------
  async remove(id: number) {
    const cinemaExist = await this.prisma.cinemas.findUnique({
      where: { cinemaId: id },
    });

    if (!cinemaExist) throw new NotFoundException('Cinema not found');

    if (cinemaExist.isDeleted) throw new BadRequestException('Cinema already deleted');

    const deleted = await this.prisma.cinemas.update({
      where: { cinemaId: id },
      data: { isDeleted: true, deletedAt: new Date() },
      include: {
        CinemaBrands: { select: { brandName: true } },
        CinemaAreas: { select: { areaName: true } },
      },
    });

    return {
      cinemaId: deleted.cinemaId,
      cinemaName: deleted.cinemaName,
      totalRoom: deleted.totalRoom,
      brandName: deleted.CinemaBrands?.brandName ?? null,
      areaName: deleted.CinemaAreas?.areaName ?? null,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    }
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const cinemaExist = await this.prisma.cinemas.findUnique({
      where: { cinemaId: id },
    });

    if (!cinemaExist) throw new NotFoundException('Cinema not found');

    if (!cinemaExist.isDeleted) throw new BadRequestException('Cinema is not deleted');

    const restored = await this.prisma.cinemas.update({
      where: { cinemaId: id },
      data: { isDeleted: false, deletedAt: null },
      include: {
        CinemaBrands: { select: { brandName: true } },
        CinemaAreas: { select: { areaName: true } },
      },
    });

    return {
      cinemaId: restored.cinemaId,
      cinemaName: restored.cinemaName,
      totalRoom: restored.totalRoom,
      brandName: restored.CinemaBrands?.brandName ?? null,
      areaName: restored.CinemaAreas?.areaName ?? null,
      isDeleted: restored.isDeleted,
      deletedAt: restored.deletedAt,
    }
  }
}
