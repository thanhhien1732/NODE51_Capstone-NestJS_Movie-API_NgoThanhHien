import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
    @ApiProperty({ example: 'Get all users' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: '/api/user/...' })
    @IsNotEmpty()
    @IsString()
    endpoint: string;

    @ApiProperty({ example: 'GET' })
    @IsNotEmpty()
    @IsString()
    method: string;

    @ApiProperty({ example: 'User' })
    @IsNotEmpty()
    @IsString()
    module: string;
}
