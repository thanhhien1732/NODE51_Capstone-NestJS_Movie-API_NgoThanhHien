import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCinemaBrandDto } from './create-cinema-brand.dto';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

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

    @Transform(({ value }) =>
        value === '' || value === null || value === undefined ? undefined : Number(value)
    )
    @ApiPropertyOptional({ example: 1.5, description: 'Hệ số giá vé của thương hiệu' })
    @IsOptional()
    @IsNumber()
    multiplier?: number;
}
