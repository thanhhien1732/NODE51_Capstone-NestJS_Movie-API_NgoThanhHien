import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllScreenTechDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumber()
    pageSize?: number;

    @ApiPropertyOptional({ example: 'IMAX' })
    @IsOptional()
    @IsString()
    keyword?: string;
}
