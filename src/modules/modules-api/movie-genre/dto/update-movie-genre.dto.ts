import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateMovieGenreDto } from './create-movie-genre.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMovieGenreDto extends PartialType(CreateMovieGenreDto) {
    @ApiPropertyOptional({ example: 'Comedy' })
    @IsOptional()
    @IsString()
    movieGenreName?: string;
}
