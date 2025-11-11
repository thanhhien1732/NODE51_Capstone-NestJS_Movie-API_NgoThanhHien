import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiProperty({ example: 'oldPassword123' })
    oldPassword: string;

    @ApiProperty({ example: 'newPassword456' })
    newPassword: string;
}
