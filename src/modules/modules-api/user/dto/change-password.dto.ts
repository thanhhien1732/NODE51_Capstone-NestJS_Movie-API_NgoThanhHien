import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: 'oldPassword123' })
    oldPassword: string;

    @ApiProperty({ example: 'newPassword456' })
    newPassword: string;
}
