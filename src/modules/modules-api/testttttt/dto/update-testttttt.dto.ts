import { PartialType } from '@nestjs/swagger';
import { CreateTesttttttDto } from './create-testttttt.dto';

export class UpdateTesttttttDto extends PartialType(CreateTesttttttDto) {}
