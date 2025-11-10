import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllAgeLimitDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Transform(({ value }) => (value ? Number(value) : undefined))
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @Transform(({ value }) => (value ? Number(value) : undefined))
    @IsInt()
    @Min(1)
    pageSize?: number;

    @ApiPropertyOptional({ example: 'C18' })
    @IsOptional()
    @IsString()
    keyword?: string;
}
