import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindAllShowtimeDto {
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

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    movieId?: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt()
    cinemaId?: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt()
    formatId?: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt()
    roomId?: number;

    @ApiPropertyOptional({ example: '2025-11-15' })
    @IsOptional()
    @IsDateString()
    showDate?: string;

    @ApiPropertyOptional({ example: '14:00' })
    @IsOptional()
    @IsString()
    showTimeStart?: string;
}
