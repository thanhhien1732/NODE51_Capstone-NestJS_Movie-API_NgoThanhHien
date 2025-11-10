import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieFormatDto {
    @ApiProperty({ example: '2D Phụ đề', description: 'Tên định dạng phim' })
    @IsNotEmpty()
    @IsString()
    formatName: string;
}
