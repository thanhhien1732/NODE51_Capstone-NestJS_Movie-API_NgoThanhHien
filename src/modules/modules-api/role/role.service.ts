import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FindAllRoleDto } from './dto/find-all-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ------------------
  async create(createRoleDto: CreateRoleDto) {
    const roleExist = await this.prisma.roles.findFirst({
      where: { roleName: createRoleDto.roleName },
    });

    if (roleExist) throw new BadRequestException('Role already exists!');

    return this.prisma.roles.create({
      data: {
        ...createRoleDto,
        isActive: true,
      },
    });
  }

  // ------------------ FIND ALL ------------------
  async findAll(query: FindAllRoleDto) {
    const { page, pageSize, keyword } = query;

    const searchCondition = keyword
      ? {
        OR: [
          { roleName: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
      : {};

    const isPaginated = page && pageSize;

    if (!isPaginated) {
      const roles = await this.prisma.roles.findMany({
        where: {
          isDeleted: false,
          ...searchCondition,
        },
        orderBy: { roleId: 'desc' },
      });

      return {
        totalItem: roles.length,
        items: roles,
      };
    }

    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const pageSizeNum = Number(pageSize) > 0 ? Number(pageSize) : 10;
    const skip = (pageNum - 1) * pageSizeNum;

    const [roles, totalItem] = await Promise.all([
      this.prisma.roles.findMany({
        skip,
        take: pageSizeNum,
        where: {
          isDeleted: false,
          ...searchCondition,
        },
        orderBy: { roleId: 'desc' },
      }),

      this.prisma.roles.count({
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
      items: roles || [],
    };
  }

  // ------------------ ASSIGN PERMISSIONS ------------------
  async assignPermissions(roleId: number, permissionIds: number[]) {
    const roleExist = await this.prisma.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    });

    const existingIds = roleExist.map((p) => p.permissionId);

    const newIds = permissionIds.filter((id) => !existingIds.includes(id));

    if (newIds.length === 0) {
      throw new BadRequestException('The permission already exist for this role.');
    }

    const data = newIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    return this.prisma.rolePermission.createMany({ data });
  }

  // ------------------ FIND ONE ------------------
  async findOne(id: number) {
    const roleExist = await this.prisma.roles.findUnique({
      where: { roleId: id },
      include: {
        RolePermission: {
          include: { Permissions: true },
        },
      },
    });

    if (!roleExist) throw new BadRequestException('Role not found');

    return roleExist;
  }

  // ------------------ UPDATE ------------------
  async update(id: number, dto: UpdateRoleDto) {
    const roleExist = await this.prisma.roles.findUnique({ where: { roleId: id } });

    if (!roleExist || roleExist.isDeleted) {
      throw new NotFoundException('Role not found!');
    }

    if (dto.roleName) {
      const dup = await this.prisma.roles.findFirst({
        where: {
          roleName: dto.roleName,
          isDeleted: false,
          NOT: { roleId: id },
        },
      });

      if (dup) throw new BadRequestException('Role name already exists!');
    }

    return this.prisma.roles.update({
      where: { roleId: id },
      data: dto,
    });
  }

  // ------------------ DELETE ------------------
  async delete(id: number) {
    const roleExist = await this.prisma.roles.findUnique({ where: { roleId: id } });

    if (!roleExist) {
      throw new NotFoundException('Role not found.');
    }

    if (roleExist.isDeleted) {
      throw new BadRequestException('This role has already been deleted.');
    }

    return this.prisma.roles.update({
      where: { roleId: id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  // ------------------ RESTORE ------------------
  async restoreRole(roleId: number) {
    const roleExist = await this.prisma.roles.findUnique({ where: { roleId } });

    if (!roleExist) {
      throw new NotFoundException('Role not found.');
    }

    if (roleExist.isDeleted) {
      throw new BadRequestException('This role is already active.');
    }

    return this.prisma.roles.update({
      where: { roleId },
      data: { isDeleted: false, deletedAt: null },
    });
  }
}
