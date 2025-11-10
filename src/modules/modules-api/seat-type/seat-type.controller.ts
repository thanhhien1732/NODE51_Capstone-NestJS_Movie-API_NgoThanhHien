import { Controller, Get, Post, Put, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SeatTypeService } from './seat-type.service';
import { CreateSeatTypeDto } from './dto/create-seat-type.dto';
import { UpdateSeatTypeDto } from './dto/update-seat-type.dto';
import { FindAllSeatTypeDto } from './dto/find-all-seat-type.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';

@ApiTags('Seat Type')
@Controller('seat-type')
@ApiBearerAuth()
export class SeatTypeController {
  constructor(private readonly service: SeatTypeService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create a new seat type' })
  @MessageResponse('Seat type created successfully!')
  create(@Query() dto: CreateSeatTypeDto) {
    return this.service.create(dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all seat types (with pagination, optional)' })
  @MessageResponse('Seat type list retrieved successfully!')
  findAll(@Query() query: FindAllSeatTypeDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get seat type detail by ID' })
  @MessageResponse('Seat type retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update seat type' })
  @MessageResponse('Seat type updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdateSeatTypeDto) {
    return this.service.update(id, dto);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete seat type' })
  @MessageResponse('Seat type deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  // ------------------ RESTORE ------------------
  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore deleted seat type' })
  @MessageResponse('Seat type restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
