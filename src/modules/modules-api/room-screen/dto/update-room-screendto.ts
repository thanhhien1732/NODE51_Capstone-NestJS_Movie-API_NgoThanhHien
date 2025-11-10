import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateScreenTechDto } from './create-room-screen.dto';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateScreenTechDto extends PartialType(CreateScreenTechDto) {
    @ApiPropertyOptional({ example: 'IMAX 3D' })
    @IsOptional()
    @IsString()
    screenName?: string;

    @ApiPropertyOptional({
        example: 'Màn hình siêu lớn, cong, bao trùm, 3D',
        description: 'Mô tả công nghệ màn hình'
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 1.5, description: 'Hệ số giá vé của công nghệ màn hình' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    multiplier?: number;
}
