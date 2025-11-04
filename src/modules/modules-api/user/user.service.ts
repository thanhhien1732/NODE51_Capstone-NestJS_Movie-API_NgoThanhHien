import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from 'generated/prisma';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FindAllDto } from './dto/find-all.dto';
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

    await this.prisma.users.update({
      where: { userId: user.userId },
      data: { password: newHash },
    });

    return;
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
  async delete(user: Users) {
    await this.prisma.users.update({
      where: { userId: user.userId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return;
  }

  // ------------------ Restore User ------------------
  async restore(email: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user || !user.isDeleted)
      throw new BadRequestException('No user found to restore.');

    await this.prisma.users.update({
      where: { email },
      data: { isDeleted: false, deletedAt: null },
    });

    return;
  }

  // ------------------ Upload Avatar ------------------
  async uploadAvatar(file: Express.Multer.File, user) {
    if (!file) throw new BadRequestException('No file uploaded');

    // Đưa hình lên Cloudinary
    const buffer = file.buffer;

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'avatars' }, (error, result) => {
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

  // ------------------ Find All Users ------------------
  async findAll(query: FindAllDto) {
    const { page, pageSize, keyword } = query;

    const searchCondition = keyword
      ? {
        OR: [
          { fullName: { contains: keyword } },
          { email: { contains: keyword } },
          { phoneNumber: { contains: keyword } },
        ],
      }
      : {};

    const isPaginated = page && pageSize;

    if (!isPaginated) {
      const users = await this.prisma.users.findMany({
        where: {
          isDeleted: false,
          ...searchCondition,
        },
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
        orderBy: { createdAt: 'desc' },
      });

      return {
        totalItem: users.length,
        items: users,
      };
    }

    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const pageSizeNum = Number(pageSize) > 0 ? Number(pageSize) : 10;
    const skip = (pageNum - 1) * pageSizeNum;

    const [users, totalItem] = await Promise.all([
      this.prisma.users.findMany({
        skip,
        take: pageSizeNum,
        where: {
          isDeleted: false,
          ...searchCondition,
        },
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
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.users.count({
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
      items: users || [],
    };
  }

  // ------------------ Find User By Id ------------------
  async findById(userId: number) {
    const user = await this.prisma.users.findUnique({
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
    if (!user) throw new BadRequestException('User not found.');
    return user;
  }
}
