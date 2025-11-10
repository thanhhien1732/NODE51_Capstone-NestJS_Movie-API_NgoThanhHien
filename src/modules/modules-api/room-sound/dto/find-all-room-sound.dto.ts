import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllSoundSystemDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumber()
    pageSize?: number;

    @ApiPropertyOptional({ example: 'dolby' })
    @IsOptional()
    @IsString()
    keyword?: string;
}
