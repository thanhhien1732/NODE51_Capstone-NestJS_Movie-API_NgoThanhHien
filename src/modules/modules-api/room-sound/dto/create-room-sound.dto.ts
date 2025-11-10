import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSoundSystemDto {
    @ApiProperty({ example: 'Dolby Atmos', description: 'Tên hệ thống âm thanh' })
    @IsNotEmpty()
    @IsString()
    soundName: string;

    @ApiPropertyOptional({ example: '3D Object-Based', description: 'Mô tả hệ thống âm thanh' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 1.2, description: 'Hệ số giá vé của hệ thống âm thanh' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1.0)
    multiplier: number;
}
