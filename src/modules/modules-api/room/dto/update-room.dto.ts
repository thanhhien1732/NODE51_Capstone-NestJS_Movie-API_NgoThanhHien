import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
    @ApiPropertyOptional({ example: 'Phòng chiếu VIP' })
    @IsOptional()
    @IsString()
    roomName?: string;

    @ApiPropertyOptional({ example: 120 })
    @IsOptional()
    @IsInt()
    @Min(1)
    totalSeat?: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt()
    screenId?: number;

    @ApiPropertyOptional({ example: 3 })
    @IsOptional()
    @IsInt()
    soundId?: number;
}
