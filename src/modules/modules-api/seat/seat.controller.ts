import { Controller, Get, Post, Put, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { FindAllSeatDto } from './dto/find-all-seat.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';

@ApiTags('Seat')
@Controller('seat')
@ApiBearerAuth()
export class SeatController {
  constructor(private readonly service: SeatService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create a new seat' })
  @MessageResponse('Seat created successfully!')
  create(@Query() dto: CreateSeatDto) {
    return this.service.create(dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all seats (with pagination, optional)' })
  @MessageResponse('Seat list retrieved successfully!')
  findAll(@Query() query: FindAllSeatDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get seat detail by ID' })
  @MessageResponse('Seat retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update seat info' })
  @MessageResponse('Seat updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdateSeatDto) {
    return this.service.update(id, dto);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete seat' })
  @MessageResponse('Seat deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  // ------------------ RESTORE ------------------
  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore deleted seat' })
  @MessageResponse('Seat restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
