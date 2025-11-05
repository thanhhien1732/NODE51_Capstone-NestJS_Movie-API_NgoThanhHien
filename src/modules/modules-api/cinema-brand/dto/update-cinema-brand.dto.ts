import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCinemaBrandDto } from './create-cinema-brand.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCinemaBrandDto extends PartialType(CreateCinemaBrandDto) {
    @ApiProperty({
        example: 'CGV',
        description: 'Tên thương hiệu rạp phim'
    })
    @IsString()
    @IsOptional()
    brandName?: string;

    @ApiPropertyOptional({
        type: 'string',
        format: 'binary',
        description: 'Logo image file to upload',
    })
    @IsOptional()
    file?: any;
}
