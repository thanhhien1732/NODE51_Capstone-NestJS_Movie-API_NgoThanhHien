import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { MovieFormatService } from './movie-format.service';
import { CreateMovieFormatDto } from './dto/create-moive-format.dto';
import { FindAllMovieFormatDto } from './dto/find-all-movie-format.dto';
import { UpdateMovieFormatDto } from './dto/update-moive-format.dto';

@ApiTags('Movie Format')
@Controller('movie-format')
@ApiBearerAuth()
export class MovieFormatController {
  constructor(private readonly service: MovieFormatService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create a new movie format' })
  @MessageResponse('Movie format created successfully!')
  create(@Query() dto: CreateMovieFormatDto) {
    return this.service.create(dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all movie formats (with pagination, optional)' })
  @MessageResponse('Movie formats retrieved successfully!')
  findAll(@Query() query: FindAllMovieFormatDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get movie format detail by ID' })
  @MessageResponse('Movie format retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update movie format' })
  @MessageResponse('Movie format updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdateMovieFormatDto) {
    return this.service.update(id, dto);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete movie format' })
  @MessageResponse('Movie format deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  // ------------------ RESTORE ------------------
  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore deleted movie format' })
  @MessageResponse('Movie format restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
