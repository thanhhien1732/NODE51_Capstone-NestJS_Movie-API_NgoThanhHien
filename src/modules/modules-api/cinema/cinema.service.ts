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
    const existing = await this.prisma.cinemas.findFirst({
      where: {
        cinemaName: dto.cinemaName,
        brandId: dto.brandId ?? undefined,
        areaId: dto.areaId ?? undefined,
        isDeleted: false,
      },
    });

    if (existing) {
      throw new BadRequestException('Cinema with this name already exists in this brand/area!');
    }

    const cinema = await this.prisma.cinemas.create({ data: dto });

    return {
      cinemaId: cinema.cinemaId,
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
        orderBy: { createdAt: 'desc' },
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
    const cinema = await this.prisma.cinemas.findFirst({
      where: { cinemaId: id, isDeleted: false },
      include: { CinemaAreas: true, CinemaBrands: true, Rooms: true, Movies: true },
    });
    if (!cinema) throw new NotFoundException('Cinema not found');
    return cinema;
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateCinemaDto) {
    const cinema = await this.prisma.cinemas.findUnique({
      where: { cinemaId: id },
    });
    if (!cinema || cinema.isDeleted)
      throw new NotFoundException('Cinema not found!');

    if (dto.cinemaName) {
      const duplicate = await this.prisma.cinemas.findFirst({
        where: {
          cinemaName: dto.cinemaName,
          brandId: dto.brandId ?? cinema.brandId,
          areaId: dto.areaId ?? cinema.areaId,
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

    await this.prisma.cinemas.update({
      where: { cinemaId: id },
      data: dto,
    });

    return;
  }

  // ------------------ DELETE ------------------
  async remove(id: number, deletedBy?: string) {
    const exist = await this.prisma.cinemas.findFirst({
      where: { cinemaId: id, isDeleted: false },
      select: { cinemaId: true },
    });
    if (!exist) throw new NotFoundException('Cinema not found or already deleted');

    await this.prisma.cinemas.update({
      where: { cinemaId: id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return { message: 'Deleted' };
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const exist = await this.prisma.cinemas.findFirst({
      where: { cinemaId: id, isDeleted: true },
      select: { cinemaId: true },
    });
    if (!exist) throw new NotFoundException('Cinema is not in deleted state');

    await this.prisma.cinemas.update({
      where: { cinemaId: id },
      data: { isDeleted: false, deletedAt: null },
    });
    return { message: 'Restored' };
  }
}
