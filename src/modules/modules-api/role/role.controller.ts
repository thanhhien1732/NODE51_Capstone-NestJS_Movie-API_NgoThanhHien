import { Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { SkipPermission } from 'src/common/decorators/skip-permission.decorator';
import { FindAllRoleDto } from './dto/find-all-role.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Role')
@Controller('role')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create new role' })
  @MessageResponse('Role created successfully!')
  create(@Query() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @Public()
  @SkipPermission()
  @ApiOperation({
    summary: 'Find all roles (support pagination & keyword search, all optional)',
  })
  @MessageResponse('Role list retrieved successfully!')
  findAll(@Query() findAllRoleDto: FindAllRoleDto) {
    return this.roleService.findAll(findAllRoleDto);
  }

  // ------------------ ASSIGN PERMISSIONS ------------------
  @Post('assign-permissions')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  @MessageResponse('Permissions assigned successfully!')
  async assignPermissions(
    @Query('roleId') roleId: string,
    @Query('permissionIds') permissionIds: string,
  ) {
    const ids = permissionIds.split(',').map((id) => Number(id.trim()));
    return this.roleService.assignPermissions(Number(roleId), ids);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @MessageResponse('Role retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update role' })
  @MessageResponse('Role updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete role' })
  @MessageResponse('Role deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id);
  }

  // ------------------ RESTORE ------------------
  @Post(':id')
  @ApiOperation({ summary: 'Restore role' })
  @MessageResponse('Role restored successfully!')
  async restoreRole(@Param('id') roleId: string) {
    return this.roleService.restoreRole(Number(roleId));
  }
}
