import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @ApiPropertyOptional({ example: 'STAFF' })
    @IsOptional()
    @IsString()
    roleName?: string;

    @ApiPropertyOptional({ example: 'Nhân Viên' })
    @IsOptional()
    @IsString()
    description?: string;
}
