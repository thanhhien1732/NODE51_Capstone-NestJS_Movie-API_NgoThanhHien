import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateUserRatingDto {
    @ApiProperty({ example: 1, description: 'ID của phim' })
    @IsNotEmpty()
    @IsInt()
    movieId: number;

    @ApiProperty({ example: 8, description: 'Đánh giá từ 1 đến 10' })
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    @Max(10)
    rating: number;

    @ApiPropertyOptional({ example: 'Phim rất hay!' })
    @IsOptional()
    @IsString()
    comment?: string;
}
