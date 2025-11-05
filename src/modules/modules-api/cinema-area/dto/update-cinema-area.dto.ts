import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCinemaAreaDto {
    @ApiPropertyOptional({
        example: 'Đà Nẵng',
        description: 'Tên khu vực mới'
    })
    @IsOptional()
    @IsString()
    areaName?: string;
}
