import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { FindAllDto } from './dto/find-all.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE PERMISSION ------------------
  async create(dto: CreatePermissionDto) {
    const exist = await this.prisma.permissions.findFirst({
      where: {
        endpoint: dto.endpoint,
        method: dto.method,
      },
    });

    if (exist) throw new BadRequestException('Permission already exists!');

    return this.prisma.permissions.create({
      data: dto,
    });
  }

  // ------------------ FIND ALL PERMISSION  ------------------
  async findAll(query: FindAllDto) {
    const { page, pageSize, keyword } = query;

    const searchCondition = keyword
      ? {
        OR: [
          { name: { contains: keyword } },
          { endpoint: { contains: keyword } },
          { method: { contains: keyword } },
          { module: { contains: keyword } },
        ],
      }
      : {};

    const isPaginated = page && pageSize;

    if (!isPaginated) {
      const persmissons = await this.prisma.permissions.findMany({
        where: {
          isDeleted: false,
          ...searchCondition,
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        totalItem: persmissons.length,
        items: persmissons,
      };
    }

    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const pageSizeNum = Number(pageSize) > 0 ? Number(pageSize) : 10;
    const skip = (pageNum - 1) * pageSizeNum;

    const [permissions, totalItem] = await Promise.all([
      this.prisma.permissions.findMany({
        skip,
        take: pageSizeNum,
        where: {
          isDeleted: false,
          ...searchCondition,
        },
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.permissions.count({
        where: {
          isDeleted: false,
          ...searchCondition,
        },
      }),
    ]);

    const totalPage = Math.ceil(totalItem / pageSizeNum);

    return {
      page: pageNum,
      pageSize: pageSizeNum,
      keyword,
      totalItem,
      totalPage,
      items: permissions || [],
    };
  }

  // ------------------ GET PERMISSION BY ID ------------------
  async findOne(id: number) {
    const permission = await this.prisma.permissions.findUnique({
      where: { permissionId: id },
    });

    if (!permission) throw new BadRequestException('Permission not found');
    return permission;
  }

  // ------------------ UPDATE PERMISSION ------------------
  async update(id: number, dto: UpdatePermissionDto) {
    return this.prisma.permissions.update({
      where: { permissionId: id },
      data: dto,
    });
  }

  // ------------------ DELETE PERMISSION ------------------
  async delete(id: number) {
    const permission = await this.prisma.permissions.findUnique({ where: { permissionId: id } });

    if (!permission) {
      throw new NotFoundException('permission not found.');
    }

    if (permission.isDeleted || permission.deletedAt !== null) {
      throw new BadRequestException('This permission has already been deleted.');
    }

    const deletedpermission = await this.prisma.permissions.update({
      where: { permissionId: id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return
  }

  // ------------------ RESTORE PERMISSION ------------------
  async restore(id: number) {
    const permission = await this.prisma.permissions.findUnique({
      where: { permissionId: id },
    });

    if (!permission) throw new BadRequestException('Permission not found');

    if (!permission.isDeleted) {
      throw new BadRequestException('Permission is already active');
    }

    if (permission.deletedAt === null) {
      throw new BadRequestException('This permission is already active.');
    }

    return this.prisma.permissions.update({
      where: { permissionId: id },
      data: { isDeleted: false, deletedAt: null },
    });
  }
}
