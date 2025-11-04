import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
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
