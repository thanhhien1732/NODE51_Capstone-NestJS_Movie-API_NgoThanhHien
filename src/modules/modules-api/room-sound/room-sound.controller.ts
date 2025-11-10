import { Controller, Get, Param, Post, Put, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { SoundSystemService } from './room-sound.service';
import { CreateSoundSystemDto } from './dto/create-room-sound.dto';
import { UpdateSoundSystemDto } from './dto/update-room-sound.dto';
import { FindAllSoundSystemDto } from './dto/find-all-room-sound.dto';

@ApiTags('Sound System')
@Controller('sound-system')
@ApiBearerAuth()
export class SoundSystemController {
  constructor(private readonly service: SoundSystemService) { }

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({ summary: 'Create new sound system' })
  @MessageResponse('Sound system created successfully!')
  create(@Query() dto: CreateSoundSystemDto) {
    return this.service.create(dto);
  }

  // ------------------ FIND ALL ------------------
  @Get()
  @ApiOperation({ summary: 'Find all sound systems (pagination optional)' })
  @MessageResponse('Sound system list retrieved successfully!')
  findAll(@Query() query: FindAllSoundSystemDto) {
    return this.service.findAll(query);
  }

  // ------------------ FIND ONE ------------------
  @Get(':id')
  @ApiOperation({ summary: 'Find sound system by ID' })
  @MessageResponse('Sound system retrieved successfully!')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ------------------ UPDATE ------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update sound system' })
  @MessageResponse('Sound system updated successfully!')
  update(@Param('id', ParseIntPipe) id: number, @Query() dto: UpdateSoundSystemDto) {
    return this.service.update(id, dto);
  }

  // ------------------ DELETE ------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete sound system' })
  @MessageResponse('Sound system deleted successfully!')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  // ------------------ RESTORE ------------------
  @Post(':id')
  @ApiOperation({ summary: 'Restore deleted sound system' })
  @MessageResponse('Sound system restored successfully!')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
