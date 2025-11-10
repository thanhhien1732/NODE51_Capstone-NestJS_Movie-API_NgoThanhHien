import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from 'generated/prisma';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import cloudinary from 'src/common/cloudinary/init.cloudinary';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  // ------------------ Change Password ------------------
  async changePassword(user: Users, dto: ChangePasswordDto) {
    const { oldPassword, newPassword } = dto;
    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) throw new BadRequestException('Old password is incorrect.');

    const newHash = await bcrypt.hash(newPassword, 10);

    return this.prisma.users.update({
      where: { userId: user.userId },
      data: { password: newHash },
    });
  }

  // ------------------ Update User ------------------
  async updateUser(user: Users, dto: UpdateUserDto) {
    if (dto.email && dto.email !== user.email) {
      const emailExist = await this.prisma.users.findUnique({
        where: { email: dto.email },
      });
      if (emailExist)
        throw new BadRequestException('Email is already in use by another user.');
    }

    if (dto.phoneNumber && dto.phoneNumber !== user.phoneNumber) {
      const phoneExist = await this.prisma.users.findFirst({
        where: {
          phoneNumber: dto.phoneNumber,
          isDeleted: false,
          NOT: { userId: user.userId },
        },
      });
      if (phoneExist)
        throw new BadRequestException('Phone number is already in use by another user.');
    }

    if (dto.fullName && dto.fullName !== user.fullName) {
      const nameExist = await this.prisma.users.findFirst({
        where: {
          fullName: dto.fullName,
          isDeleted: false,
          NOT: { userId: user.userId },
        },
      });
      if (nameExist)
        throw new BadRequestException('Full name already exists. Please choose another.');
    }

    const updated = await this.prisma.users.update({
      where: { userId: user.userId },
      data: {
        fullName: dto.fullName ?? user.fullName,
        email: dto.email ?? user.email,
        phoneNumber: dto.phoneNumber ?? user.phoneNumber,
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  // ------------------ Delete User ------------------
  delete(user: Users) {

    return this.prisma.users.update({
      where: { userId: user.userId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }

  // ------------------ Restore User ------------------
  async restore(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email }
    });

    if (!user) throw new NotFoundException('User not found');

    if (!user.isDeleted) throw new BadRequestException('User is not deleted');

    return this.prisma.users.update({
      where: { email },
      data: { isDeleted: false, deletedAt: null },
    });
  }

  // ------------------ Upload Avatar ------------------
  async uploadAvatar(file: Express.Multer.File, user) {
    if (!file) throw new BadRequestException('No file uploaded');

    // Đưa hình lên Cloudinary
    const buffer = file.buffer;

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'movie/avatars' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(buffer);
    });

    // Xoá avatar cũ (nếu có)
    if (user.avatar) {
      try {
        await cloudinary.uploader.destroy(user.avatar);
      } catch (e) {
        console.warn('Error deleting old avatar:', e.message);
      }
    }

    // Cập nhật user avatar mới
    await this.prisma.users.update({
      where: { userId: user.userId },
      data: {
        avatar: uploadResult.public_id,
      },
    });

    return {
      cloudId: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  }

  // ------------------ Delete Avatar ------------------
  async deleteAvatar(user: any) {
    if (!user.avatar) {
      throw new BadRequestException('User has no avatar to delete!');
    }

    // Xóa avatar trên Cloudinary
    const result = await cloudinary.uploader.destroy(user.avatar);

    // Cloudinary trả về nếu không tồn tại file
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new BadRequestException('Failed to delete avatar from Cloudinary');
    }

    // Cập nhật DB: xóa field avatar
    await this.prisma.users.update({
      where: { userId: user.userId },
      data: { avatar: null },
    });

    return {
      deletedAvatar: user.avatar
    };
  }

  // ------------------ FIND ALL USERS ------------------
  async findAll(query: FindAllUserDto) {
    const { page, pageSize, keyword, email, phoneNumber } = query;

    const where = {
      isDeleted: false,
      ...(keyword ? { fullName: { contains: keyword } } : {}),
      ...(email ? { email: { contains: email } } : {}),
      ...(phoneNumber ? { phoneNumber: { contains: phoneNumber } } : {}),
    }

    const hasPagination = page && pageSize;
    const skip = hasPagination ? (Number(page) - 1) * Number(pageSize) : undefined;
    const take = hasPagination ? Number(pageSize) : undefined;

    const [items, totalItem] = await Promise.all([
      this.prisma.users.findMany({
        where,
        skip,
        take,
        include: {
          Roles: { select: { roleName: true } },
        },
        orderBy: { userId: 'desc' },
      }),
      this.prisma.users.count({ where }),
    ]);

    return {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || totalItem,
      totalItem,
      totalPage: hasPagination ? Math.ceil(totalItem / Number(pageSize)) : 1,
      keyword: keyword || null,
      email: email || null,
      phoneNumber: phoneNumber || null,
      items: items.map(i => ({
        userId: i.userId,
        roleName: i.Roles?.roleName ?? null,
        fullName: i.fullName,
        email: i.email,
        phoneNumber: i.phoneNumber,
        avatar: i.avatar,
        googleId: i.googleId,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ------------------ Find User By Id ------------------
  async findById(userId: number) {
    const userExist = await this.prisma.users.findUnique({
      where: { userId },
      select: {
        userId: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        avatar: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!userExist) throw new BadRequestException('User not found.');

    return userExist;
  }
}
