import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @ApiProperty({ example: 'STAFF' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Nhân Viên' })
    @IsOptional()
    @IsString()
    description?: string;
}
