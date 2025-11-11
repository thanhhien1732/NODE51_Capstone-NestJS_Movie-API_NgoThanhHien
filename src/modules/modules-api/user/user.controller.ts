import { Controller, Get, Post, Put, Delete, Param, UploadedFile, UseInterceptors, ParseIntPipe, Query, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/decorators/user.decorator';
import type { Users } from 'generated/prisma';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RestoreUserDto } from './dto/restore-user.dto';
import { UploadAvatarDto } from './dto/avatar-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) { }

  // ------------------ Change Password ------------------
  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @MessageResponse('Password changed successfully!')
  changePassword(@User() user: Users, @Query() dto: ChangePasswordDto) {
    return this.userService.changePassword(user, dto);
  }

  // ------------------ Update User ------------------
  @Put('update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @MessageResponse('User updated successfully!')
  updateUser(@User() user: Users, @Query() dto: UpdateUserDto) {
    return this.userService.updateUser(user, dto);
  }

  // ------------------ Delete User ------------------
  @Delete('delete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete User' })
  @MessageResponse('User deleted successfully!')
  delete(@User() user: Users) {
    return this.userService.delete(user);
  }

  // ------------------ Restore User ------------------
  @Post('restore')
  @Public()
  @ApiOperation({ summary: 'Restore deleted user' })
  @MessageResponse('User restored successfully!')
  restore(@Query() dto: RestoreUserDto) {
    return this.userService.restore(dto.email);
  }

  // ------------------ Upload Avatar ------------------
  @Post('avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload user avatar (1 image only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadAvatarDto })
  @MessageResponse('Avatar uploaded successfully!')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Only image files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @User() user: Users) {
    return this.userService.uploadAvatar(file, user);
  }

  // ------------------ Delete Avatar ------------------
  @Delete('avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user avatar (Cloudinary + DB)' })
  @MessageResponse('Avatar deleted successfully!')
  async deleteAvatar(@User() user: Users) {
    return this.userService.deleteAvatar(user);
  }

  // ------------------ Find All User ------------------
  @Get()
  @Public()
  @ApiOperation({
    summary: 'Find all users (support pagination & keyword search, all optional)',
  })
  @MessageResponse('User list retrieved successfully!')
  findAll(@Query() findAllUserDto: FindAllUserDto) {
    return this.userService.findAll(findAllUserDto);
  }

  // ------------------ Find User By Id ------------------
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Find user detail by id' })
  @MessageResponse('User detail retrieved successfully!')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }
}
