import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCinemaAreaDto {
    @ApiProperty({
        example: 'Hà Nội',
        description: 'Tên khu vực rạp chiếu phim'
    })
    @IsString()
    @IsNotEmpty()
    areaName: string;

    @ApiProperty({ example: 10000, description: 'Giá trênh lệch của khu vực' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    priceAddition: number;
}
