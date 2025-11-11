import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateUserRatingDto {
    @ApiPropertyOptional({ example: 9, description: 'Điểm đánh giá phim (0-10)' })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(10)
    rating?: number;

    @ApiPropertyOptional({
        example: 'Sau khi xem lại thì thấy phim rất cảm động.',
        description: 'Bình luận mới (nếu có chỉnh sửa)',
    })
    @IsOptional()
    @IsString()
    comment?: string;
}
