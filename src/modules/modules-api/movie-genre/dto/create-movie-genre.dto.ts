import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieGenreDto {
    @ApiProperty({ example: 'Action', description: 'Tên thể loại phim' })
    @IsNotEmpty()
    @IsString()
    movieGenreName: string;
}
