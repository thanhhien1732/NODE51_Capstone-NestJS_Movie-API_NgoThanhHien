import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { FindAllPermissionDto } from './dto/find-all-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE PERMISSION ------------------
  async create(dto: CreatePermissionDto) {
    const permissionExist = await this.prisma.permissions.findFirst({
      where: {
        endpoint: dto.endpoint,
        method: dto.method,
      },
    });

    if (permissionExist) throw new BadRequestException('Permission already exists!');

    return this.prisma.permissions.create({
      data: dto,
    });
  }

  // ------------------ FIND ALL PERMISSION  ------------------
  async findAll(query: FindAllPermissionDto) {
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
        orderBy: { permissionId: 'desc' },
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
        orderBy: { permissionId: 'desc' },
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
    const permissionExist = await this.prisma.permissions.findUnique({
      where: { permissionId: id },
    });

    if (!permissionExist) throw new BadRequestException('Permission not found');

    return permissionExist;
  }

  // ------------------ UPDATE PERMISSION ------------------
  async update(id: number, dto: UpdatePermissionDto) {
    const permissionExist = await this.prisma.permissions.findUnique({ where: { permissionId: id } });

    if (!permissionExist || permissionExist.isDeleted) {
      throw new NotFoundException('Permission not found!');
    }

    if (dto.name) {
      const dupName = await this.prisma.permissions.findFirst({
        where: {
          name: dto.name,
          isDeleted: false,
          NOT: { permissionId: id },
        },
      });
      if (dupName) throw new BadRequestException('Permission name already exists!');
    }

    const nextEndpoint = dto.endpoint ?? permissionExist.endpoint;
    const nextMethod = dto.method ?? permissionExist.method;

    const dupRoute = await this.prisma.permissions.findFirst({
      where: {
        endpoint: nextEndpoint,
        method: nextMethod,
        isDeleted: false,
        NOT: { permissionId: id },
      },
    });

    if (dupRoute) throw new BadRequestException('This endpoint + method already exists!');

    return this.prisma.permissions.update({
      where: { permissionId: id },
      data: dto,
    });
  }

  // ------------------ DELETE PERMISSION ------------------
  async delete(id: number) {
    const permissionExist = await this.prisma.permissions.findUnique({ where: { permissionId: id } });

    if (!permissionExist) {
      throw new NotFoundException('Permission not found.');
    }

    if (permissionExist.isDeleted) {
      throw new BadRequestException('Permission has already been deleted.');
    }

    return this.prisma.permissions.update({
      where: { permissionId: id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  // ------------------ RESTORE PERMISSION ------------------
  async restore(id: number) {
    const permissionExist = await this.prisma.permissions.findUnique({
      where: { permissionId: id },
    });

    if (!permissionExist) throw new BadRequestException('Permission not found');

    if (!permissionExist.isDeleted) {
      throw new BadRequestException('Permission is not deleted');
    }

    return this.prisma.permissions.update({
      where: { permissionId: id },
      data: { isDeleted: false, deletedAt: null },
    });
  }
}
