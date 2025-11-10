import { Module } from '@nestjs/common';
import { TesttttttService } from './testttttt.service';
import { TesttttttController } from './testttttt.controller';

@Module({
  controllers: [TesttttttController],
  providers: [TesttttttService],
})
export class TesttttttModule {}
