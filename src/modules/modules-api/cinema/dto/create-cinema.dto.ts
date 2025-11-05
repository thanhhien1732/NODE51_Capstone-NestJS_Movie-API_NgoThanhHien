import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCinemaDto {
    @ApiProperty({ example: 'CGV Vincom Quận 1' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    cinemaName: string;

    @ApiPropertyOptional({ example: 7 })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    totalRoom?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'FK → CinemaBrands.brandId'
    })
    @IsNotEmpty()
    @IsInt()
    brandId: number;

    @ApiPropertyOptional({
        example: 3,
        description: 'FK → CinemaAreas.areaId'
    })
    @IsNotEmpty()
    @IsInt()
    areaId: number;
}
