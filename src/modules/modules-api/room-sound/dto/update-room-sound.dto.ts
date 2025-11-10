import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateSoundSystemDto } from './create-room-sound.dto';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateSoundSystemDto extends PartialType(CreateSoundSystemDto) {
    @ApiPropertyOptional({ example: 'Dolby Surround 7.1' })
    @IsOptional()
    @IsString()
    soundName?: string;

    @ApiPropertyOptional({ example: '3D Object-Based', description: 'Mô tả hệ thống âm thanh' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 1.5, description: 'Hệ số giá vé của hệ thống âm thanh' })
    @IsOptional()
    @IsNumber()
    @Min(1.0)
    multiplier?: number;
}
