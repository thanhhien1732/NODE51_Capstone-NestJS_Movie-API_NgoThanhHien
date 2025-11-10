import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateBookingDto {
    @ApiProperty({ example: 5 })
    @IsNotEmpty()
    @IsInt()
    showtimeId: number;

    @ApiProperty({ example: 12 })
    @IsNotEmpty()
    @IsInt()
    seatId: number;
}
