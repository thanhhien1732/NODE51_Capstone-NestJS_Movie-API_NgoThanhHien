import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FindAllSeatTypeDto {
    @ApiPropertyOptional({ example: 1 })
    @Transform(({ value }) => Number(value))
    @IsOptional()
    page?: number;

    @ApiPropertyOptional({ example: 10 })
    @Transform(({ value }) => Number(value))
    @IsOptional()
    pageSize?: number;

    @ApiPropertyOptional({ example: 'VIP' })
    @IsOptional()
    @IsString()
    keyword?: string;
}
