import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateShowtimeDto } from './create-showtime.dto';
import { IsOptional, IsInt, IsString, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateShowtimeDto extends PartialType(CreateShowtimeDto) {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    movieId?: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt()
    formatId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    cinemaId?: number;

    @ApiPropertyOptional({ example: 3 })
    @IsOptional()
    @IsInt()
    roomId?: number;

    @ApiPropertyOptional({ example: '2025-11-20' })
    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => (value === '' || value === null ? undefined : value))
    showDate?: string;

    @ApiPropertyOptional({ example: '18:00' })
    @IsOptional()
    @IsString()
    showTimeStart?: string;

    @ApiPropertyOptional({ example: '20:00' })
    @IsOptional()
    @IsString()
    showTimeEnd?: string;
}
