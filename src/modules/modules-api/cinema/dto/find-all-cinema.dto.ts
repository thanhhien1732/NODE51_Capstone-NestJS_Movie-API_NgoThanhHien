import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindAllCinemaDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsInt()
    @Min(1)
    pageSize?: number;

    @ApiPropertyOptional({ example: 'Vincom' })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    brandId?: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt()
    areaId?: number;
}
