import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FindAllCinemaAreaDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    page?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsInt()
    pageSize?: number;

    @ApiPropertyOptional({
        example: 'Hồ Chí Minh',
        description: 'Keyword tìm kiếm theo tên khu vực'
    })
    @IsOptional()
    @IsString()
    keyword?: string;
}
