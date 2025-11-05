import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: 'Nguyễn Văn B' })
    fullName?: string;

    @ApiPropertyOptional({ example: 'newemail@gmail.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: '0909555999' })
    phoneNumber?: string;
}
