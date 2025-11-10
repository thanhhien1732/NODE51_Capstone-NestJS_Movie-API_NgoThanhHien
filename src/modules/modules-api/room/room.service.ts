import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FindAllRoomDto } from './dto/find-all-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(dto: CreateRoomDto) {
    const roomExist = await this.prisma.rooms.findFirst({
      where: {
        roomName: dto.roomName,
        isDeleted: false,
      },
    });

    if (roomExist) throw new BadRequestException('Room name already exists!');

    const newRoom = await this.prisma.rooms.create({
      data: dto,
      include: {
        ScreenTechs: { select: { screenName: true } },
        SoundSystems: { select: { soundName: true } },
      },
    });

    return {
      roomId: newRoom.roomId,
      roomName: newRoom.roomName,
      totalSeat: newRoom.totalSeat,
      screenName: newRoom.ScreenTechs?.screenName ?? null,
      soundName: newRoom.SoundSystems?.soundName ?? null,
      createdAt: newRoom.createdAt,
    };
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllRoomDto) {
    const { page, pageSize, keyword } = query;
    const where = {
      isDeleted: false,
      ...(keyword ? { roomName: { contains: keyword } } : {}),
    };

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.rooms.findMany({
        where,
        skip,
        take,
        include: {
          ScreenTechs: { select: { screenName: true } },
          SoundSystems: { select: { soundName: true } },
        },
        orderBy: { roomId: 'desc' },
      }),
      this.prisma.rooms.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      items: items.map(i => ({
        roomId: i.roomId,
        roomName: i.roomName,
        totalSeat: i.totalSeat,
        screenName: i.ScreenTechs?.screenName ?? null,
        soundName: i.SoundSystems?.soundName ?? null,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const roomExist = await this.prisma.rooms.findUnique({
      where: { roomId: id },
      include: {
        ScreenTechs: { select: { screenName: true } },
        SoundSystems: { select: { soundName: true } },
      },
    });

    if (!roomExist || roomExist.isDeleted) throw new NotFoundException('Room not found!');

    return {
      roomId: roomExist.roomId,
      roomName: roomExist.roomName,
      totalSeat: roomExist.totalSeat,
      screenName: roomExist.ScreenTechs?.screenName ?? null,
      soundName: roomExist.SoundSystems?.soundName ?? null,
      createdAt: roomExist.createdAt,
      updatedAt: roomExist.updatedAt,
    };
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateRoomDto) {
    const roomExist = await this.prisma.rooms.findUnique({ where: { roomId: id } });

    if (!roomExist || roomExist.isDeleted) throw new NotFoundException('Room not found!');

    if (dto.roomName) {
      const dup = await this.prisma.rooms.findFirst({
        where: {
          roomName: dto.roomName,
          isDeleted: false,
          NOT: { roomId: id },
        },
      });

      if (dup) throw new BadRequestException('Room name already exists!');
    }

    const updated = await this.prisma.rooms.update({
      where: { roomId: id },
      data: dto,
      include: {
        ScreenTechs: { select: { screenName: true } },
        SoundSystems: { select: { soundName: true } },
      },
    });

    return {
      roomId: updated.roomId,
      roomName: updated.roomName,
      totalSeat: updated.totalSeat,
      screenName: updated.ScreenTechs?.screenName ?? null,
      soundName: updated.SoundSystems?.soundName ?? null,
      updatedAt: updated.updatedAt,
    };
  }

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const roomExist = await this.prisma.rooms.findUnique({ where: { roomId: id } });

    if (!roomExist) throw new NotFoundException('Room not found!');

    if (roomExist.isDeleted) throw new BadRequestException('Room already deleted!');

    const deleted = await this.prisma.rooms.update({
      where: { roomId: id },
      data: { isDeleted: true, deletedAt: new Date() },
      include: {
        ScreenTechs: { select: { screenName: true } },
        SoundSystems: { select: { soundName: true } },
      },
    });

    return {
      roomId: deleted.roomId,
      roomName: deleted.roomName,
      totalSeat: deleted.totalSeat,
      screenName: deleted.ScreenTechs?.screenName ?? null,
      soundName: deleted.SoundSystems?.soundName ?? null,
      isDeleted: deleted.isDeleted,
      deletedAt: deleted.deletedAt,
    };
  }

  // ------------------ RESTORE ------------------
  async restore(id: number) {
    const roomExist = await this.prisma.rooms.findUnique({ where: { roomId: id } });

    if (!roomExist) throw new NotFoundException('Room not found!');

    if (!roomExist.isDeleted) throw new BadRequestException('Room is not deleted!');

    const restored = await this.prisma.rooms.update({
      where: { roomId: id },
      data: { isDeleted: false, deletedAt: null },
      include: {
        ScreenTechs: { select: { screenName: true } },
        SoundSystems: { select: { soundName: true } },
      },
    });

    return {
      roomId: restored.roomId,
      roomName: restored.roomName,
      totalSeat: restored.totalSeat,
      screenName: restored.ScreenTechs?.screenName ?? null,
      soundName: restored.SoundSystems?.soundName ?? null,
      isDeleted: restored.isDeleted,
      deletedAt: restored.deletedAt,
    };
  }
}
