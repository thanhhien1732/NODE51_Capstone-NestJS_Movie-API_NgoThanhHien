import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AssignPermissionDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    roleId: number;

    @ApiProperty({ example: [1, 2, 3] })
    @IsArray()
    @IsNotEmpty()
    permissionIds: number[];
}
