import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateScreenTechDto } from './dto/create-room-screen.dto';
import { UpdateScreenTechDto } from './dto/update-room-screendto';
import { FindAllScreenTechDto } from './dto/find-all-room-screen.dto';

@Injectable()
export class ScreenTechService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateScreenTechDto) {
    const screenExist = await this.prisma.screenTechs.findFirst({
      where: { screenName: dto.screenName, isDeleted: false },
    });

    if (screenExist) throw new BadRequestException('Screen technology name already exists!');

    const newScreen = await this.prisma.screenTechs.create({ data: dto });

    return {
      id: newScreen.screenId,
      name: newScreen.screenName,
      description: newScreen.description,
      multiplier: newScreen.multiplier,
      createdAt: newScreen.createdAt,
    };
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllScreenTechDto) {
    const { page, pageSize, keyword } = query;

    const where = {
      isDeleted: false,
      ...(keyword ? { screenName: { contains: keyword } } : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.screenTechs.findMany({
        where,
        skip,
        take,
        orderBy: { screenId: 'desc' },
      }),
      this.prisma.screenTechs.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items: items.map(i => ({
        id: i.screenId,
        name: i.screenName,
        description: i.description,
        multiplier: i.multiplier,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const screenExist = await this.prisma.screenTechs.findUnique({ where: { screenId: id } });

    if (!screenExist || screenExist.isDeleted) throw new NotFoundException('Screen technology not found!');

    return {
      id: screenExist.screenId,
      name: screenExist.screenName,
      description: screenExist.description,
      multiplier: screenExist.multiplier,
      createdAt: screenExist.createdAt,
      updatedAt: screenExist.updatedAt,
    }
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateScreenTechDto) {
    const screenExist = await this.prisma.screenTechs.findUnique({ where: { screenId: id } });
    if (!screenExist || screenExist.isDeleted) throw new NotFoundException('Screen technology not found!');

    if (dto.screenName && dto.screenName !== screenExist.screenName) {
      const dup = await this.prisma.screenTechs.findFirst({
        where: { screenName: dto.screenName, isDeleted: false },
      });

      if (dup) throw new BadRequestException('Screen technology name already exists!');
    }

    const updated = await this.prisma.screenTechs.update({
      where: { screenId: id },
      data: dto,
    });

    return {
      id: updated.screenId,
      name: updated.screenName,
      description: updated.description,
      multiplier: updated.multiplier,
      updatedAt: updated.updatedAt,
    }
  }

  // ------------------ DELETE (Soft Delete) ------------------
  async delete(id: number) {
    const screenExist = await this.prisma.screenTechs.findUnique({ where: { screenId: id } });

    if (!screenExist) throw new NotFoundException('Screen technology not found!');

    if (screenExist.isDeleted) throw new BadRequestException('Screen technology already deleted!');

    const deleted = await this.prisma.screenTechs.update({
      where: { screenId: id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return {
      id: deleted.screenId,
      name: deleted.screenName,
      description: deleted.description,
      multiplier: deleted.multiplier,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    }
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const screenExist = await this.prisma.screenTechs.findUnique({ where: { screenId: id } });

    if (!screenExist) throw new NotFoundException('Screen technology not found!');

    if (!screenExist.isDeleted) throw new BadRequestException('Screen technology is not deleted!');

    const restored = await this.prisma.screenTechs.update({
      where: { screenId: id },
      data: { isDeleted: false, deletedAt: null },
    });

    return {
      id: restored.screenId,
      name: restored.screenName,
      description: restored.description,
      multiplier: restored.multiplier,
      isDeleted: restored.isDeleted,
      deletedAt: restored.deletedAt,
    }
  }
}
