import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateMovieFormatDto } from './create-moive-format.dto';

export class UpdateMovieFormatDto extends PartialType(CreateMovieFormatDto) {
    @ApiPropertyOptional({ example: '3D Phụ đề' })
    @IsOptional()
    @IsString()
    formatName?: string;
}
