import { Controller, Get, Post, Param, Query, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { FindAllCinemaDto } from './dto/find-all-cinema.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';

@ApiTags('Cinema')
@Controller('cinema')
@ApiBearerAuth()
export class CinemaController {
  constructor(private readonly service: CinemaService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create new cinema' })
  @MessageResponse('Cinema created successfully!')
  create(@Query() dto: CreateCinemaDto) {
    return this.service.create(dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all cinemas (pagination + keyword + filters)' })
  @MessageResponse('Cinema list retrieved successfully!')
  findAll(@Query() query: FindAllCinemaDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Find cinema by ID' })
  @MessageResponse('Cinema retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update cinema' })
  @MessageResponse('Cinema updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdateCinemaDto) {
    return this.service.update(id, dto);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete cinema' })
  @MessageResponse('Cinema deleted successfully!')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // ------------------ RESTORE ------------------
  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore deleted cinema' })
  @MessageResponse('Cinema restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
