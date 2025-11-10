import { Controller, Get, Param, Post, Put, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomsService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FindAllRoomDto } from './dto/find-all-room.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';

@ApiTags('Room')
@Controller('room')
@ApiBearerAuth()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create new room' })
  @MessageResponse('Room created successfully!')
  create(@Query() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all rooms (with optional pagination & filters)' })
  @MessageResponse('Room list retrieved successfully!')
  findAll(@Query() query: FindAllRoomDto) {
    return this.roomsService.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Find room by ID' })
  @MessageResponse('Room retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update room' })
  @MessageResponse('Room updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete room' })
  @MessageResponse('Room deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.delete(id);
  }

  // ------------------ RESTORE ------------------
  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore deleted room' })
  @MessageResponse('Room restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.restore(id);
  }
}
