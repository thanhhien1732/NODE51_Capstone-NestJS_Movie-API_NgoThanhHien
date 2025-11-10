import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, IsEnum } from 'class-validator';

export class FindAllBookingDto {
    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsInt()
    @Min(1)
    @IsOptional()
    pageSize?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    userId?: number;

    @ApiPropertyOptional({ example: 3 })
    @IsOptional()
    @IsInt()
    showtimeId?: number;

    @ApiPropertyOptional({
        example: 'PENDING',
        enum: ['PENDING', 'PAID', 'CANCELED'],
        description: 'Filter by payment status',
    })
    @IsOptional()
    @IsEnum(['PENDING', 'PAID', 'CANCELED'])
    paymentStatus?: 'PENDING' | 'PAID' | 'CANCELED';
}
