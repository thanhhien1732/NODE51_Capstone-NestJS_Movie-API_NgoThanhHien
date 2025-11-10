import { Module } from '@nestjs/common';
import { AgeLimitService } from './movie-age-limit.service';
import { AgeLimitController } from './movie-age-limit.controller';

@Module({
  controllers: [AgeLimitController],
  providers: [AgeLimitService],
})
export class AgeLimitModule { }
