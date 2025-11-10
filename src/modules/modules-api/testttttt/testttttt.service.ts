import { Injectable } from '@nestjs/common';
import { CreateTesttttttDto } from './dto/create-testttttt.dto';
import { UpdateTesttttttDto } from './dto/update-testttttt.dto';

@Injectable()
export class TesttttttService {
  create(createTesttttttDto: CreateTesttttttDto) {
    return 'This action adds a new testttttt';
  }

  findAll() {
    return `This action returns all testttttt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testttttt`;
  }

  update(id: number, updateTesttttttDto: UpdateTesttttttDto) {
    return `This action updates a #${id} testttttt`;
  }

  remove(id: number) {
    return `This action removes a #${id} testttttt`;
  }
}
