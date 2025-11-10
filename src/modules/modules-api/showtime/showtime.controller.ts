import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { FindAllShowtimeDto } from './dto/find-all-showtime.dto';

@ApiTags('Showtimes')
@ApiBearerAuth()
@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly service: ShowtimeService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create a new showtime (auto-calculate base price)' })
  @MessageResponse('Showtime created successfully!')
  create(@Query() dto: CreateShowtimeDto) {
    return this.service.create(dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all showtimes (with pagination, optional)' })
  @MessageResponse('Showtimes retrieved successfully!')
  findAll(@Query() query: FindAllShowtimeDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get showtime detail by ID' })
  @MessageResponse('Showtime retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update showtime info (auto-update base price if related data changes)' })
  @MessageResponse('Showtime updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdateShowtimeDto) {
    return this.service.update(id, dto);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete showtime' })
  @MessageResponse('Showtime deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  // ------------------ RESTORE ------------------
  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore deleted showtime' })
  @MessageResponse('Showtime restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
