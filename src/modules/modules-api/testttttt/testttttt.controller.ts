import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TesttttttService } from './testttttt.service';
import { CreateTesttttttDto } from './dto/create-testttttt.dto';
import { UpdateTesttttttDto } from './dto/update-testttttt.dto';

@Controller('testttttt')
export class TesttttttController {
  constructor(private readonly testtttttService: TesttttttService) {}

  @Post()
  create(@Body() createTesttttttDto: CreateTesttttttDto) {
    return this.testtttttService.create(createTesttttttDto);
  }

  @Get()
  findAll() {
    return this.testtttttService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testtttttService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTesttttttDto: UpdateTesttttttDto) {
    return this.testtttttService.update(+id, updateTesttttttDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testtttttService.remove(+id);
  }
}
