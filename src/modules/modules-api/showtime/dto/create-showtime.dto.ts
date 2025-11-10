import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateShowtimeDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    movieId: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    formatId: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    cinemaId: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    roomId: number;

    @ApiProperty({ example: '2025-11-15' })
    @IsNotEmpty()
    @IsDateString()
    showDate: string;

    @ApiProperty({ example: '14:00' })
    @IsNotEmpty()
    @IsString()
    showTimeStart: string;

    @ApiProperty({ example: '16:00' })
    @IsNotEmpty()
    @IsString()
    showTimeEnd: string;
}
