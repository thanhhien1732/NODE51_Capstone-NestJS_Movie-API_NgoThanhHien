import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllSeatDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumber()
    pageSize?: number;

    @ApiPropertyOptional({ example: 'A' })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsNumber()
    seatTypeId?: number;
}
