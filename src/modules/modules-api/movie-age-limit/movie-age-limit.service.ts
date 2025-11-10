import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateAgeLimitDto } from './dto/create-movie-age-limit.dto';
import { FindAllAgeLimitDto } from './dto/find-all-movie-age-limit.dto';
import { UpdateAgeLimitDto } from './dto/update-movie-age-limit.dto';

@Injectable()
export class AgeLimitService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateAgeLimitDto) {
    const ageLimitEixist = await this.prisma.ageLimits.findFirst({
      where: { ageLabel: dto.ageLabel, isDeleted: false },
    });
    if (ageLimitEixist) throw new BadRequestException('Age limit label already exists!');

    const newAgeLimit = await this.prisma.ageLimits.create({ data: dto });

    return {
      id: newAgeLimit.ageLimitId,
      label: newAgeLimit.ageLabel,
      description: newAgeLimit.description,
      createdAt: newAgeLimit.createdAt,
    };
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllAgeLimitDto) {
    const { page, pageSize, keyword } = query;

    const where = {
      isDeleted: false,
      ...(keyword
        ? {
          OR: [
            { ageLabel: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        }
        : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.ageLimits.findMany({
        where,
        skip,
        take,
        orderBy: { ageLimitId: 'desc' },
      }),
      this.prisma.ageLimits.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items: items.map((a) => ({
        id: a.ageLimitId,
        label: a.ageLabel,
        description: a.description,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const ageLimitEixist = await this.prisma.ageLimits.findUnique({
      where: { ageLimitId: id },
    });

    if (!ageLimitEixist || ageLimitEixist.isDeleted)
      throw new NotFoundException('Age limit not found!');

    return {
      id: ageLimitEixist.ageLimitId,
      label: ageLimitEixist.ageLabel,
      description: ageLimitEixist.description,
      createdAt: ageLimitEixist.createdAt,
      updatedAt: ageLimitEixist.updatedAt,
    };
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateAgeLimitDto) {
    const ageLimitEixist = await this.prisma.ageLimits.findUnique({
      where: { ageLimitId: id },
    });
    if (!ageLimitEixist || ageLimitEixist.isDeleted)
      throw new NotFoundException('Age limit not found!');

    if (dto.ageLabel) {
      const dup = await this.prisma.ageLimits.findFirst({
        where: {
          ageLabel: dto.ageLabel,
          isDeleted: false,
          NOT: { ageLimitId: id },
        },
      });
      if (dup) throw new BadRequestException('An age limit with this label already exists!');
    }

    const updated = await this.prisma.ageLimits.update({
      where: { ageLimitId: id },
      data: dto,
    });

    return {
      id: updated.ageLimitId,
      label: updated.ageLabel,
      description: updated.description,
      updatedAt: updated.updatedAt,
    };
  }

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const ageLimitEixist = await this.prisma.ageLimits.findUnique({
      where: { ageLimitId: id },
    });
    if (!ageLimitEixist) throw new NotFoundException('Age limit not found!');
    if (ageLimitEixist.isDeleted) throw new BadRequestException('Age limit already deleted!');

    const deleted = await this.prisma.ageLimits.update({
      where: { ageLimitId: id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return {
      id: deleted.ageLimitId,
      label: deleted.ageLabel,
      description: deleted.description,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    };
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const ageLimitEixist = await this.prisma.ageLimits.findUnique({
      where: { ageLimitId: id },
    });
    if (!ageLimitEixist) throw new NotFoundException('Age limit not found!');
    if (!ageLimitEixist.isDeleted) throw new BadRequestException('Age limit is not deleted!');

    const restored = await this.prisma.ageLimits.update({
      where: { ageLimitId: id },
      data: { isDeleted: false, deletedAt: null },
    });

    return {
      id: restored.ageLimitId,
      label: restored.ageLabel,
      description: restored.description,
      isDeleted: restored.isDeleted,
      restoredAt: restored.updatedAt,
    };
  }
}
