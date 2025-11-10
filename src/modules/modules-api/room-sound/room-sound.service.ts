import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateSoundSystemDto } from './dto/create-room-sound.dto';
import { UpdateSoundSystemDto } from './dto/update-room-sound.dto';
import { FindAllSoundSystemDto } from './dto/find-all-room-sound.dto';

@Injectable()
export class SoundSystemService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateSoundSystemDto) {
    const soundExist = await this.prisma.soundSystems.findFirst({
      where: { soundName: dto.soundName, isDeleted: false },
    });

    if (soundExist) throw new BadRequestException('Sound system name already exists!');

    const newSound = await this.prisma.soundSystems.create({ data: dto });

    return {
      id: newSound.soundId,
      name: newSound.soundName,
      description: newSound.description,
      multiplier: newSound.multiplier,
      createdAt: newSound.createdAt,
    };
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllSoundSystemDto) {
    const { page, pageSize, keyword } = query;

    const where = {
      isDeleted: false,
      ...(keyword ? { soundName: { contains: keyword } } : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.soundSystems.findMany({
        where,
        skip,
        take,
        orderBy: { soundId: 'desc' },
      }),
      this.prisma.soundSystems.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items: items.map(i => ({
        soundId: i.soundId,
        soundName: i.soundName,
        description: i.description,
        multiplier: i.multiplier,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const soundExist = await this.prisma.soundSystems.findUnique({ where: { soundId: id } });

    if (!soundExist || soundExist.isDeleted) throw new NotFoundException('Sound system not found!');

    return {
      soundId: soundExist.soundId,
      soundName: soundExist.soundName,
      description: soundExist.description,
      multiplier: soundExist.multiplier,
      createdAt: soundExist.createdAt,
      updatedAt: soundExist.updatedAt,
    }
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateSoundSystemDto) {
    const soundExist = await this.prisma.soundSystems.findUnique({ where: { soundId: id } });
    if (!soundExist || soundExist.isDeleted) throw new NotFoundException('Sound system not found!');

    if (dto.soundName && dto.soundName !== soundExist.soundName) {
      const duplicate = await this.prisma.soundSystems.findFirst({
        where: { soundName: dto.soundName, isDeleted: false },
      });

      if (duplicate) throw new BadRequestException('Sound system name already exists!');
    }

    const updated = await this.prisma.soundSystems.update({
      where: { soundId: id },
      data: dto,
    });

    return {
      soundId: updated.soundId,
      soundName: updated.soundName,
      description: updated.description,
      multiplier: updated.multiplier,
      updatedAt: updated.updatedAt,
    }
  }

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const soundExis = await this.prisma.soundSystems.findUnique({ where: { soundId: id } });

    if (!soundExis) throw new NotFoundException('Sound system not found.');

    if (soundExis.isDeleted) throw new BadRequestException('Sound system already deleted.');

    const deleted = await this.prisma.soundSystems.update({
      where: { soundId: id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return {
      soundId: deleted.soundId,
      soundName: deleted.soundName,
      description: deleted.description,
      multiplier: deleted.multiplier,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    };
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const soundExist = await this.prisma.soundSystems.findUnique({ where: { soundId: id } });

    if (!soundExist) throw new NotFoundException('Sound system not found!');

    if (!soundExist.isDeleted) throw new BadRequestException('Sound system is not deleted.');

    const restored = await this.prisma.soundSystems.update({
      where: { soundId: id },
      data: { isDeleted: false, deletedAt: null },
    });

    return {
      soundId: restored.soundId,
      soundName: restored.soundName,
      description: restored.description,
      multiplier: restored.multiplier,
      isDeleted: restored.isDeleted,
      deletedAt: restored.deletedAt,
    }
  }
}
