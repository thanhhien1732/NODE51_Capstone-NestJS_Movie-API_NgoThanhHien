import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RestoreUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'user@gmail.com' })
    email: string;
}