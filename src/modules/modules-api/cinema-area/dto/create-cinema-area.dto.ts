import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCinemaAreaDto {
    @ApiProperty({
        example: 'Hà Nội',
        description: 'Tên khu vực rạp chiếu'
    })
    @IsString()
    @IsNotEmpty()
    areaName: string;
}
