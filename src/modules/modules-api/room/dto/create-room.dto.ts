import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateRoomDto {
    @ApiProperty({ example: 'Phòng chiếu 1' })
    @IsNotEmpty()
    @IsString()
    roomName: string;

    @ApiProperty({ example: 100 })
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    totalSeat: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @IsNotEmpty()
    screenId: number;

    @ApiProperty({ example: 3 })
    @IsInt()
    @IsNotEmpty()
    soundId: number;
}
