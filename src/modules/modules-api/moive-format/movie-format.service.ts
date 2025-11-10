import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateMovieFormatDto } from './dto/create-moive-format.dto';
import { FindAllMovieFormatDto } from './dto/find-all-movie-format.dto';
import { UpdateMovieFormatDto } from './dto/update-moive-format.dto';

@Injectable()
export class MovieFormatService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateMovieFormatDto) {
    const formatExist = await this.prisma.movieFormats.findFirst({
      where: { formatName: dto.formatName, isDeleted: false },
    });

    if (formatExist) throw new BadRequestException('Movie format name already exists!');

    const newFormat = await this.prisma.movieFormats.create({ data: dto });

    return {
      id: newFormat.formatId,
      name: newFormat.formatName,
      createdAt: newFormat.createdAt,
    };
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllMovieFormatDto) {
    const { page, pageSize, keyword } = query;

    const where = {
      isDeleted: false,
      ...(keyword ? { formatName: { contains: keyword } } : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.movieFormats.findMany({
        where,
        skip,
        take,
        orderBy: { formatId: 'desc' },
      }),
      this.prisma.movieFormats.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items: items.map((f) => ({
        id: f.formatId,
        name: f.formatName,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const formatExist = await this.prisma.movieFormats.findUnique({
      where: { formatId: id },
    });

    if (!formatExist || formatExist.isDeleted)
      throw new NotFoundException('Movie format not found!');

    return {
      id: formatExist.formatId,
      name: formatExist.formatName,
      createdAt: formatExist.createdAt,
      updatedAt: formatExist.updatedAt,
    };
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateMovieFormatDto) {
    const formatExist = await this.prisma.movieFormats.findUnique({
      where: { formatId: id },
    });
    if (!formatExist || formatExist.isDeleted)
      throw new NotFoundException('Movie format not found!');

    if (dto.formatName) {
      const dup = await this.prisma.movieFormats.findFirst({
        where: {
          formatName: dto.formatName,
          isDeleted: false,
          NOT: { formatId: id },
        },
      });
      if (dup)
        throw new BadRequestException('A movie format with this name already exists!');
    }

    const updated = await this.prisma.movieFormats.update({
      where: { formatId: id },
      data: dto,
    });

    return {
      id: updated.formatId,
      name: updated.formatName,
      updatedAt: updated.updatedAt,
    };
  }

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const formatExist = await this.prisma.movieFormats.findUnique({
      where: { formatId: id },
    });
    if (!formatExist) throw new NotFoundException('Movie format not found!');
    if (formatExist.isDeleted) throw new BadRequestException('Movie format already deleted!');

    const deleted = await this.prisma.movieFormats.update({
      where: { formatId: id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return {
      id: deleted.formatId,
      name: deleted.formatName,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    };
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const formatExist = await this.prisma.movieFormats.findUnique({
      where: { formatId: id },
    });
    if (!formatExist) throw new NotFoundException('Movie format not found!');
    if (!formatExist.isDeleted) throw new BadRequestException('Movie format is not deleted!');

    const restored = await this.prisma.movieFormats.update({
      where: { formatId: id },
      data: { isDeleted: false, deletedAt: null },
    });

    return {
      id: restored.formatId,
      name: restored.formatName,
      isDeleted: restored.isDeleted,
      restoredAt: restored.updatedAt,
    };
  }
}
