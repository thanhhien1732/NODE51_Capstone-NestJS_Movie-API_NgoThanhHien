import { Controller, Get, Param, Post, Put, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { ScreenTechService } from './room-screen.service';
import { CreateScreenTechDto } from './dto/create-room-screen.dto';
import { UpdateScreenTechDto } from './dto/update-room-screendto';
import { FindAllScreenTechDto } from './dto/find-all-room-screen.dto';

@ApiTags('Screen Technology')
@Controller('screen-tech')
@ApiBearerAuth()
export class ScreenTechController {
  constructor(private readonly service: ScreenTechService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create new screen technology' })
  @MessageResponse('Screen technology created successfully!')
  create(@Query() dto: CreateScreenTechDto) {
    return this.service.create(dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all screen technologies (pagination optional)' })
  @MessageResponse('Screen technology list retrieved successfully!')
  findAll(@Query() query: FindAllScreenTechDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Find screen technology by ID' })
  @MessageResponse('Screen technology retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update screen technology' })
  @MessageResponse('Screen technology updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdateScreenTechDto) {
    return this.service.update(id, dto);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete screen technology' })
  @MessageResponse('Screen technology deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  // ------------------ RESTORE ------------------
  @Post(':id')
  @ApiOperation({ summary: 'Restore deleted screen technology' })
  @MessageResponse('Screen technology restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
