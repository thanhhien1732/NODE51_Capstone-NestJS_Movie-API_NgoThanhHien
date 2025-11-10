import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCinemaAreaDto {
    @ApiPropertyOptional({
        example: 'Đà Nẵng',
        description: 'Tên khu vực mới'
    })
    @IsOptional()
    @IsString()
    areaName?: string;

    @ApiPropertyOptional({ example: 10000, description: 'Giá trênh lệch của khu vực' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    priceAddition?: number;
}
