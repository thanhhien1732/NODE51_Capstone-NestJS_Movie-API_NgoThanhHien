import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateSeatDto {
    @ApiProperty({ example: 'A1' })
    @IsNotEmpty()
    @IsString()
    seatName: string;

    @ApiProperty({ example: 'A' })
    @IsNotEmpty()
    @IsString()
    rowLabel: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsInt()
    columnIndex: number;

    @ApiProperty({ example: 2 })
    @IsNotEmpty()
    @IsInt()
    seatTypeId: number;
}
