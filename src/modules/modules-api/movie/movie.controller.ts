import { Controller, Get, Post, Put, Delete, Param, Query, ParseIntPipe, UseInterceptors, BadRequestException, UploadedFile, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { FindAllMovieDto } from './dto/find-all-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Movie')
@Controller('movie')
@ApiBearerAuth()
export class MovieController {
  constructor(private readonly service: MovieService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create new movie (with poster upload)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMovieDto })
  @MessageResponse('Movie created successfully!')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Only image files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateMovieDto) {
    return this.service.create(dto, file);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all movies (with pagination, filters, keyword)' })
  @MessageResponse('Movie list retrieved successfully!')
  findAll(@Query() query: FindAllMovieDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get movie detail by ID' })
  @MessageResponse('Movie retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update movie info or replace poster' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateMovieDto })
  @MessageResponse('Movie updated successfully!')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Only image files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  update(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File, @Body() dto: UpdateMovieDto) {
    return this.service.update(id, dto, file);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete movie' })
  @MessageResponse('Movie deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  // ------------------ RESTORE ------------------
  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore deleted movie' })
  @MessageResponse('Movie restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
