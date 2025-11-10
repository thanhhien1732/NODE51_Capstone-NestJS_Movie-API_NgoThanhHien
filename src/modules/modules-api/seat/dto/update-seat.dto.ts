import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateSeatDto } from './create-seat.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateSeatDto extends PartialType(CreateSeatDto) {
    @ApiPropertyOptional({ example: 'A1' })
    @IsOptional()
    @IsString()
    seatName?: string;

    @ApiPropertyOptional({ example: 'A' })
    @IsOptional()
    @IsString()
    rowLabel?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    columnIndex?: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt()
    seatTypeId?: number;
}
