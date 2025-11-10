import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString, IsNumber, IsString } from 'class-validator';

export class FindAllRoomDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumber()
    pageSize?: number;

    @ApiPropertyOptional({ example: 'Phòng' })
    @IsOptional()
    @IsString()
    keyword?: string;
}
