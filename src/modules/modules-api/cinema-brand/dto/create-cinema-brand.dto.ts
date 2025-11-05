import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
