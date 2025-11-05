import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCinemaDto } from './create-cinema.dto';
import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateCinemaDto extends PartialType(CreateCinemaDto) {
    @ApiProperty({ example: 'CGV Vincom Quận 1' })
    @IsString() @IsOptional() @MinLength(2) @MaxLength(100)
    cinemaName?: string;

    @ApiPropertyOptional({ example: 7 })
    @IsOptional() @IsInt() @Min(0)
    totalRoom?: number;

    @ApiPropertyOptional({ example: 1, description: 'FK → CinemaBrands.brandId' })
    @IsOptional() @IsInt()
    brandId?: number;

    @ApiPropertyOptional({ example: 3, description: 'FK → CinemaAreas.areaId' })
    @IsOptional() @IsInt()
    areaId?: number;
}
