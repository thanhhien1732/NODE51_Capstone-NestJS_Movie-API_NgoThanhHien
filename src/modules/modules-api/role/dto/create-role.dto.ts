import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ example: 'STAFF' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Nhân Viên' })
    @IsOptional()
    @IsString()
    description?: string;
}
