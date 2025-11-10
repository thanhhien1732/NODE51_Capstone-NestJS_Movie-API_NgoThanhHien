import { Module } from '@nestjs/common';
import { MovieGenreService } from './movie-genre.service';
import { MovieGenreController } from './movie-genre.controller';

@Module({
  controllers: [MovieGenreController],
  providers: [MovieGenreService],
})
export class MovieGenreModule {}
