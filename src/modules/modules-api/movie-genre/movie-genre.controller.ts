import { Controller, Get, Post, Put, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MovieGenreService } from './movie-genre.service';
import { CreateMovieGenreDto } from './dto/create-movie-genre.dto';
import { UpdateMovieGenreDto } from './dto/update-movie-genre.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { FindAllMovieGenreDto } from './dto/find-all-movie-genre.dto';

@ApiTags('Movie Genre')
@Controller('movie-genre')
@ApiBearerAuth()
export class MovieGenreController {
  constructor(private readonly service: MovieGenreService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create a new movie genre' })
  @MessageResponse('Movie genre created successfully!')
  create(@Query() dto: CreateMovieGenreDto) {
    return this.service.create(dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all movie genres (with pagination, optional)' })
  @MessageResponse('Movie genres retrieved successfully!')
  findAll(@Query() query: FindAllMovieGenreDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get movie genre detail by ID' })
  @MessageResponse('Movie genre retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update movie genre' })
  @MessageResponse('Movie genre updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdateMovieGenreDto) {
    return this.service.update(id, dto);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete movie genre' })
  @MessageResponse('Movie genre deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  // ------------------ RESTORE ------------------
  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore deleted movie genre' })
  @MessageResponse('Movie genre restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
