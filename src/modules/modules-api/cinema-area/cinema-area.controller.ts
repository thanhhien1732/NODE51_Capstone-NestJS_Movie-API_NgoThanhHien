import { Body, Controller, Get, Param, Post, Put, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CinemaAreaService } from './cinema-area.service';
import { CreateCinemaAreaDto } from './dto/create-cinema-area.dto';
import { UpdateCinemaAreaDto } from './dto/update-cinema-area.dto';
import { FindAllCinemaAreaDto } from './dto/find-all-cinema-area.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';

@ApiTags('Cinema Areas')
@Controller('cinema-areas')
@ApiBearerAuth()
export class CinemaAreaController {
  constructor(private readonly service: CinemaAreaService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new cinema area' })
  @MessageResponse('New cinema area created successfully!')
  create(@Query() dto: CreateCinemaAreaDto) {
    return this.service.create(dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all cinema areas (with pagination & keyword)' })
  @MessageResponse('Cinema area list retrieved successfully!')
  findAll(@Query() query: FindAllCinemaAreaDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Find cinema area by ID' })
  @MessageResponse('Cinema area retrieved successfully!')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cinema area' })
  @MessageResponse('Cinema area updated successfully!')
  update(@Param('id') id: string, @Query() dto: UpdateCinemaAreaDto) {
    return this.service.update(Number(id), dto);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete cinema area' })
  @MessageResponse('Cinema area deleted successfully!')
  delete(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }

  // ------------------ RESTORE ------------------
  @Post(':id/restore')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore deleted cinema area' })
  @MessageResponse('Cinema area restored successfully!')
  restore(@Param('id') id: string) {
    return this.service.restore(Number(id));
  }
}
