import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Nguyễn Văn B', required: false })
    fullName?: string;

    @ApiProperty({ example: 'newemail@gmail.com', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '0909555999', required: false })
    phoneNumber?: string;
}
