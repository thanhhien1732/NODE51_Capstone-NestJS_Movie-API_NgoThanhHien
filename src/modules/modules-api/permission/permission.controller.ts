import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { SkipPermission } from 'src/common/decorators/skip-permission.decorator';
import { FindAllDto } from './dto/find-all.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Permission')
@ApiBearerAuth()
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  // ------------------ CREATE PERMISSION ------------------
  @Post()
  @SkipPermission()  // xóa sau
  @ApiOperation({ summary: 'Create permission' })
  @MessageResponse('Permission created successfully!')
  create(@Query() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
  }

  // ------------------ GET ALL PERMISSION ------------------
  @Get()
  @Public()
  @SkipPermission()
  @ApiOperation({
    summary: 'Find all permissions (support pagination & keyword search, all optional)',
  })
  @MessageResponse('Permission list retrieved successfully!')
  findAll(@Query() findAllDto: FindAllDto) {
    return this.permissionService.findAll(findAllDto);
  }

  // ------------------ GET PERMISSION BY ID ------------------
  @Get(':id')
  @SkipPermission()  // xóa sau
  @ApiOperation({ summary: 'Get permission by ID' })
  @MessageResponse('Permission retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(id);
  }

  // ------------------ UPDATE PERMISSION ------------------
  @Put(':id')
  @SkipPermission()  // xóa sau
  @ApiOperation({ summary: 'Update permission' })
  @MessageResponse('Permission updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdatePermissionDto) {
    return this.permissionService.update(id, dto);
  }

  // ------------------ DELETE PERMISSION ------------------
  @Delete(':id')
  @SkipPermission()  // xóa sau
  @ApiOperation({ summary: 'Delete permission' })
  @MessageResponse('Permission deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.delete(id);
  }

  // ------------------ RESTORE PERMISSION ------------------
  @Post(':id')
  @SkipPermission()  // xóa sau
  @ApiOperation({ summary: 'Restore deleted permission' })
  @MessageResponse('Permission restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.restore(id);
  }
}
