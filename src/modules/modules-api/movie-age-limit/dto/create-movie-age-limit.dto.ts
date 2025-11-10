import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAgeLimitDto {
    @ApiProperty({ example: 'P', description: 'Mã giới hạn độ tuổi (ví dụ: P, C13, C16, C18)' })
    @IsNotEmpty()
    @IsString()
    ageLabel: string;

    @ApiPropertyOptional({ example: 'Phim phù hợp với mọi lứa tuổi' })
    @IsOptional()
    @IsString()
    description?: string;
}
