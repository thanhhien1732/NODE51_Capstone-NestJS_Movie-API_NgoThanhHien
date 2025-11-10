import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

function strToBool(value: any): boolean | undefined {
    if (value === '' || value === null || value === undefined) return undefined;
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (value === false || value === 'false' || value === 0 || value === '0') return false;
    return undefined;
}

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
    @ApiPropertyOptional({ example: 'Avengers: Endgame' })
    @IsOptional()
    @IsString()
    movieName?: string;

    @ApiPropertyOptional({ example: 'Epic conclusion of the Infinity Saga' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        type: 'string',
        format: 'binary',
        description: 'Poster image file (1 image only)',
    })
    @IsOptional()
    file?: any;

    @ApiPropertyOptional({ example: 'https://youtube.com/trailer' })
    @IsOptional()
    @IsString()
    trailer?: string;

    @ApiPropertyOptional({ example: '2025-01-20' })
    @IsOptional()
    @IsDateString()
    @Transform(({ value }) =>
        !value || value === '' ? undefined : new Date(value)
    )
    startDate?: string;

    @ApiPropertyOptional({ example: '2025-02-20' })
    @IsOptional()
    @IsDateString()
    @Transform(({ value }) =>
        !value || value === '' ? undefined : new Date(value)
    )
    endDate?: string;

    @ApiPropertyOptional({ example: 100000 })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
    basePrice?: number;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @Type(() => String)
    @IsBoolean()
    @Transform(({ value }) => strToBool(value))
    isComing?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @Type(() => String)
    @IsBoolean()
    @Transform(({ value }) => strToBool(value))
    isShowing?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @Type(() => String)
    @IsBoolean()
    @Transform(({ value }) => strToBool(value))
    isHot?: boolean;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
    movieGenreId?: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
    ageLimitId?: number;
}
