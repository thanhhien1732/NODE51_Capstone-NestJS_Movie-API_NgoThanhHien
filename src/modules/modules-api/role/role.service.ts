import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { FindAllDto } from './dto/find-all.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) { }

  // ------------------ CREATE ROLE ------------------
  async create(createRoleDto: CreateRoleDto) {
    const exist = await this.prisma.roles.findFirst({
      where: { name: createRoleDto.name },
    });

    if (exist) throw new BadRequestException('Role already exists!');

    return this.prisma.roles.create({
      data: {
        ...createRoleDto,
        isActive: true,
      },
    });
  }

  // ------------------ FIND ALL ROLE  ------------------
  async findAll(query: FindAllDto) {
    const { page, pageSize, keyword } = query;

    const searchCondition = keyword
      ? {
        OR: [
          { name: { contains: keyword } },
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
        orderBy: { createdAt: 'desc' },
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
        orderBy: { createdAt: 'desc' },
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
    const existing = await this.prisma.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    });

    const existingIds = existing.map((p) => p.permissionId);
    const newIds = permissionIds.filter((id) => !existingIds.includes(id));

    if (newIds.length === 0) {
      throw new BadRequestException('The permission already exist for this role.');
    }

    const data = newIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    await this.prisma.rolePermission.createMany({ data });

    return
  }

  // ------------------ GET ONE ------------------
  async findOne(id: number) {
    const role = await this.prisma.roles.findUnique({
      where: { roleId: id },
      include: {
        RolePermission: {
          include: { Permissions: true },
        },
      },
    });

    if (!role) throw new BadRequestException('Role not found');
    return role;
  }

  // ------------------ UPDATE ROLE ------------------
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.prisma.roles.update({
      where: { roleId: id },
      data: updateRoleDto,
    });
  }

  // ------------------ DELETE ROLE ------------------
  async delete(id: number) {
    const role = await this.prisma.roles.findUnique({ where: { roleId: id } });

    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    if (role.isDeleted || role.deletedAt !== null) {
      throw new BadRequestException('This role has already been deleted.');
    }

    const deletedRole = await this.prisma.roles.update({
      where: { roleId: id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return
  }

  // ------------------ RESTORE ROLE ------------------
  async restoreRole(roleId: number) {
    const role = await this.prisma.roles.findUnique({ where: { roleId } });

    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    if (role.deletedAt === null) {
      throw new BadRequestException('This role is already active.');
    }

    const restored = await this.prisma.roles.update({
      where: { roleId },
      data: { isDeleted: false, deletedAt: null },
    });

    return {
      restored,
    };
  }
}
