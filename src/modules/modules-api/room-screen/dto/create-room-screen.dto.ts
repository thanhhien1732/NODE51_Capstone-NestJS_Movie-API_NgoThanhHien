import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateScreenTechDto {
    @ApiProperty({
        example: 'IMAX',
        description: 'Tên công nghệ màn hình'
    })
    @IsNotEmpty()
    @IsString()
    screenName: string;

    @ApiPropertyOptional({
        example: 'Màn hình siêu lớn, cong, bao trùm',
        description: 'Mô tả công nghệ màn hình'
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 1.3, description: 'Hệ số giá vé của công nghệ màn hình' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    multiplier: number;
}
