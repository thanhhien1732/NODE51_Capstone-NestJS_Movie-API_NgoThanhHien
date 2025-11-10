import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCinemaBrandDto {
    @ApiProperty({
        example: 'CGV',
        description: 'Tên thương hiệu rạp phim'
    })
    @IsString()
    @IsNotEmpty()
    brandName: string;

    @ApiPropertyOptional({
        type: 'string',
        format: 'binary',
        description: 'Logo image file to upload',
    })
    @IsOptional()
    file?: any;

    @ApiProperty({ example: 1.5, description: 'Hệ số giá vé của thương hiệu' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1.0)
    multiplier: number;
}
