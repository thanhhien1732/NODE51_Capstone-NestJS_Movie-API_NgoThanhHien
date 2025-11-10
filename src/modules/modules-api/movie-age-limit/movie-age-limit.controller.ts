import { Controller, Get, Post, Put, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { AgeLimitService } from './movie-age-limit.service';
import { CreateAgeLimitDto } from './dto/create-movie-age-limit.dto';
import { FindAllAgeLimitDto } from './dto/find-all-movie-age-limit.dto';
import { UpdateAgeLimitDto } from './dto/update-movie-age-limit.dto';

@ApiTags('Age Limit')
@Controller('age-limit')
@ApiBearerAuth()
export class AgeLimitController {
  constructor(private readonly service: AgeLimitService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create a new age limit' })
  @MessageResponse('Age limit created successfully!')
  create(@Query() dto: CreateAgeLimitDto) {
    return this.service.create(dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all age limits (with pagination, optional)' })
  @MessageResponse('Age limits retrieved successfully!')
  findAll(@Query() query: FindAllAgeLimitDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get age limit detail by ID' })
  @MessageResponse('Age limit retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update age limit' })
  @MessageResponse('Age limit updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdateAgeLimitDto) {
    return this.service.update(id, dto);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete age limit' })
  @MessageResponse('Age limit deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  // ------------------ RESTORE ------------------
  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore deleted age limit' })
  @MessageResponse('Age limit restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
