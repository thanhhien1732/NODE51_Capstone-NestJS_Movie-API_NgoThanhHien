import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateAgeLimitDto } from './create-movie-age-limit.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAgeLimitDto extends PartialType(CreateAgeLimitDto) {
    @ApiPropertyOptional({ example: 'C18' })
    @IsOptional()
    @IsString()
    ageLabel?: string;

    @ApiPropertyOptional({ example: 'Phim chỉ dành cho khán giả từ 18 tuổi trở lên' })
    @IsOptional()
    @IsString()
    description?: string;
}
