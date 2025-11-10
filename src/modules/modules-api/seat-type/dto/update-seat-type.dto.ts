import { PartialType } from '@nestjs/mapped-types';
import { CreateSeatTypeDto } from './create-seat-type.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateSeatTypeDto extends PartialType(CreateSeatTypeDto) {
    @ApiPropertyOptional({ example: 'Deluxe' })
    @IsOptional()
    @IsString()
    seatTypeName?: string;

    @ApiPropertyOptional({ example: 1.5 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    multiplier?: number;
}
