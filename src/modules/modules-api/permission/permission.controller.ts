import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { FindAllPermissionDto } from './dto/find-all-permission.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Permission')
@ApiBearerAuth()
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  // ------------------ CREATE PERMISSION ------------------
  @Post()
  @ApiOperation({ summary: 'Create permission' })
  @MessageResponse('Permission created successfully!')
  create(@Query() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
  }

  // ------------------ GET ALL PERMISSION ------------------
  @Get()
  @Public()
  @ApiOperation({
    summary: 'Find all permissions (support pagination & keyword search, all optional)',
  })
  @MessageResponse('Permission list retrieved successfully!')
  findAll(@Query() findAllPermissionDto: FindAllPermissionDto) {
    return this.permissionService.findAll(findAllPermissionDto);
  }

  // ------------------ GET PERMISSION BY ID ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get permission by ID' })
  @MessageResponse('Permission retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(id);
  }

  // ------------------ UPDATE PERMISSION ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update permission' })
  @MessageResponse('Permission updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdatePermissionDto) {
    return this.permissionService.update(id, dto);
  }

  // ------------------ DELETE PERMISSION ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Delete permission' })
  @MessageResponse('Permission deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.delete(id);
  }

  // ------------------ RESTORE PERMISSION ------------------
  @Post(':id')
  @ApiOperation({ summary: 'Restore deleted permission' })
  @MessageResponse('Permission restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.restore(id);
  }
}
