import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
    @ApiPropertyOptional({ example: 'Get all users' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: '/api/user/...' })
    @IsOptional()
    @IsString()
    endpoint?: string;

    @ApiPropertyOptional({ example: 'GET' })
    @IsOptional()
    @IsString()
    method?: string;

    @ApiPropertyOptional({ example: 'User' })
    @IsOptional()
    @IsString()
    module?: string;
}
