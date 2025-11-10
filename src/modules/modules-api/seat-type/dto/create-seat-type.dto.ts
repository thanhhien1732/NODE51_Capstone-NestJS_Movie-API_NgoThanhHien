import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSeatTypeDto {
    @ApiProperty({ example: 'VIP' })
    @IsNotEmpty()
    @IsString()
    seatTypeName: string;

    @ApiProperty({ example: 1.2, description: 'Multiplier for ticket price' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    multiplier?: number;
}
