import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';

export class FindAllMovieDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    page?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsInt()
    pageSize?: number;

    @ApiPropertyOptional({ example: 'Avengers' })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    genreId?: number;

    @ApiPropertyOptional({ example: 3 })
    @IsOptional()
    @IsInt()
    ageLimitId?: number;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isComing?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isShowing?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isHot?: boolean;
}
